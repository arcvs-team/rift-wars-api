import axios, { type AxiosInstance } from 'axios'
import { type HttpRequest, type HttpResponse, type HttpClient } from '../http-client'
import { injectable } from 'inversify'

@injectable()
export class AxiosHttpClient implements HttpClient {
  private readonly instance: AxiosInstance

  constructor () {
    this.instance = axios.create()
  }

  async request<T> (data: HttpRequest): Promise<HttpResponse<T>> {
    try {
      const { data: body, status } = await this.instance.request({
        url: data.url,
        method: data.method,
        data: data.body,
        headers: data.headers
      })

      return {
        statusCode: status,
        body
      }
    } catch (error) {
      return {
        statusCode: 500
      }
    }
  }
}
