import store from "../store";
import axios from "../helpers/axios";
import { cartConstants } from "./constants";

export const getCart = () => {
  return async (dispatch) => {
    try {
      const { auth } = store.getState();
      const cart = localStorage.getItem("cart")
        ? JSON.parse(localStorage.getItem("cart"))
        : null;
      if (!cart) return;
      if (!auth.authenticate) {
        dispatch({
          type: cartConstants.GET_CART_SUCCESS,
          payload: { cartItems: cart },
        });
        return;
      }
      dispatch({ type: cartConstants.GET_CART_REQUEST });
      const res = await axios.get("/user/cart");
      const { cartItems } = res.data;
      dispatch({
        type: cartConstants.GET_CART_SUCCESS,
        payload: { cartItems },
      });
    } catch (error) {
      dispatch({
        type: cartConstants.GET_CART_FAILURE,
        payload: { error: error.response.data.error },
      });
    }
  };
};

export const addToCart = (product, amount = 1) => {
  return async (dispatch) => {
    const {
      cart: { cartItems },
      auth,
    } = store.getState();
    const quantity = cartItems[product._id]
      ? parseInt(cartItems[product._id].quantity) + amount
      : 1;
    if (!auth.authenticate) {
      cartItems[product._id] = {
        ...product,
        quantity,
      };
      localStorage.setItem("cart", JSON.stringify(cartItems));
      dispatch({
        type: cartConstants.ADD_TO_CART_SUCCESS,
        payload: { cartItems },
      });
      return;
    }
    dispatch({ type: cartConstants.ADD_TO_CART_REQUEST });
    const items = [
      {
        product: product._id,
        quantity,
      },
    ];
    try {
      const res = await axios.post("/user/cart/add", { cartItems: items });
      const { cartItems } = res.data;
      dispatch({
        type: cartConstants.ADD_TO_CART_SUCCESS,
        payload: { cartItems },
      });
    } catch (error) {
      dispatch({
        type: cartConstants.ADD_TO_CART_FAILURE,
        payload: { error: error.response.data.error },
      });
    }
  };
};

export const updateCart = () => {
  return async (dispatch) => {
    const { auth } = store.getState();
    const cart = localStorage.getItem("cart")
      ? JSON.parse(localStorage.getItem("cart"))
      : null;
    if (!cart) return;
    if (!auth.authenticate) {
      dispatch({
        type: cartConstants.ADD_TO_CART_SUCCESS,
        payload: { cartItems: cart },
      });
      return;
    }
    localStorage.removeItem("cart");
    if (Object.keys(cart).length <= 0) return;
    const items = Object.keys(cart).map((key) => {
      return {
        quantity: items[key].quantity,
        product: items[key]._id,
      };
    });
    try {
      const res = await axios.post("/user/cart/add", { cartItems: items });
      const { cartItems } = res.data;
      dispatch({
        type: cartConstants.ADD_TO_CART_SUCCESS,
        payload: { cartItems },
      });
    } catch (error) {
      dispatch({
        type: cartConstants.ADD_TO_CART_FAILURE,
        payload: { error: error.response.data.error },
      });
    }
  };
};

export const removeCartItem = (productId) => {
  return async (dispatch) => {
    const { auth } = store.getState();
    const cart = localStorage.getItem("cart")
      ? JSON.parse(localStorage.getItem("cart"))
      : null;
    if (!cart) return;
    if (!auth.authenticate) {
      delete cart[productId];
      localStorage.setItem("cart", JSON.stringify(cart));
      dispatch({
        type: cartConstants.DELETE_CART_ITEM_SUCCESS,
        payload: { cartItems: cart },
      });
      return;
    }
    try {
      dispatch({ type: cartConstants.DELETE_CART_ITEM_REQUEST });
      const res = await axios.post(`/user/cart/remove`, { productId });
      const { cartItems } = res.data;
      dispatch({
        type: cartConstants.DELETE_CART_ITEM_SUCCESS,
        payload: { cartItems },
      });
    } catch (error) {
      dispatch({
        type: cartConstants.DELETE_CART_ITEM_FAILURE,
        payload: { error: error.response.data.error },
      });
    }
  };
};
