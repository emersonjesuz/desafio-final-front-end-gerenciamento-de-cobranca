import axios from "axios";
import { pegandoItemNoLocalStorage } from "../utils/armazenamento";

const apiBack = axios.create({
  baseURL: "https://calm-coat-hen.cyclic.app",
  timeout: 10000,
  headers: { "Content-Type": "application/json" },
});
apiBack.interceptors.request.use(
  async (config) => {
    const token = pegandoItemNoLocalStorage("token");
    if (token) {
      config.headers = {
        ...config.headers,
        Authorization: `Bearer ${token}`,
      };
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default apiBack;
