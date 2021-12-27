import {
  categoryConstants,
  initialDataConstants,
  orderConstants,
  productConstants,
  statisticConstants,
} from "./constants";
import axios from "../helpers/axios";

export const getInitialData = (year = new Date().getFullYear()) => {
  return async (dispatch) => {
    dispatch({ type: initialDataConstants.GET_INITIALDATA_REQUEST });
    const res = await axios.get(`admin/initialdata?year=${year}`);
    if (res.status === 200) {
      const { categories, products, orders, statistic } = res.data.data;
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
      dispatch({
        type: statisticConstants.GET_STATISTIC_SUCCESS,
        payload: { statistic },
      });
      dispatch({ type: initialDataConstants.GET_INITIALDATA_SUCCESS });
    }
  };
};
export const getTotalOrderPricePerMonthByYear = (
  year = new Date().getFullYear()
) => {
  return async (dispatch) => {
    dispatch({ type: initialDataConstants.GET_INITIALDATA_REQUEST });
    const res = await axios.get(
      `/admin/totalOrderPricePerMonthByYear?year=${year}`
    );
    if (res.status === 200) {
      const { statistic } = res.data.data;
      dispatch({
        type: statisticConstants.GET_getTotalOrderPricePerMonthByYear_SUCCESS,
        payload: { statistic },
      });
      dispatch({ type: initialDataConstants.GET_INITIALDATA_SUCCESS });
    }
  };
};
