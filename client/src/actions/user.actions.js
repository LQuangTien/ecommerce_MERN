import axios from "../helpers/axios";
import { userConstants } from "./constants";
export const getAddress = () => {
  return async (dispatch) => {
    try {
      dispatch({ type: userConstants.GET_ADDRESS_REQUEST });
      const res = await axios.get("/user/address");
      if (res.status === 200) {
        const { userAddress } = res.data;
        const { address } = userAddress;
        dispatch({
          type: userConstants.GET_ADDRESS_SUCCESS,
          payload: { address },
        });
      }
    } catch (error) {
      dispatch({
        type: userConstants.GET_ADDRESS_FAILURE,
        payload: { error },
      });
    }
  };
};
export const addAddress = (address) => {
  return async (dispatch) => {
    dispatch({ type: userConstants.ADD_ADDRESS_REQUEST });
    const res = await axios.post("/user/address/add", { address });
    if (res.status === 201) {
      const { userAddress } = res.data;
      const { address } = userAddress;

      dispatch({
        type: userConstants.ADD_ADDRESS_SUCCESS,
        payload: { address },
      });
    } else {
      dispatch({
        type: userConstants.ADD_ADDRESS_FAILURE,
        payload: { error: res.data.error },
      });
    }
  };
};
export const updateAddress = (address) => {
  return async (dispatch) => {
    dispatch({ type: userConstants.UPDATE_ADDRESS_REQUEST });
    const res = await axios.put("/user/address/update", { address });
    if (res.status === 201) {
      const { userAddress } = res.data;
      const { address } = userAddress;
      dispatch({
        type: userConstants.UPDATE_ADDRESS_SUCCESS,
        payload: { address },
      });
    } else {
      dispatch({
        type: userConstants.UPDATE_ADDRESS_FAILURE,
        payload: { error: res.data.error },
      });
    }
  };
};
