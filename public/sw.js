(function () {
  "use strict";

  // não há nenhum motivo especial pra essas mensagens serem assim
  // elas poderiam ser qualquer coisa, então enfiei algo aleatório só por colocar mesmo
  // não é algo que vai precisar de manutenção, de qualquer forma
  const requestTokenMessage = "I NEED IT!!!";
  const requestRefreshTokenMessage = "I NEED IT FRESH!!!";

  const ignoredPaths = [
    "/auth.AuthService/CreateToken",
    "/auth.AuthService/InvalidateToken",
    "/auth.AuthService/RefreshToken",
  ];

  let token = "";
  let sessionToken = ""; // TODO remover daqui e fazer algo mais certo (ex: cookie)
  let requestingToken = false;
  let refreshingToken = false;
  let waitingForToken = true;

  // https://stackoverflow.com/questions/37559415/how-to-make-serviceworker-survive-cache-reset-shiftf5
  self.onmessage = (event) => {
    if (event.data === "claimMe") {
      self.clients.claim();
    }
  };

  const ch = new BroadcastChannel("sw-ch");
  ch.onmessage = (event) => {
    if (
      event?.data?.data !== requestTokenMessage &&
      event?.data?.data !== requestRefreshTokenMessage
    ) {
      token = (event?.data?.data?.token || token) + "";
      sessionToken = (event?.data?.data?.sessionToken || sessionToken) + "";
      waitingForToken = false;
      console.debug("sw: token defined", event, token, sessionToken);
    }
  };

  self.addEventListener("install", (event) => {
    event.waitUntil(self.skipWaiting());
  });

  self.addEventListener("activate", (event) => {
    event.waitUntil(clients.claim());
  });

  // https://stackoverflow.com/a/35421858/6762842
  self.addEventListener("fetch", (event) => {
    const url = new URL(event.request.url);
    // se utilizar um proxy reverso, dá pra deixar tudo no mesmo domínio e com a mesma porta
    // se fizer isso, descomentar este if e remover o outro
    // if (!url.pathname.startsWith('/api/')) {
    // 	return;
    // }
    if (url.port !== "9080") {
      return;
    }

    const respT = processRequest(event.request);
    event.respondWith(respT);
  });

  function getStatusFromHeaders(headers) {
    const fromHeaders = headers.get("grpc-status") || [];
    if (fromHeaders.length > 0) {
      try {
        return parseInt(fromHeaders, 10);
      } catch (e) {
        return null;
      }
    }
    return null;
  }

  async function processRequest(request) {
    const promisesToAwait = [];
    const requestContext = {
      request,
      token: "",
      sessionToken,
    };

    const reqClone = request.clone();

    if (ignoredPaths.find((ip) => request.url.indexOf(ip) > -1)) {
      console.debug("sw: request with only metadata", request);
    } else if (!requestingToken) {
      requestingToken = true;
      console.debug("sw: will request token...");
      waitingForToken = true;
      promisesToAwait.push(requestTokenAndWait(requestContext));
    } else {
      console.debug("sw: will wait for token...");
      promisesToAwait.push(waitForToken(requestContext));
    }

    await Promise.allSettled(promisesToAwait);

    const newRequest = (request, requestContext) => {
      console.debug("sw: new request", request, requestContext);
      const headers = new Headers(request.headers);
      if (requestContext.token) {
        headers.set("authorization", "Bearer " + requestContext.token);
      }
      headers.set("session-token", requestContext.sessionToken);

      // request is event.request sent by browser here
      const url = new URL(request.url);
      return new Request(request, {
        headers: headers,
        mode: !url.pathname.startsWith("/api/") ? "cors" : "same-origin",
        redirect: "manual",
      });
    };

    const req = newRequest(request, requestContext);

    try {
      const resp = await fetch(req);
      const response = resp.clone();
      let needRefresh = false;
      const status = getStatusFromHeaders(resp.headers);
      if (status === 16) {
        // gRPC Status Code 16: Unauthenticated
        needRefresh = true;
      }
      if (needRefresh) {
        if (!refreshingToken) {
          refreshingToken = true;
          requestingToken = true;
          waitingForToken = true;
          requestContext.token = "";
          requestContext.sessionToken = "";
          console.debug("sw: needRefresh && !refreshing: ", req.url);
          await refreshTokenAndWait(requestContext);
          const reReq = newRequest(reqClone.clone(), requestContext);
          const reResp = await fetch(reReq);
          console.debug("sw: will response first ");
          return new Promise((resolve) => resolve(reResp));
        } else {
          requestContext.token = "";
          requestContext.sessionToken = "";
          console.debug("sw: needrefresh && refreshing: ", req.url);
          await waitForToken(requestContext);
          const reReq = newRequest(reqClone.clone(), requestContext);
          const reResp = await fetch(reReq);
          console.debug("sw: will response second");
          return new Promise((resolve) => resolve(reResp));
        }
      }
      return new Promise((resolve) => resolve(response));
    } catch (error) {
      console.debug("sw error: ", error);
    }
  }

  // https://gist.github.com/kylewelsby/e678d5627d8f363a2419
  // não é um código muito bonito, mas vai ele mesmo...
  function promiseWhen(condition, timeout) {
    if (!timeout) {
      timeout = 2000;
    }
    return new Promise(function (resolve, reject) {
      let timedOut = false;
      let resolved = false;

      setTimeout(function () {
        if (resolved) {
          return;
        }

        timedOut = true;
        console.debug("timeout no SW", condition.toString());
        reject("timeout: " + timeout + "ms");
      }, timeout);

      function loop() {
        if (timedOut) {
          // em teoria, já chamou o reject()
          return;
        }

        if (condition()) {
          resolved = true;
          return resolve();
        }
        setTimeout(loop, 10);
      }

      setTimeout(loop, 10);
    });
  }

  async function waitForToken(requestContext) {
    console.debug(
      "sw: waiting for token...",
      requestContext.request.url,
      requestContext.request
    );
    await promiseWhen(() => {
      return !waitingForToken;
    });
    console.debug("sw: token: ", token);
    requestContext.token = token;
    requestContext.sessionToken = sessionToken;
  }

  async function requestTokenAndWait(requestContext) {
    console.debug(
      "sw: requesting token...",
      requestContext.request.url,
      requestContext.request
    );
    ch.postMessage({
      data: requestTokenMessage,
      realTimestamp: Date.now(),
    });
    await waitForToken(requestContext).finally(() => {
      requestingToken = false;
    });
  }

  async function refreshTokenAndWait(requestContext) {
    console.debug("sw: refreshing token", requestContext);
    ch.postMessage({
      data: requestRefreshTokenMessage,
      realTimestamp: Date.now(),
    });
    await waitForToken(requestContext).finally(() => {
      requestingToken = false;
      refreshingToken = false;
    });
  }
})();
