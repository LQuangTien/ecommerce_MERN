import axios from "../helpers/axios";
import { productConstants } from "./constants";
export const addProduct = (form) => {
  return async (dispatch) => {
    const res = await axios.post("product/create", form);
  };
};
export const getProductById = (params) => {
  return async (dispatch) => {
    dispatch({ type: productConstants.GET_PRODUCT_DETAIL_REQUEST });
    let res;
    try {
      const { id } = params;
      res = await axios.get(`product/${id}`);
      const productDetails = {
        ...res.data.data,
        price: res.data.data.salePrice,
      };
      dispatch({
        type: productConstants.GET_PRODUCT_DETAIL_SUCCESS,
        payload: productDetails,
      });
    } catch (error) {
      dispatch({
        type: productConstants.GET_PRODUCT_DETAIL_FAILURE,
        payload: { error: error.response.data.error },
      });
    }
  };
};
