import axios from "../helpers/axios";
import { categoryConstants } from "./constants";
export const getCategory = (id) => {
  return async (dispatch) => {
    dispatch({ type: categoryConstants.GET_CATEGORY_REQUEST });

    const res = await axios.get(`category/${id}`);
    if (res.status === 200) {
      const category = res.data.data;
      dispatch({
        type: categoryConstants.GET_CATEGORY_SUCCESS,
        payload: category,
      });
    } else {
      dispatch({
        type: categoryConstants.GET_CATEGORY_FAILURE,
        payload: res.data.error,
      });
    }
  };
};
export const getAllCategory = () => {
  return async (dispatch) => {
    dispatch({ type: categoryConstants.GET_ALL_CATEGORY_REQUEST });

    const res = await axios.get("category/");
    if (res.status === 200) {
      const categories = res.data.data;
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
      const category = res.data.data;
      dispatch({
        type: categoryConstants.ADD_CATEGORY_SUCCESS,
        payload: { category },
      });
      dispatch(getAllCategory());
    } else {
      dispatch({
        type: categoryConstants.ADD_CATEGORY_FAILURE,
        payload: { error: res.data.error },
      });
    }
  };
};
export const editCategory = (form) => {
  return async (dispatch) => {
    dispatch({ type: categoryConstants.UPDATE_CATEGORY_REQUEST });
    const res = await axios.put(`category/${form.id}`, form);
    if (res.status === 200) {
      dispatch({ type: categoryConstants.UPDATE_CATEGORY_SUCCESS });
      dispatch(getAllCategory());
    } else {
      dispatch({
        type: categoryConstants.UPDATE_CATEGORY_FAILURE,
        payload: { error: res.data.error },
      });
    }
  };
};
export const deleteCategory = (id) => {
  return async (dispatch) => {
    dispatch({ type: categoryConstants.DELETE_CATEGORY_REQUEST });
    const res = await axios.delete(`category/${id}`);
    if (res.status === 200) {
      dispatch({ type: categoryConstants.DELETE_CATEGORY_SUCCESS });
      dispatch(getAllCategory());
    } else {
      dispatch({
        type: categoryConstants.DELETE_CATEGORY_FAILURE,
        payload: { error: res.data.error },
      });
    }
  };
};
