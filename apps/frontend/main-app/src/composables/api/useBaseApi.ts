import type {HTTPMethod, IApiResponse} from "@/types/api.types.ts";
import { reactive, watchEffect} from "vue";
import {AxiosHttpApiRequestLayer} from "@/api-layer/axios-client.ts";
import axios, {type AxiosRequestConfig, type AxiosResponse} from "axios";
import {requestInterceptor} from "@/api-layer/interceptors/request.interceptor.ts";
import {onResponseError, onResponseSuccess} from "@/api-layer/interceptors/response.interceptors.ts";

const axiosHttpApiRequestLayer = new AxiosHttpApiRequestLayer(import.meta.env.VITE_API_URL);
axiosHttpApiRequestLayer.addRequestInterceptor(requestInterceptor);
axiosHttpApiRequestLayer.addResponseInterceptor(onResponseSuccess);
axiosHttpApiRequestLayer.addResponseInterceptor(onResponseError);

export async function useBaseApi<T = string, Body = any, Query = any>(
    url: string,
    method: HTTPMethod,
    options: {
        queryParams?: Query,
        body?: Body,
        headers?: any,
        config?: AxiosRequestConfig,
    }
) {
    const apiResponse: IApiResponse<T> = reactive({
        statusCode: 0,
        data: null,
        isLoading: false,
        errorMessage: undefined,
    });

    const fetchData = async () => {
        const client = axiosHttpApiRequestLayer;
        if(!client) {
            console.error("Error while initialising axios client");
            return apiResponse;
        }

        try {
            apiResponse.isLoading = true;
            let response: AxiosResponse<IApiResponse<T>>;
            switch (method) {
                case "GET":
                    response = await client.get<Query | undefined, T>(
                        url,
                        options.queryParams,
                        options.headers
                    );
                    break;
                case "POST":
                    response = await client.post(
                        url,
                        options.body,
                        options.headers
                    );
                    break;
                case "PUT":
                    response = await client.put(
                        url,
                        options.body,
                        options.headers
                    );
                    break;
                case "DELETE":
                    response = await client.delete(
                        url,
                        options.headers
                    );
                    break;
                default:
                    console.error("Invalid method", method, url);
                    return apiResponse;
            }

            if(response) {
                apiResponse.statusCode = response.data.statusCode;
                apiResponse.isLoading = false;
                apiResponse.errorMessage = response.data.errorMessage;
                apiResponse.data = response.data.data;
            }
        } catch(err: any) {
            console.error("Error while calling API ", method, url, err.message);
            apiResponse.isLoading = false;
            apiResponse.errorMessage = err.message;
        } finally {
            apiResponse.isLoading = false;
        }
    }

    watchEffect(() => {
        fetchData();
    })

    return apiResponse;
}