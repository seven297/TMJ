// 公共 HTTP 类型定义
export type HttpMethod = 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';

export interface ApiResponseEnvelope<T = unknown> {
  code?: number; // 后端业务码（如果有）
  message?: string; // 业务消息
  data: T; // 真实数据
}

export interface RequestOptions {
  // 当某些接口需要不同的 baseURL 时使用
  baseURL?: string;
  // 是否自动弹出错误提示（结合 UI 框架）
  showErrorMessage?: boolean;
  // 是否返回完整响应包裹（而非 data）
  returnEnvelope?: boolean;
  // 自定义 headers
  headers?: Record<string, string>;
  // URL 查询参数
  params?: Record<string, unknown>;
}

export interface PaginationQuery {
  page?: number;
  pageSize?: number;
}

export interface PaginatedResult<T> {
  list: T[];
  total: number;
}

