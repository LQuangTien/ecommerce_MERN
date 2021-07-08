import { combineReducers } from "redux";
import categoryReducer from "./category.reducers";
const rootReducer = combineReducers({
  categories: categoryReducer,
});

export default rootReducer;
