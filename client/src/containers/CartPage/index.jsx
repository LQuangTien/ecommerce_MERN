import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { addToCart, getCart } from "../../actions/cart.actions";
import Card from "../../components/UI/Card";
import { Button } from "../../components/UI/Common";
import CartItem from "./components/CartItem";
import PriceDetail from "./components/PriceDetail";
import "./style.css";
function CartPage(props) {
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
  };
  const getTotalPrice = () => {
    return Object.keys(cartItems).reduce((totalPrice, index) => {
      return totalPrice + cartItems[index].quantity * cartItems[index].price
    }, 0)
  }
  const getTotalAmount = () => {
    return Object.keys(cartItems).reduce((totalAmount, index) => {
      return totalAmount + cartItems[index].quantity;
    }, 0);
  };
  if(props.isCheckout){
    return renderCartItems();
  }
  return (
    <div className="cartContainer">
      <Card
        leftHeader={"My cart"}
        rightHeader={<div>Deliver to</div>}
        style={{ width: "calc(100% - 400px)", overflow: "hidden" }}
      >
        {renderCartItems()}
        <div className="placeOrderBtnContainer">
          <Button
            title="Place Order"
            style={{ width: "250px" }}
            onClick={() => props.history.push("/checkout")}
          />
        </div>
      </Card>
      <PriceDetail totalPrice={getTotalPrice()} totalAmount={getTotalAmount()} />
    </div>
  );
}

export default CartPage;
