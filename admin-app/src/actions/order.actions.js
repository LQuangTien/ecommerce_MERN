import axios from "../helpers/axios";
import { orderConstants } from "./constants";

export const updateOrder = (updatedProcess) => {
  return async (dispatch) => {
    dispatch({ type: orderConstants.UPDATE_ORDER_REQUEST });
    const res = await axios.put("order/update", updatedProcess);
    if (res.status === 201) {
      dispatch({
        type: orderConstants.UPDATE_ORDER_SUCCESS,
        payload: {order: res.data.order},
      });
    } else {
      dispatch({
        type: orderConstants.UPDATE_ORDER_FAILURE,
        payload: { error: res.data.error },
      });
    }
  };
};
