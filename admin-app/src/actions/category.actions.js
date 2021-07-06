import axios from "../helpers/axios";
import { categoryConstants } from "./constants";

export const getAllCategory = () => {
  return async (dispatch) => {
    dispatch({ type: categoryConstants.GET_ALL_REQUEST });

    const res = await axios.get("category/");
    if (res.status === 200) {
      const { categories } = res.data;
      dispatch({
        type: categoryConstants.GET_ALL_SUCCESS,
        payload: { categories },
      });
    } else {
      dispatch({
        type: categoryConstants.GET_ALL_FAILURE,
        payload: res.data.error,
      });
    }
  };
};
export const addCategory = (form) => {
  return async (dispatch) => {
    dispatch({ type: categoryConstants.ADD_REQUEST });
    const res = await axios.post("category/create", form);
    if (res.status === 201) {
      const { category } = res.data;
      dispatch({
        type: categoryConstants.ADD_SUCCESS,
        payload: { category },
      });
    } else {
      dispatch({
        type: categoryConstants.ADD_FAILURE,
        payload: res.data.error,
      });
    }
  };
};
