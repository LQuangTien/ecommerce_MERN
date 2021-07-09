import { combineReducers } from "redux";
import categoryReducer from "./category.reducers";
import productReducer from "./product.reducers";
const rootReducer = combineReducers({
  categories: categoryReducer,
  products: productReducer,
});

export default rootReducer;
