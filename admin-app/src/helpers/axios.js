import axios from "axios";
import { api } from "../urlConfig";
const axiosInstance = axios.create({
  baseURL: "http://localhost:8000/api",
  // headers: {
  //   Authorization: "",
  // },
});
export default axiosInstance;
