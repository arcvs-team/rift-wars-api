export interface HttpRequest {
  url: string
  method: 'post' | 'get' | 'put' | 'delete'
  body?: any
  headers?: any
}

export interface HttpResponse<T> {
  statusCode: number
  body: T
}

export interface HttpClient {
  request: <T>(data: HttpRequest) => Promise<HttpResponse<T>>
}
