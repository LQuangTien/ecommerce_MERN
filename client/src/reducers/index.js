import { combineReducers } from "redux";
import authReducer from "./auth.reducers";
import categoryReducer from "./category.reducers";
import productReducer from "./product.reducers";
import cartReducer from "./cart.reducers";
const rootReducer = combineReducers({
  categories: categoryReducer,
  products: productReducer,
  auth: authReducer,
  cart: cartReducer,
});

export default rootReducer;
