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
    default:
      state = { ...state };
      break;
  }
  return state;
};
export default productReducer;
