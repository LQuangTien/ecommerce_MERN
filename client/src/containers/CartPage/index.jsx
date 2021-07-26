import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { addToCart, getCart } from "../../actions/cart.actions";
import Card from "../../components/UI/Card";
import CartItem from "./components/CartItem";
import "./style.css";
function CartPage() {
  const cart = useSelector((state) => state.cart);
  const [cartItems, setCartItems] = useState(cart.cartItems);
  const auth = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  useEffect(() => {
    setCartItems(cart.cartItems);
  }, [cart.cartItems]);
  useEffect(() => {
    if (auth.authenticate) {
      dispatch(getCart());
    }
  }, [auth.authenticate]);
  const handleIncreaseQuantity = (id, quantity) => {
    dispatch(addToCart(cartItems[id]));
  };
  const handleDecreaseQuantity = (id, quantity) => {
    dispatch(addToCart(cartItems[id], -1));
  };
  const renderCartItems = () => {
    return Object.keys(cartItems).map((key, index) => (
      <CartItem
        cartItem={cartItems[key]}
        // quantity={cartItems[key].quantity}
        key={index}
        handleIncreaseQuantity={handleIncreaseQuantity}
        handleDecreaseQuantity={handleDecreaseQuantity}
      />
    ));
  }
  return (
    <div className="cartContainer">
      <Card leftHeader={"My cart"} rightHeader={<div>Deliver to</div>}>
        {renderCartItems()}
      </Card>
      <Card style={{ width: "500px" }} leftHeader={<div>Price</div>}>
        Content
      </Card>
    </div>
  );
}

export default CartPage;
