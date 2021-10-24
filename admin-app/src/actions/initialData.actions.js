import {
  categoryConstants,
  initialDataConstants,
  orderConstants,
  productConstants,
} from "./constants";
import axios from "../helpers/axios";

export const getInitialData = () => {
  return async (dispatch) => {
    dispatch({ type: initialDataConstants.GET_INITIALDATA_REQUEST });
    const res = await axios.get("admin/initialdata");
    if (res.status === 200) {
      const { categories, products, orders } = res.data.data;
      dispatch({
        type: categoryConstants.GET_ALL_CATEGORY_SUCCESS,
        payload: { categories },
      });
      dispatch({
        type: productConstants.GET_ALL_PRODUCT_SUCCESS,
        payload: { products },
      });
      dispatch({
        type: orderConstants.GET_ORDER_SUCCESS,
        payload: { orders },
      });
    }
  };
};
