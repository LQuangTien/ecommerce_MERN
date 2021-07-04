import { authConstants, userConstants } from "../actions/constants";

const initState = {
  error: null,
  message: "",
  loading: false,
};
const userReducer = (state = initState, action) => {
  switch (action.type) {
    case userConstants.REGISTER_REQUEST:
      state = {
        ...state,
        loading: true,
      };
      break;
    case userConstants.REGISTER_SUCCESS:
      state = {
        ...state,
        loading: false,
        message: action.payload.message,
      };
      break;
    case userConstants.REGISTER_FAILURE:
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
