import axios from "../helpers/axios";
import { categoryConstants } from "./constants";

export const getAllCategory = () => {
  return async (dispatch) => {
    dispatch({ type: categoryConstants.GET_ALL_CATEGORY_REQUEST });

    const res = await axios.get("category/");
    if (res.status === 200) {
      const { categories } = res.data;
      dispatch({
        type: categoryConstants.GET_ALL_CATEGORY_SUCCESS,
        payload: { categories },
      });
    } else {
      dispatch({
        type: categoryConstants.GET_ALL_CATEGORY_FAILURE,
        payload: res.data.error,
      });
    }
  };
};
export const addCategory = (form) => {
  return async (dispatch) => {
    dispatch({ type: categoryConstants.ADD_CATEGORY_REQUEST });
    const res = await axios.post("category/create", form);
    if (res.status === 201) {
      const { category } = res.data;
      dispatch({
        type: categoryConstants.ADD_CATEGORY_SUCCESS,
        payload: { category },
      });
    } else {
      dispatch({
        type: categoryConstants.ADD_CATEGORY_FAILURE,
        payload: res.data.error,
      });
    }
  };
};
export const updateCategory = (form) => {
  return async (dispatch) => {
    const res = await axios.put("category/update", form);
    if (res.status === 201) {
      return true;
    } else {
      console.log(res.data);
    }
  };
};
