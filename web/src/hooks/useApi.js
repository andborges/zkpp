import axios from "axios";

import useToken from "./useToken";

const useApi = () => {
  const {
    getToken
  } = useToken();

  const api = axios.create({
    baseURL: process.env.REACT_APP_AUTH_API
  });
  
  api.interceptors.request.use(async config => {
    const token = getToken();
  
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    
    return config;
  });

  return {
    api
  }
};

export default useApi;