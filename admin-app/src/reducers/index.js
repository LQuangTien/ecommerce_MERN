import { combineReducers } from "redux";
import authReducer from "./auth.reducers";
import categoryReducer from "./category.reducers";
import productReducer from "./product.reducers";
import userReducer from "./user.reducers";
import pageReducer from "./page.reducers";
const rootReducer = combineReducers({
  auth: authReducer,
  user: userReducer,
  categories: categoryReducer,
  products: productReducer,
  pages: pageReducer
});

export default rootReducer;
