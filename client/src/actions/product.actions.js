import axios from "../helpers/axios";
import { productConstants } from "./constants";
const initParams = {
  page: 1,
  pageSize: 8,
  from: 0,
  to: 0,
};
export const getByQuery = (params, size = initParams.pageSize) => {
  Object.keys(params).forEach(
    (key) =>
      (params[key] === undefined || params[key].length === 0) &&
      delete params[key]
  );
  const { page, pageSize, from, to, ...dynamicParams } = {
    ...initParams,
    ...params,
    pageSize: size,
  };
  let price = "..";
  if (from && to) {
    price = `${from}..${to}`;
  } else if (from && !to) {
    price = `${from}..`;
  } else if (!from && to) {
    price = `..${to}`;
  }
  console.log({ ...dynamicParams, salePrice: price });
  return async (dispatch) => {
    try {
      dispatch({ type: productConstants.GET_PRODUCT_BY_QUERY_REQUEST });
      const res = await axios.get(`products/search/${page}/${pageSize}`, {
        params: { ...dynamicParams, salePrice: price },
      });
      const result = {
        ...res.data.data,
        products: res.data.data.products.map((product) => ({
          ...product,
          price: product.salePrice,
        })),
      };
      dispatch({
        type: productConstants.GET_PRODUCT_BY_QUERY_SUCCESS,
        payload: result,
      });
    } catch (error) {
      dispatch({
        type: productConstants.GET_PRODUCT_BY_QUERY_FAILURE,
        payload: { error: error.response.data.error },
      });
    }
  };
};
export const getBySlug = (slug) => {
  return async (dispatch) => {
    try {
      dispatch({ type: productConstants.GET_PRODUCT_BY_SLUG_REQUEST });
      const res = await axios.get(`products/${slug}`);
      const products = res.data.data.map((product) => ({
        ...product,
        price: product.salePrice,
        productPictures: product.productPictures,
      }));
      dispatch({
        type: productConstants.GET_PRODUCT_BY_SLUG_SUCCESS,
        payload: { products },
      });
    } catch (error) {
      dispatch({
        type: productConstants.GET_PRODUCT_BY_SLUG_FAILURE,
        payload: { error: error.response.data.error },
      });
    }
  };
};
// export const getProductPage = (params) => {
//   return async (dispatch) => {
//     try {
//       const { categoryId, type } = params;
//       dispatch({ type: productConstants.GET_PAGE_REQUEST });
//       const res = await axios.get(`page/${categoryId}/${type}`);
//       if (res.status === 200) {
//         dispatch({
//           type: productConstants.GET_PAGE_SUCCESS,
//           payload: { page: res.data.page },
//         });
//       } else {
//         dispatch({
//           type: productConstants.GET_PAGE_FAILURE,
//           payload: { error: res.data.error },
//         });
//       }
//     } catch (error) {
//       dispatch({
//         type: productConstants.GET_PAGE_FAILURE,
//         payload: { error },
//       });
//     }
//   };
// };

export const getProductById = (params) => {
  return async (dispatch) => {
    dispatch({ type: productConstants.GET_DETAIL_REQUEST });
    let res;
    try {
      const { id } = params;
      res = await axios.get(`product/${id}`);
      const productDetails = {
        ...res.data.data,
        price: res.data.data.salePrice,
      };
      dispatch({
        type: productConstants.GET_DETAIL_SUCCESS,
        payload: { productDetails },
      });
    } catch (error) {
      dispatch({
        type: productConstants.GET_DETAIL_FAILURE,
        payload: { error: error.response.data.error },
      });
    }
  };
};
