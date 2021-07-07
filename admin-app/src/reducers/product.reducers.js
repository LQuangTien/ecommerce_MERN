import { productConstants } from "../actions/constants";

const initState = { products: [] };
const productReducer = (state = initState, action) => {
  switch (action.type) {
    case productConstants.GET_ALL_PRODUCT_SUCCESS:
      state = { ...state, products: action.payload.products };
      break;
    default:
      state = { ...state };
  }
  return state;
};
export default productReducer;
