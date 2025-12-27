/* eslint-disable @/no-unused-vars */
import type { AxiosResponse } from "axios";

export type HTTPMethod = "GET" | "POST" | "PUT" | "DELETE";

export interface IHTTPClient {
  get<D, R>(
    endpoint: string,
    queryParams?: D,
    headers?: Record<string, string>,
  ): Promise<IApiResponse<R>>;
  post<D, R>(
    endpoint: string,
    data: D,
    headers?: Record<string, string>,
  ): Promise<IApiResponse<R>>;
  put<D, R>(
    endpoint: string,
    data: D,
    headers?: Record<string, string>,
  ): Promise<IApiResponse<R>>;
  delete<R>(
    endpoint: string,
    headers?: Record<string, string>,
  ): Promise<IApiResponse<R>>;
}

export interface IApiResponse<T> {
  statusCode: number;
  data: T;
  isLoading: boolean;
  errorMessage?: string;
}
