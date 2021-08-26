import { productConstants } from "../actions/constants";

const initState = {
  products: [],
  loadingPage: false,
  page: {},
  error: null,
  productDetails: {},
  loading: false,
};

const productReducer = (state = initState, action) => {
  switch (action.type) {
    case productConstants.GET_PRODUCT_BY_SLUG_REQUEST:
      state = {
        ...state,
        loading: true
      };
      break;
    case productConstants.GET_PRODUCT_BY_SLUG_SUCCESS:
      state = {
        ...state,
        products: action.payload.products,
        loading: false
      };
      break;
    case productConstants.GET_PRODUCT_BY_SLUG_FAILURE:
      state = {
        ...state,
        products: [],
        error: action.payload.error,
        loading: false
      };
      break;
    case productConstants.GET_PAGE_REQUEST:
      state = {
        ...state,
        loadingPage: true,
      };
      break;
    case productConstants.GET_PAGE_SUCCESS:
      state = {
        ...state,
        loadingPage: false,
        page: action.payload.page,
      };
      break;
    case productConstants.GET_PAGE_FAILURE:
      state = {
        ...state,
        loadingPage: false,
        error: action.payload.error,
      };
      break;
    case productConstants.GET_DETAIL_REQUEST:
      state = {
        ...state,
        loading: true,
      };
      break;
    case productConstants.GET_DETAIL_SUCCESS:
      state = {
        ...state,
        loading: false,
        productDetails: action.payload.productDetails,
      };
      break;
    case productConstants.GET_DETAIL_FAILURE:
      state = {
        ...state,
        loading: false,
        error: action.payload.error,
      };
      break;
    default:
      state = { ...state };
      break;
  }
  return state;
};
export default productReducer;
