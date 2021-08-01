import axios from "../helpers/axios";
import store from "../store";
import { cartConstants } from "./constants";
export const getCart = () => {
  return async (dispatch) => {
    try {
      dispatch({ type: cartConstants.ADD_TO_CART_REQUEST });
      const res = await axios.get("/user/cart");
      if (res.status === 200) {
        const { cartItems } = res.data;
        dispatch({
          type: cartConstants.ADD_TO_CART_SUCCESS,
          payload: { cartItems },
        });
      }
    } catch (error) {
      dispatch({
        type: cartConstants.ADD_TO_CART_FAILURE,
        payload: { error: error.message },
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

    if (auth.authenticate) {
      dispatch({ type: cartConstants.ADD_TO_CART_REQUEST });
      const payload = {
        cartItems: [
          {
            product: product._id,
            quantity,
          },
        ],
      };
      const res = await axios.post("/user/cart/add", payload);
      if (res.status === 201) {
        dispatch(getCart());
      }
    } else {
      cartItems[product._id] = {
        ...product,
        quantity,
      };
      localStorage.setItem("cart", JSON.stringify(cartItems));
      dispatch({
        type: cartConstants.ADD_TO_CART_SUCCESS,
        payload: { cartItems },
      });
    }
  };
};

export const updateCart = () => {
  return async (dispatch) => {
    const { auth } = store.getState();
    const cartItems = localStorage.getItem("cart")
      ? JSON.parse(localStorage.getItem("cart"))
      : null;
    if (auth.authenticate) {
      localStorage.removeItem("cart");
      if (cartItems) {
        if (Object.keys(cartItems).length > 0) {
          const payload = {
            cartItems: Object.keys(cartItems).map((key) => {
              return {
                quantity: cartItems[key].quantity,
                product: cartItems[key]._id,
              };
            }),
          };
          const res = await axios.post("/user/cart/add", payload);
          if (res.status === 201) {
            dispatch(getCart());
          }
        }
      }
    } else {
      if (cartItems) {
        dispatch({
          type: cartConstants.ADD_TO_CART_SUCCESS,
          payload: { cartItems },
        });
      }
    }
  };
};
export const removeCartItem = (productId) => {
  return async (dispatch) => {
    try {
      // dispatch({ type: cartConstants.REMOVE_CART_ITEM_REQUEST });
      const res = await axios.post(`/user/cart/remove`, { productId });
      if (res.status === 202) {
        // dispatch({ type: cartConstants.REMOVE_CART_ITEM_SUCCESS });
        dispatch(getCart());
      } else {
        const { error } = res.data;
        // dispatch({
        //   type: cartConstants.REMOVE_CART_ITEM_FAILURE,
        //   payload: { error },
        // });
      }
    } catch (error) {
      console.log(error);
    }
  };
};
