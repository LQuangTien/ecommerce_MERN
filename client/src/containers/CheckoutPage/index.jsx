import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { getCart, getAddress } from "../../actions";
import { Button, Anchor } from "../../components/UI/Common";
import CartPage from "../CartPage";
import PriceDetail from "../CartPage/components/PriceDetail";
import Address from "./components/Address";
import AddressForm from "./components/AddressForm";
const Step = (props) => (
  <div className="checkoutStep">
    <div
      onClick={props.onClick}
      className={`checkoutHeader ${props.active && "active"} ${
        props.onClick && "cursor-pointer"
      }`}
    >
      <div>
        <span className="stepNumber">{props.stepNumber}</span>
        <span className="stepTitle">{props.title}</span>
      </div>
    </div>
    {props.body && props.body}
  </div>
);
function CheckoutPage() {
  const user = useSelector((state) => state.user);
  const auth = useSelector((state) => state.auth);
  const cart = useSelector((state) => state.cart);
  const [addAddressStep, setAddAddressStep] = useState(false);
  const [summaryStep, setSummaryStep] = useState(false);
  const [address, setAddress] = useState([]);
  const [wasConfirmedAddress, setWasConfirmedAddress] = useState(false);
  const [selectedAddress, setSelectedAddress] = useState(null);
  const [cartItems, setCartItems] = useState(cart.cartItems);
  const dispatch = useDispatch();
  useEffect(() => {
    setCartItems(cart.cartItems);
  }, [cart.cartItems]);
  useEffect(() => {
    if (auth.authenticate) {
      dispatch(getAddress());
    }
  }, [auth.authenticate]);
  useEffect(() => {
    const mappedAddress = user.address.map((adr) => ({
      ...adr,
      selected: false,
      edit: false,
    }));
    setAddress(mappedAddress);
  }, [user.address]);

  const selectAddress = (id) => {
    const mappedAddress = address.map((adr) =>
      adr._id == id ? { ...adr, selected: true } : { ...adr, selected: false }
    );
    setAddress(mappedAddress);
  };
  const enableEditAddress = (id) => {
    const mappedAddress = address.map((adr) =>
      adr._id == id ? { ...adr, edit: true } : { ...adr, edit: false }
    );
    setAddress(mappedAddress);
  };
  const handleConfirm = (adr) => {
    setWasConfirmedAddress(true);
    setSelectedAddress(adr);
    setSummaryStep(true);
  };
  const handleUpdate = () => {
    const mappedAddress = address.map((adr) => ({
      ...adr,
      selected: false,
      edit: false,
    }));
    setAddress(mappedAddress);
    setWasConfirmedAddress(false);
    setAddAddressStep(false);
    setSummaryStep(false);
  };
  const getTotalPrice = () => {
    if (cartItems) {
      console.log(cartItems);
      const result = Object.keys(cartItems).reduce((totalPrice, index) => {
        return totalPrice + cartItems[index].quantity * cartItems[index].price;
      }, 0);
      return result;
    }
  };
  const getTotalAmount = () => {
    return Object.keys(cartItems).reduce((totalAmount, index) => {
      return totalAmount + cartItems[index].quantity;
    }, 0);
  };
  return (
    <div className="checkoutContainer">
      <div className="step-wrapper" >
        <Step
          stepNumber="1"
          title="LOGIN"
          active={!auth.authenticate}
          body={
            auth.authenticate && (
              <div className="info-wrapper">
                <div className="info-wrapper__container--inline">
                  <span className="info-wrapper__title">Username:</span>
                  {auth.user.fullName}
                </div>
                <div className="info-wrapper__container--inline">
                  <span className="info-wrapper__title">Email:</span>
                  {auth.user.email}
                </div>
              </div>
            )
          }
        />
        <Step
          stepNumber="2"
          title="ADDRESS"
          active={!wasConfirmedAddress && auth.authenticate}
          body={
            wasConfirmedAddress ? (
              <div className="info-wrapper">
                <div className="info-wrapper__container">
                  <span className="info-wrapper__title">Your phone: </span>
                  <span>{selectedAddress.phone}</span>
                </div>
                <div className="info-wrapper__container">
                  <span className="info-wrapper__title">Your address: </span>
                  <span>
                    {selectedAddress.address}, {selectedAddress.ward},{" "}
                    {selectedAddress.district}, {selectedAddress.city}
                  </span>
                </div>
                <div className="info-wrapper__container">
                  <span className="info-wrapper__title">
                    <Anchor
                      name="Select other address ?"
                      style={{ color: "#2874f0", padding: 0 }}
                      onClick={() => handleUpdate()}
                    />
                  </span>
                </div>
              </div>
            ) : (
              address.map((adr) => (
                <Address
                  adr={adr}
                  selectAddress={selectAddress}
                  handleConfirm={handleConfirm}
                  handleUpdate={handleUpdate}
                  enableEditAddress={enableEditAddress}
                />
              ))
            )
          }
        />
        {wasConfirmedAddress ? null : addAddressStep ? (
          <AddressForm
            onClick={() => setAddAddressStep(!addAddressStep)}
            handleUpdate={handleUpdate}
          />
        ) : (
          <Step
            stepNumber="+"
            title="ADD NEW ADDRESS"
            active={addAddressStep}
            onClick={() => setAddAddressStep(!addAddressStep)}
          />
        )}
        <Step
          stepNumber="3"
          title="ORDER SUMMARY"
          active={summaryStep}
          body={summaryStep && <CartPage isCheckout />}
        />
      </div>

      <PriceDetail
        totalPrice={getTotalPrice()}
        totalAmount={getTotalAmount()}
      />
    </div>
  );
}

export default CheckoutPage;
