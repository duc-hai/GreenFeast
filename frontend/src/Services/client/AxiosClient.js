import axios from "axios";
import { getCookie } from "../../utils/Cookie";

export default function getInstanceAxios(baseAPI) {
  const instance = axios.create({
    baseURL: baseAPI,
  });
  instance.interceptors.request.use(
    function (config) {
      const token = getCookie("accessToken");
      config.headers = {
        ...config.headers,
        Accept: "application/json",
        "Content-Type": "application/json",
      };
      if (token) {
        config.headers.Authorization = `Bearer ${token}`; // Thêm token vào header Authorization
      }

      return config;
    },
    function (error) {
      return Promise.reject(error);
    }
  );

  instance.interceptors.response.use(
    function (response) {
      try {
        if (response.status !== 200) return Promise.reject(response.data);
        return response.data;
      } catch (error) {
        return Promise.reject(error);
      }
    },
    function (error) {
      if (error && error.response) {
        const { status } = error.response;
        if (status === 401) {
          console.log(error);
        }
      }
      return Promise.reject(error);
    }
  );
  return instance;
}
