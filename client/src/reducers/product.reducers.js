import { productConstants } from "../actions/constants";

const initState = {
  products: [],
  groupByPrice: {
    under5k: [],
    under10k: [],
    under15k: [],
    under20k: [],
    under30k: [],
  },
  loadingPage: false,
  page: {},
  error: null,
  productDetails: {},
  loading: false,
};

const productReducer = (state = initState, action) => {
  switch (action.type) {
    case productConstants.GET_PRODUCT_BY_SLUG:
      state = {
        ...state,
        products: action.payload.products,
        groupByPrice: {
          ...action.payload.groupByPrice,
        },
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
