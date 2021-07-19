import { pageConstants } from "./constants";
import axios from "../helpers/axios";
export const create = (form) => {
  return async (dispatch) => {
    dispatch({ type: pageConstants.CREATE_PAGE_REQUEST });
    try {
      const res = await axios.post("/page/create", form);
      if (res.status === 201) {
        dispatch({
          type: pageConstants.CREATE_PAGE_SUCCESS,
          payload: { pages: res.data.page },
        });
      } else {
        dispatch({
          type: pageConstants.CREATE_PAGE_FAILURE,
          payload: { error: res.data.error },
        });
      }
    } catch (error) {
      dispatch({
        type: pageConstants.CREATE_PAGE_FAILURE,
        payload: { error },
      });
    }
  };
};
