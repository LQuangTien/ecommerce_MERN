import { orderConstants } from "../actions/constants";

const initState = {
  orders: [],
  updating: false,
};

const orderReducer = (state = initState, action) => {
  switch (action.type) {
    case orderConstants.GET_ORDER_SUCCESS:
      state = {
        ...state,
        orders: action.payload.orders,
      };
      break;
    case orderConstants.UPDATE_ORDER_REQUEST:
      state = {
        ...state,
        updating: true,
      };
      break;
    case orderConstants.UPDATE_ORDER_SUCCESS:
      state = {
        ...state,
        orders: state.orders.map((order) =>
          order._id == action.payload.order._id ? action.payload.order : order
        ),
        updating: false,
      };
      break;
    case orderConstants.UPDATE_ORDER_FAILURE:
      state = {
        ...state,
        orders: [],
        updating: false,
      };
      break;
    default:
      break;
  }
  return state;
};
export default orderReducer;
