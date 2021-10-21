import axios from "../helpers/axios";
import { categoryConstants } from "./constants";

export const getAllCategory = () => {
  return async (dispatch) => {
    dispatch({ type: categoryConstants.GET_ALL_CATEGORY_REQUEST });

    const res = await axios.get("category/");
    if (res.status === 200) {
      const result = res.data.data[0].filterField.find(
        (field) => field.name === "brand"
      );
      dispatch({
        type: categoryConstants.GET_ALL_CATEGORY_SUCCESS,
        payload: { categories: result.value },
      });
    } else {
      dispatch({
        type: categoryConstants.GET_ALL_CATEGORY_FAILURE,
        payload: res.data.error,
      });
    }
  };
};
