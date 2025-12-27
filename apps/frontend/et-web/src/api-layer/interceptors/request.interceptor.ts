export const addTokenRequestInterceptor = (config: any) => {
  // TODO: change this token usage.
  const token = localStorage.getItem("authToken");
  if (token) {
    config.headers = {
      ...config.headers,
      Authorization: `Bearer ${token}`,
    };
  }
  return config;
};
