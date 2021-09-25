import logo from "./logo.svg";
import "./App.css";
import HomePage from "./containers/HomePage";
import { BrowserRouter, Route, Switch } from "react-router-dom";
import ProductPage from "./containers/ProductsPage";
import Layout from "./components/Layout";
import { useDispatch, useSelector } from "react-redux";
import { isUserLoggedIn } from "./actions";
import { useEffect } from "react";
import ProductDetailsPage from "./containers/ProductDetailsPage";
import CartPage from "./containers/CartPage";
import { updateCart } from "./actions/cart.actions";
import CheckoutPage from "./containers/CheckoutPage";
import OrderPage from "./containers/OrderPage";
import OrderDetailPage from "./containers/OrderDetailPage";
import PrivateRoute from "./helpers/privateRoute";

function App() {
  const auth = useSelector((state) => state.auth);
  const user = JSON.parse(localStorage.getItem("user"));
  const dispatch = useDispatch();
  useEffect(() => {
    if (!auth.authenticate) {
      dispatch(isUserLoggedIn());
    }
  }, [auth.authenticate]);
  useEffect(() => {
    dispatch(updateCart());
  }, [auth.authenticate]);
  return (
    <div className="App">
      <BrowserRouter>
        <Layout>
          <Switch>
            <Route exact path="/" component={HomePage} />
            <Route path="/cart" component={CartPage} />
            <PrivateRoute path="/checkout" isAuthenticated={user}>
              <CheckoutPage />
            </PrivateRoute>
            <PrivateRoute exact path="/account/order/:_id" isAuthenticated={user}>
              <OrderDetailPage />
            </PrivateRoute>
            <PrivateRoute path="/account/order" isAuthenticated={user}>
              <OrderPage />
            </PrivateRoute>
            <Route path="/:slug/:productId" component={ProductDetailsPage} />
            <Route path="/:slug" component={ProductPage} />
          </Switch>
        </Layout>
      </BrowserRouter>
    </div>
  );
}

export default App;
