import axios from "../helpers/axios";
import { authConstants } from "./constants";

export const login = (data) => {
  return async (dispatch) => {
    dispatch({ type: authConstants.LOGIN_REQUEST });
    try {
      const res = await axios.post("signin", { ...data });
      const { token, user } = res.data;
      localStorage.setItem("token", token);
      localStorage.setItem("user", JSON.stringify(user));
      dispatch({
        type: authConstants.LOGIN_SUCCESS,
        payload: { token, user },
      });
    } catch (error) {
      dispatch({
        type: authConstants.LOGIN_FAILURE,
        payload: { error: error.response.data.error },
      });
    }
  };
};
export const isUserLoggedIn = () => {
  return async (dispatch) => {
    const token = localStorage.getItem("token");
    const user = JSON.parse(localStorage.getItem("user"));

    if (token) {
      dispatch({
        type: authConstants.LOGIN_SUCCESS,
        payload: { token, user },
      });
    } else {
      dispatch({
        type: authConstants.LOGIN_FAILURE,
        payload: { error: "" },
      });
    }
  };
};

export const signout = () => {
  return async (dispatch) => {
    dispatch({ type: authConstants.LOGOUT_SUCCESS });
    axios.defaults.headers.common["Authorization"] = "";
    localStorage.removeItem("token");
    localStorage.removeItem("user");
  };
};
