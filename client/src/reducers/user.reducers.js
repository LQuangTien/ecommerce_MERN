import { userConstants } from "../actions/constants";

const initState = {
  address: [],
  loading: false,
  error: null,
};

const userReducer = (state = initState, action) => {
  console.log({actionowuser: action})
  switch (action.type) {
    case userConstants.GET_ADDRESS_REQUEST:
      state = {
        ...state,
        loading: true,
      };
      break;
    case userConstants.GET_ADDRESS_SUCCESS:
      state = {
        ...state,
        loading: false,
        address: action.payload.address,
      };
      break;
    case userConstants.GET_ADDRESS_FAILURE:
      state = {
        ...state,
        loading: false,
        address: [],
        error: action.payload.error,
      };
      break;
    case userConstants.ADD_ADDRESS_REQUEST:
      state = {
        ...state,
        loading: true,
      };
      break;
    case userConstants.ADD_ADDRESS_SUCCESS:
      state = {
        ...state,
        address: action.payload.address,
        loading: false,
      };
      break;
    case userConstants.ADD_ADDRESS_FAILURE:
      state = {
        ...state,
        loading: false,
        error: action.payload.error,
      };
      break;
    case userConstants.UPDATE_ADDRESS_REQUEST:
      state = {
        ...state,
        loading: true,
      };
      break;
    case userConstants.UPDATE_ADDRESS_SUCCESS:
      state = {
        ...state,
        address: action.payload.address,
        loading: false,
      };
      break;
    case userConstants.UPDATE_ADDRESS_FAILURE:
      state = {
        ...state,
        loading: false,
        error: action.payload.error,
      };
      break;
    default:
      break;
  }
  return state;
};
export default userReducer;
