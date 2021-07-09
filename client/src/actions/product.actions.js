import axios from "../helpers/axios";
import { productConstants } from "./constants";
export const getBySlug = (slug) => {
  return async (dispatch) => {
    const res = await axios.get(`product/${slug}`);
    console.log(res);
    if (res.status === 200) {
      dispatch({
        type: productConstants.GET_PRODUCT_BY_SLUG,
        payload: res.data,
      });
    } else {
      return;
    }
  };
};
