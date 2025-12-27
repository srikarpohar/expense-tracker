import { type AxiosResponse } from "axios";

export const onResponseSuccessInterceptor = (response: AxiosResponse) => {
  console.log("Response received:", response);
  // Handle successful responses
  return response;
};

export const onResponseErrorInterceptor = (error: any) => {
  console.error("Response error:", error);
  // Handle errors globally (e.g., redirect on 401, display error messages)
  if (error.response && error.response.status === 401) {
    // Unauthorized, redirect to login
    // router.push('/login'); // Example with Vue Router
  }
  return Promise.reject(error);
};
