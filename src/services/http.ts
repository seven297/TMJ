import axios from 'axios'
import type { AxiosError, AxiosInstance, AxiosRequestConfig, AxiosResponse } from 'axios'
import type { ApiResponseEnvelope, RequestOptions } from '@/types/http'
import { Message } from '@arco-design/web-vue'

// 运行时环境变量（Vite 只会暴露以 VITE_ 开头的）
const DEFAULT_BASE_URL = import.meta.env.VITE_API_BASE_URL || '/'
const DEFAULT_TIMEOUT = 300000

function createAxiosInstance(baseURL: string = DEFAULT_BASE_URL): AxiosInstance {
  const instance = axios.create({
    baseURL,
    timeout: DEFAULT_TIMEOUT,
    withCredentials: false,
  })

  // 请求拦截：可在此注入 token、traceId 等
  instance.interceptors.request.use((config) => {
    // 例如：从本地存储读取 token
    const token = localStorage.getItem('token')
    if (token) {
      config.headers = config.headers ?? {}
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  })

  // 响应拦截：统一数据摘取与错误处理
  instance.interceptors.response.use(
    (response: AxiosResponse<ApiResponseEnvelope<any>>) => {
      return response
    },
    (error: AxiosError) => {
      // 这里可以接入 UI 提示，比如 Arco 的 Message.error
      // Message.error(error.message)
      return Promise.reject(error)
    }
  )

  return instance
}

const httpClient = createAxiosInstance()

// 统一的请求函数
async function request<T = unknown>(
  url: string,
  config?: AxiosRequestConfig,
  options?: RequestOptions
): Promise<T | ApiResponseEnvelope<T>> {
  const { returnEnvelope, baseURL, showErrorMessage, headers, params } = options ?? {}

  const instance = baseURL ? createAxiosInstance(baseURL) : httpClient

  const mergedConfig: AxiosRequestConfig = {
    url,
    method: config?.method ?? 'GET',
    data: config?.data,
    params: params ?? config?.params,
    headers: { ...(config?.headers || {}), ...(headers || {}) },
  }

  try {
    const resp = await instance.request<ApiResponseEnvelope<T>>(mergedConfig)

    // 如果后端没有包一层 { code, message, data }，可在此做兼容
    const payload = (resp.data && 'data' in resp.data) ? resp.data : ({ data: resp.data } as ApiResponseEnvelope<T>)
    console.log(payload)
    // 业务错误统一处理（可根据具体后端规范调整）
    if (typeof payload.code === 'number' && payload.code !== 200) {
      if (showErrorMessage) {
        Message.error(payload.message || '请求失败')
      }
      return Promise.reject(payload)
    }

    return returnEnvelope ? payload : (payload.data as T)
  } catch (err) {
    if (showErrorMessage && err instanceof Error) {
      Message.error(err.message)
    }
    return Promise.reject(err)
  }
}

export const http = {
  get<T = unknown>(url: string, params?: Record<string, unknown>, options?: RequestOptions) {
    return request<T>(url, { method: 'GET', params }, options)
  },
  post<T = unknown>(url: string, data?: unknown, options?: RequestOptions) {
    return request<T>(url, { method: 'POST', data }, options)
  },
  put<T = unknown>(url: string, data?: unknown, options?: RequestOptions) {
    return request<T>(url, { method: 'PUT', data }, options)
  },
  patch<T = unknown>(url: string, data?: unknown, options?: RequestOptions) {
    return request<T>(url, { method: 'PATCH', data }, options)
  },
  delete<T = unknown>(url: string, params?: Record<string, unknown>, options?: RequestOptions) {
    return request<T>(url, { method: 'DELETE', params }, options)
  },
  // 也暴露底层实例，便于在少数场景做特殊配置
  instance: httpClient,
}

export type { ApiResponseEnvelope, RequestOptions }

