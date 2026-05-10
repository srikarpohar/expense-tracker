export const addTokenRequestInterceptor = (config: any) => {
  // Since we're using httpOnly cookies, the token is sent automatically
  // with withCredentials: true. No need to manually add Authorization header.
  return config;
};
