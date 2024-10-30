/* eslint-disable @typescript-eslint/no-explicit-any */
import { grpc } from '@improbable-eng/grpc-web'
import { BrowserHeaders } from 'browser-headers'
import { Observable, share } from 'rxjs'

import { AuthServiceClientImpl } from '@/grpc/generated/auth/service'

interface UnaryMethodDefinitionishR
  extends grpc.UnaryMethodDefinition<any, any> {
  requestStream: any
  responseStream: any
}

type UnaryMethodDefinitionish = UnaryMethodDefinitionishR

const ch = new BroadcastChannel('sw-ch')
const requestRefreshTokenMessage = 'I NEED IT FRESH!!!'

export class GrpcImpl {
  private host: string
  private options: {
    transport?: grpc.TransportFactory
    streamingTransport?: grpc.TransportFactory
    debug?: boolean
    metadata?: grpc.Metadata
  }

  constructor(
    host: string,
    options: {
      transport?: grpc.TransportFactory
      streamingTransport?: grpc.TransportFactory
      debug?: boolean
      metadata?: grpc.Metadata
    },
  ) {
    this.host = host
    this.options = options
  }

  setMetadata(metadata?: grpc.Metadata) {
    this.options.metadata = metadata
  }

  unary<T extends UnaryMethodDefinitionish>(
    methodDesc: T,
    _request: any,
    metadata: grpc.Metadata | undefined,
  ): Promise<any> {
    const request = { ..._request, ...methodDesc.requestType }
    const maybeCombinedMetadata =
      metadata && this.options.metadata
        ? new BrowserHeaders({
            ...this.options?.metadata.headersMap,
            ...metadata?.headersMap,
          })
        : metadata || this.options.metadata
    return new Promise((resolve, reject) => {
      grpc.unary(methodDesc, {
        request,
        host: this.host,
        metadata: maybeCombinedMetadata,
        transport: this.options.transport,
        debug: this.options.debug,
        onEnd: (response) => {
          if (response.status === grpc.Code.OK) {
            resolve(response.message)
          } else {
            const err = new Error(response.statusMessage) as Error & {
              code: grpc.Code
              metadata: grpc.Metadata
            }
            err.code = response.status
            err.metadata = response.trailers
            reject(err)
          }
        },
      })
    })
  }

  invoke<T extends UnaryMethodDefinitionish>(
    methodDesc: T,
    _request: any,
    metadata?: grpc.Metadata,
  ): Observable<any> {
    // Status Response Codes (https://developers.google.com/maps-booking/reference/grpc-api/status_codes)
    const upStreamCodes = [2, 4, 8, 9, 10, 13, 14, 15, 16]
    const DEFAULT_TIMEOUT_TIME = 3_000
    return new Observable((observer) => {
      const upStream = () => {
        const request = { ..._request, ...methodDesc.requestType }
        const meta = metadata ?? new grpc.Metadata()
        meta.set('authorization', `Bearer ${localStorage.getItem('token')}`)
        const client = grpc.invoke(methodDesc, {
          host: this.host,
          request,
          transport: this.options.streamingTransport || this.options.transport,
          metadata: meta,
          debug: this.options.debug,
          onMessage: (next: any) => observer.next(next),
          onEnd: (code: grpc.Code, message: string) => {
            if (code === 0) {
              observer.complete()
            } else if (upStreamCodes.includes(code)) {
              if (code === 16) {
                ch.postMessage({
                  data: requestRefreshTokenMessage,
                  realTimestamp: Date.now(),
                })
              }
              setTimeout(upStream, DEFAULT_TIMEOUT_TIME)
            } else {
              observer.error(new Error(`Error ${code} ${message}`))
            }
          },
        })
        observer.add(() => client.close())
      }
      upStream()
    }).pipe(share())
  }
}

export const API_URL = `${window.location.protocol}//${window.location.hostname}:9080` // `https://${window.location.host}/api`

export const grpcImpl = new GrpcImpl(API_URL, {
  transport: grpc.XhrTransport({
    withCredentials: true,
  }),
  streamingTransport: grpc.WebsocketTransport(),
})

export const authServiceClient = new AuthServiceClientImpl(grpcImpl)
