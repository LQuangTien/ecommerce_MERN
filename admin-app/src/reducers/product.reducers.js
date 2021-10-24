import { productConstants } from "../actions/constants";

const initState = { products: [], product: {}, isGetProductLoading: false };
const productReducer = (state = initState, action) => {
  switch (action.type) {
    case productConstants.GET_ALL_PRODUCT_SUCCESS:
      state = { ...state, products: action.payload.products };
      break;
    case productConstants.GET_PRODUCT_DETAIL_REQUEST:
      state = {
        ...state,
        isGetProductLoading: true,
      };
      break;
    case productConstants.GET_PRODUCT_DETAIL_SUCCESS:
      state = {
        ...state,
        product: action.payload,
        isGetProductLoading: false,
      };
      break;
    case productConstants.GET_PRODUCT_DETAIL_FAILURE:
      state = {
        ...state,
        product: {},
        isGetProductLoading: false,
      };
      break;
    default:
      state = { ...state };
  }
  return state;
};
export default productReducer;
