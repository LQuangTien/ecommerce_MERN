import { authConstants } from "../actions/constants";

const initState = {
  token: null,
  user: { firstName: "", lastName: "", email: "", picture: "", fullName: "" },
  authenticate: false,
  authenticating: false,
  loading: false,
  error: null,
  message: "",
  signuping: false,
  signupError: "",
};
const authReducer = (state = initState, action) => {
  switch (action.type) {
    case authConstants.LOGIN_REQUEST:
      state = {
        ...state,
        authenticating: true,
      };
      break;
    case authConstants.LOGIN_SUCCESS:
      state = {
        ...state,
        user: action.payload.user,
        token: action.payload.token,
        authenticate: true,
        authenticating: false,
      };
      break;
    case authConstants.LOGIN_FAILURE:
      state = {
        ...state,
        error: action.payload.error,
        loading: false,
        authenticating: false,
      };
      break;
    case authConstants.SIGNUP_REQUEST:
      state = {
        ...state,
        signuping: true,
      };
      break;
    case authConstants.SIGNUP_SUCCESS:
      state = {
        ...state,
        user: action.payload.user,
        token: action.payload.token,
        authenticate: true,
        signuping: false,
      };
      break;
    case authConstants.SIGNUP_FAILURE:
      state = {
        ...state,
        signupError: action.payload.error,
        signuping: false,
      };
      break;
    case authConstants.LOGOUT_REQUEST:
      state = {
        ...state,
        loading: true,
      };
      break;
    case authConstants.LOGOUT_SUCCESS:
      state = {
        ...initState,
      };
      break;
    case authConstants.LOGOUT_FAILURE:
      state = {
        ...state,
        error: action.payload.error,
        loading: false,
      };
      break;
    default:
      break;
  }
  return state;
};
export default authReducer;
