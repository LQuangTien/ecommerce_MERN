import { combineReducers } from "redux";
import authReducer from "./auth.reducers";
import categoryReducer from "./category.reducers";
import userReducer from "./user.reducers";
const rootReducer = combineReducers({
  auth: authReducer,
  user: userReducer,
  categories: categoryReducer,
});

export default rootReducer;
