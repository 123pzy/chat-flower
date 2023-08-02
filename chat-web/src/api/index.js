import axios from "axios";
import { baseURL, timeout } from "./config";

const baseurl =
  import.meta.env.MODE == "development" ? baseURL.dev : baseURL.pro;
const instance = axios.create({
  baseURL: baseurl,
  timeout,
});

instance.interceptors.request.use(
  (config) => {
    return config;
  },
  (error) => {
    console.log(error);
  }
);

instance.interceptors.response.use(
  (res) => {
    return res;
  },
  (error) => {
    if (error.code == 404) {
      console.log("找不到页面");
    } else {
      console.log("其他错误！");
    }
  }
);


export default instance;
