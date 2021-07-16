import { pageConstants } from "./constants";
import axios from "../helpers/axios";
export const create = (form) => {
  return async (dispatch) => {
    dispatch({ type: pageConstants.CREATE_PAGE_REQUEST });
    try {
      const res = axios.post("/page/create", form);
      if (res.status === 201) {
        dispatch({
          type: pageConstants.CREATE_PAGE_SUCCESS,
          payload: { page: res.data.page },
        });
      } else {
        dispatch({
          type: pageConstants.CREATE_PAGE_FAILURE,
          error: res.data.error,
        });
      }
    } catch (error) {}
  };
};
