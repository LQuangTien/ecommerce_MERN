import axios from "axios";
import store from "../store";
import { api } from "../urlConfig";
// const token = localStorage.getItem('token');
const axiosInstance = axios.create({
  baseURL: api + "",
  headers: {
    Authorization: localStorage.getItem("token")
      ? localStorage.getItem("token")
      : "",
  },
});

axiosInstance.interceptors.request.use((req) => {
  const { auth } = store.getState();
  if (auth.token) {
    req.headers.Authorization = `${auth.token}`;
  }
  return req;
});
axiosInstance.interceptors.response.use(
  (res) => {
    return res;
  },
  (error) => {
    const { status } = error.response;
    // if(status === 500) {
    //   localStorage.clear();
    //   store.dispatch({type: authConstants.LOGOUT_SUCCESS})
    // }
    return Promise.reject(error);
  }
);
export default axiosInstance;
