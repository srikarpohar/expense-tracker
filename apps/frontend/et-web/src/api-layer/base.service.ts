import axios, {
  AxiosHeaders,
  type AxiosInstance,
  type AxiosRequestConfig,
  type AxiosResponse,
} from "axios";
import type { IApiResponse, IHTTPClient } from "../types/api.types.ts";
import { addTokenRequestInterceptor } from "./interceptors/request.interceptor.js";
import {
  onResponseErrorInterceptor,
  onResponseSuccessInterceptor,
} from "./interceptors/response.interceptors.js";

export class AxiosHttpApiRequestLayer implements IHTTPClient {
  private baseUrl: string;
  private axiosInstance: AxiosInstance;

  getAxiosInstance(): AxiosInstance {
    return this.axiosInstance;
  }

  constructor(baseUrl: string) {
    this.baseUrl = baseUrl;
    this.axiosInstance = axios.create({
      baseURL: this.baseUrl,
      headers: {
        "Content-Type": "application/json",
      },
    });
  }

  async get<D, R>(
    endpoint: string,
    queryParams?: D,
    headers?: AxiosHeaders | {},
    abortSignal?: AbortSignal,
  ): Promise<IApiResponse<R>> {
    let config: AxiosRequestConfig = {
      params: queryParams,
      headers: headers as AxiosHeaders,
      withCredentials: true,
    };

    if (abortSignal) {
      config["signal"] = abortSignal;
    }

    const response = await this.axiosInstance.get<
      R,
      AxiosResponse<IApiResponse<R>>,
      D
    >(`${this.baseUrl}${endpoint}`, config);

    return response.data;
  }

  async put<D, R>(
    endpoint: string,
    data: D,
    headers?: AxiosHeaders,
  ): Promise<IApiResponse<R>> {
    const response = await this.axiosInstance.put<
      R,
      AxiosResponse<IApiResponse<R>>,
      D
    >(`${this.baseUrl}${endpoint}`, data, {
      method: "PUT",
      headers: headers as AxiosHeaders,
    });
    return response.data;
  }

  async delete<R>(
    endpoint: string,
    headers?: AxiosHeaders,
  ): Promise<IApiResponse<R>> {
    const response = await this.axiosInstance.delete<
      R,
      AxiosResponse<IApiResponse<R>>,
      any
    >(`${this.baseUrl}${endpoint}`, {
      method: "DELETE",
      headers: headers as AxiosHeaders,
    });
    return response.data;
  }

  async post<D, R>(
    endpoint: string,
    data: D,
    headers?: AxiosHeaders,
  ): Promise<IApiResponse<R>> {
    try {
      const response = await this.axiosInstance.post<
        R,
        AxiosResponse<IApiResponse<R>>,
        D
      >(`${this.baseUrl}${endpoint}`, data, {
        method: "POST",
        headers: headers as AxiosHeaders,
        withCredentials: true,
      });
      return response.data;
    } catch (error) {
      console.log("Error in POST request:", error);
      throw error;
    }
  }

  addRequestInterceptor(callback: (config: any) => any) {
    this.axiosInstance.interceptors.request.use(callback);
  }

  addResponseInterceptor(callback: any, errorCallback?: any) {
    this.axiosInstance.interceptors.response.use(callback, errorCallback);
  }
}

const axiosHttpApiRequestLayer = new AxiosHttpApiRequestLayer(
  process.env.API_BASE_URL || "", // TODO: change this to use env variable.
);
axiosHttpApiRequestLayer.addRequestInterceptor(addTokenRequestInterceptor);
axiosHttpApiRequestLayer.addResponseInterceptor(
  onResponseSuccessInterceptor,
  onResponseErrorInterceptor,
);

export { axiosHttpApiRequestLayer };
