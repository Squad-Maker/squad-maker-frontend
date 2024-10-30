if ('serviceWorker' in navigator) {
	navigator.serviceWorker
		.register('/sw.js', {
			scope: '/',
		})
		.then((registration) => {
			// https://stackoverflow.com/questions/37559415/how-to-make-serviceworker-survive-cache-reset-shiftf5
			if (navigator.serviceWorker.controller === null) {
				navigator.serviceWorker.ready.then(() => {
					registration.active.postMessage('claimMe');
				});
			}
		});
}
