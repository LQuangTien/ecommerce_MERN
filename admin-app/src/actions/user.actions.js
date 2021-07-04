import axios from "../helpers/axios";
import { userConstants } from "./constants";

export const signup = (user) => {
  return async (dispatch) => {
    dispatch({ type: userConstants.REGISTER_REQUEST });
    const res = await axios.post("/admin/signup", { ...user });
    if (res.status === 201) {
      const { email } = res.data;
      dispatch({
        type: userConstants.REGISTER_SUCCESS,
        payload: { message: email + " is registered completely!" },
      });
    } else {
      dispatch({
        type: userConstants.REGISTER_FAILURE,
        payload: { error: res.data.error },
      });
    }
  };
};
