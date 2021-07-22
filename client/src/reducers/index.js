import { combineReducers } from "redux";
import authReducer from "./auth.reducers";
import categoryReducer from "./category.reducers";
import productReducer from "./product.reducers";
const rootReducer = combineReducers({
  categories: categoryReducer,
  products: productReducer,
  auth: authReducer
});

export default rootReducer;
