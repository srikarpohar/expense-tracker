import { type AxiosResponse } from "axios";

export const onResponseSuccessInterceptor = (response: AxiosResponse) => {
  console.log("Response received:", response);
  // Handle successful responses
  return response;
};

export const onResponseErrorInterceptor = (error: any) => {
  // Handle errors globally (e.g., redirect on 401, display error messages)
  if (error.response && error.response.status === 401) {
    // Unauthorized, redirect to login
    return Promise.reject(error.message);
  }
  return Promise.reject(error);
};
