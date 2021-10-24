import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Route, Switch } from "react-router-dom";
import { isUserLoggedIn, getInitialData } from "./actions";
import "./App.css";
import PrivateRoute from "./components/HOC/PrivateRoute";
import Layout from "./components/Layout";
import Category from "./containers/Category";
import Home from "./containers/Home";
import Orders from "./containers/Orders";
import Products from "./containers/Products";
import Signin from "./containers/Signin";
import Signup from "./containers/Signup";
import Pages from "./containers/Pages";
import ProductDetail from "./containers/ProductDetail";
import AddCategory from "./containers/AddCategory";

function App() {
  const auth = useSelector((state) => state.auth);

  const dispatch = useDispatch();
  useEffect(() => {
    if (!auth.authenticate) {
      dispatch(isUserLoggedIn());
    } else {
      dispatch(getInitialData());
    }
  }, [auth.authenticate]);
  return (
    <div className="App">
      <Layout>
        <Switch>
          <PrivateRoute exact path="/" component={Home} />
          <PrivateRoute exact path="/products" component={Products} />
          <PrivateRoute exact path="/categories" component={Category} />
          <PrivateRoute exact path="/category/add" component={AddCategory} />
          <PrivateRoute exact path="/product/:id" component={ProductDetail} />
          {/* <PrivateRoute exact path="/orders" component={Orders} /> */}
          <Route path="/signup" component={Signup} />
          <Route path="/signin" component={Signin} />
        </Switch>
      </Layout>
    </div>
  );
}

export default App;
