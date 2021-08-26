import axios from "../helpers/axios";
import { productConstants } from "./constants";
export const getBySlug = (slug) => {
  return async (dispatch) => {
    try {
      dispatch({ type: productConstants.GET_PRODUCT_BY_SLUG_REQUEST });
      const res = await axios.get(`products/${slug}`);
      dispatch({
        type: productConstants.GET_PRODUCT_BY_SLUG_SUCCESS,
        payload: res.data,
      });
    } catch (error) {
      console.log({error})
      dispatch({
        type: productConstants.GET_PRODUCT_BY_SLUG_FAILURE,
        payload: { error: error.response.data.error },
      });
    }
  };
};
export const getProductPage = (params) => {
  return async (dispatch) => {
    try {
      const { categoryId, type } = params;
      dispatch({ type: productConstants.GET_PAGE_REQUEST });
      const res = await axios.get(`page/${categoryId}/${type}`);
      if (res.status === 200) {
        dispatch({
          type: productConstants.GET_PAGE_SUCCESS,
          payload: { page: res.data.page },
        });
      } else {
        dispatch({
          type: productConstants.GET_PAGE_FAILURE,
          payload: { error: res.data.error },
        });
      }
    } catch (error) {
      dispatch({
        type: productConstants.GET_PAGE_FAILURE,
        payload: { error },
      });
    }
  };
};

export const getProductById = (params) => {
  return async (dispatch) => {
    dispatch({ type: productConstants.GET_DETAIL_REQUEST });
    let res;
    try {
      const { id } = params;
      res = await axios.get(`product/${id}`);
      dispatch({
        type: productConstants.GET_DETAIL_SUCCESS,
        payload: { productDetails: res.data.product },
      });
    } catch (error) {
      dispatch({
        type: productConstants.GET_DETAIL_FAILURE,
        payload: { error: error.response.data.error },
      });
    }
  };
};
