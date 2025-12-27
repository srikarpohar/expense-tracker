import axios, {type AxiosResponse} from "axios";

export const onResponseSuccess = (response: AxiosResponse) => {
        // Handle successful responses
        return response;
}

export const onResponseError = (error: any) => {
    // Handle errors globally (e.g., redirect on 401, display error messages)
    if (error.response && error.response.status === 401) {
        // Unauthorized, redirect to login
        // router.push('/login'); // Example with Vue Router
    }
    return Promise.reject(error);
}