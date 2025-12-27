import type {AxiosResponse} from "axios";

export type HTTPMethod = 'GET' | 'POST' | 'PUT' | 'DELETE';

export interface IHTTPClient {
    get<D, R>(endpoint: string, queryParams: D, headers?: Record<string, string>): Promise<AxiosResponse<IApiResponse<R>>>;
    post<D, R>(endpoint: string, data: D, headers?: Record<string, string>): Promise<AxiosResponse<IApiResponse<R>>>;
    put<D, R>(endpoint: string, data: D, headers?: Record<string, string>): Promise<AxiosResponse<IApiResponse<R>>>;
    delete<R>(endpoint: string, headers?: Record<string, string>): Promise<AxiosResponse<IApiResponse<R>>>;
}

export interface IApiResponse<T> {
    statusCode: number;
    data: T | null;
    isLoading: boolean;
    errorMessage?: string;
}