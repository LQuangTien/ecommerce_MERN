import { cartContants } from "../actions/constants";

const initState = {
  cartItems: {},
  updatingCart: false,
  error: null,
};
const cartReducer = (state = initState, action) => {
  switch (action.type) {
    case cartContants.ADD_TO_CART_REQUEST:
      state = {
        ...state,
        updatingCart: true,
      };
      break;
    case cartContants.ADD_TO_CART_SUCCESS:
      state = {
        ...state,
        cartItems: action.payload.cartItems,
        updatingCart: false,
      };
      break;
    case cartContants.ADD_TO_CART_FAILURE:
      state = {
        ...state,
        updatingCart: false,
        error: action.payload.error,
      };
      break;
    case cartContants.RESET_CART:
      state = { ...initState, cartItems: {} };
      break;
    default:
      state = { ...state };
      break;
  }
  return state;
};
export default cartReducer;
