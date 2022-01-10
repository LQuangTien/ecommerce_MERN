import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Redirect, Route, Switch } from "react-router-dom";
import { getInitialData, isUserLoggedIn } from "./actions";
import "./App.css";
import PrivateRoute from "./components/HOC/PrivateRoute";
import Layout from "./components/Layout";
import AddCategory from "./containers/AddCategory";
import AddProduct from "./containers/AddProduct";
import Category from "./containers/Category";
import EditCategory from "./containers/EditCategory";
import EditProduct from "./containers/EditProduct";
import Home from "./containers/Home";
import OrderDetail from "./containers/OrderDetail";
import Orders from "./containers/Orders";
import Products from "./containers/Products";
import Signin from "./containers/Signin";
import Signup from "./containers/Signup";

function App() {
  const auth = useSelector((state) => state.auth);

  const dispatch = useDispatch();
  useEffect(() => {
    if (!auth.authenticate) {
      dispatch(isUserLoggedIn());
    } else {
      dispatch(getInitialData());
    }
  }, [auth.authenticate, dispatch]);
  return (
    <div className="App">
      <Layout>
        <Switch>
          {auth && auth.user.role === "admin" && (
            <PrivateRoute exact path="/" component={Home} />
          )}
          <PrivateRoute exact path="/products" component={Products} />
          <PrivateRoute exact path="/orders" component={Orders} />
          <PrivateRoute exact path="/orders/:id" component={OrderDetail} />
          {auth && auth.user.role === "admin" && (
            <PrivateRoute exact path="/product/add" component={AddProduct} />
          )}
          <PrivateRoute exact path="/categories" component={Category} />
          {auth && auth.user.role === "admin" && (
            <PrivateRoute exact path="/category/add" component={AddCategory} />
          )}

          <PrivateRoute
            exact
            path="/category/edit/:id"
            component={EditCategory}
          />

          <PrivateRoute exact path="/product/:id" component={EditProduct} />

          {auth && auth.user.role === "admin" && (
            <PrivateRoute path="/signup" component={Signup} />
          )}
          {auth && auth.user.role === "staff" && <Redirect to="/products" />}
          <Route path="/signin" component={Signin} />
        </Switch>
      </Layout>
    </div>
  );
}

export default App;
