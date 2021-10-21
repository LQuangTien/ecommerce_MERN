import React, { useEffect, useState } from "react";
import {
  IoCartOutline,
  IoLogoFacebook,
  IoLogoGoogle,
  IoLogoInstagram,
  IoSearchSharp,
} from "react-icons/io5";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { getAllCategory, getCart, login, signout, signup } from "../../actions";
import kinzy from "../../images/logo/kinzy.jpg";
import Anchor from "../UI/Anchor";
import Button from "../UI/Button";
import Input from "../UI/Input";
import Modal from "../UI/Modal";
import "./style.css";
const Header = (props) => {
  const [signinModal, setSigninModal] = useState(false);
  const [signupModal, setSignupModal] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const auth = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const categoryState = useSelector((state) => state.categories);
  const { cartItems } = useSelector((state) => state.cart);
  useEffect(() => {
    dispatch(getAllCategory());
  }, [dispatch]);
  useEffect(() => {
    dispatch(getCart());
  }, [auth.authenticate, dispatch]);
  const handleLogin = () => {
    dispatch(login({ email, password }));
    setSigninModal(false);
  };
  const handleSignUp = () => {
    dispatch(signup({ email, password, firstName, lastName }));
    setSignupModal(false);
  };
  const handleLogout = (e) => {
    e.preventDefault();
    dispatch(signout());
  };
  const renderSigninModal = () => (
    <Modal
      visible={signinModal}
      onClose={() => setSigninModal(false)}
      title="Sign in"
    >
      <div className="row">
        <div className="col sm-12 md-12 lg-12">
          <Input
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>
        <div className="col sm-12 md-12 lg-12 mt-16">
          <Input
            placeholder="Password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>
        <div className="col sm-12 md-12 lg-12 mt-16 text-align-right">
          <Anchor title="Forgot password ?" />
        </div>

        <div className="col sm-12 md-12 lg-12 mt-16 ">
          <Button title="SIGN IN" onClick={handleLogin} />
        </div>
        <div className="col sm-12 md-12 lg-12 mt-16">
          <Anchor title="No account? Create one here" />
        </div>
        <div className="col sm-12 md-12 lg-12 mt-16 socials flex-center">
          <p className="socials__label">Connect with Social Networks</p>
          <div className="socials__icons mt-8">
            <a
              href="http://facebook.com"
              target="_blank"
              rel="noreferrer"
              className="socials__icons--facebook"
            >
              <IoLogoFacebook />
            </a>
            <a
              href="http://google.vn"
              target="_blank"
              rel="noreferrer"
              className="socials__icons--google"
            >
              <IoLogoGoogle />
            </a>
            <a
              href="http://instagram.com"
              target="_blank"
              rel="noreferrer"
              className="socials__icons--instagram"
            >
              <IoLogoInstagram />
            </a>
          </div>
        </div>
      </div>
    </Modal>
  );
  const renderSignupModal = () => (
    <Modal
      visible={signupModal}
      onClose={() => setSignupModal(false)}
      title="Sign up"
    >
      <div className="row">
        <div className="col sm-12 md-12 lg-12">
          <Input
            placeholder="First Name"
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
          />
        </div>
        <div className="col sm-12 md-12 lg-12 mt-16">
          <Input
            placeholder="Last Name"
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
          />
        </div>
        <div className="col sm-12 md-12 lg-12 mt-16">
          <Input
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>
        <div className="col sm-12 md-12 lg-12 mt-16">
          <Input
            placeholder="Password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>
        <div className="col sm-12 md-12 lg-12 mt-16 ">
          <Button title="SIGN UP" onClick={handleSignUp} />
        </div>
        <div className="col sm-12 md-12 lg-12 mt-16">
          <Anchor title="Already have an account? Login instead here" />
        </div>
        <div className="col sm-12 md-12 lg-12 mt-16 socials flex-center">
          <p className="socials__label">Connect with Social Networks</p>
          <div className="socials__icons mt-8">
            <a
              href="http://facebook.com"
              target="_blank"
              rel="noreferrer"
              className="socials__icons--facebook"
            >
              <IoLogoFacebook />
            </a>
            <a
              href="http://google.vn"
              target="_blank"
              rel="noreferrer"
              className="socials__icons--google"
            >
              <IoLogoGoogle />
            </a>
            <a
              href="http://instagram.com"
              target="_blank"
              rel="noreferrer"
              className="socials__icons--instagram"
            >
              <IoLogoInstagram />
            </a>
          </div>
        </div>
      </div>
    </Modal>
  );
  const renderSignedInHeader = () => (
    <>
      <span className="auth__span--not-hover">Hello, {auth.user.fullName}</span>
      <Link className="auth__span" to="/account/order">
        Your orders
      </Link>
      <span className="auth__span" onClick={handleLogout}>
        Log out
      </span>
    </>
  );
  const renderUnSignedInHeader = () => (
    <>
      <span className="auth__span" onClick={() => setSigninModal(true)}>
        Sign in
      </span>
      <span className="auth__span" onClick={() => setSignupModal(true)}>
        Register
      </span>
    </>
  );
  const getItemQuantity = () => {
    let sum = 0;
    if (!cartItems) return 0;
    Object.keys(cartItems).forEach((key) => {
      sum += cartItems[key].quantity;
    });
    return sum;
  };
  const renderCategories = (categories) => {
    return categories.map((category) => (
      <li key={category}>
        <Link to={"/products/" + category}>{category}</Link>
      </li>
    ));
  };
  return (
    <>
      <header className="header">
        <div className="header__top">
          <div className="grid wide">
            <div className="auth">
              {auth.authenticate
                ? renderSignedInHeader()
                : renderUnSignedInHeader()}
            </div>
          </div>
        </div>
        <div className="header__middle">
          <div className="grid wide">
            <div className="header__middle-container row">
              <Link to="/" className="logo col lg-3">
                <img src={kinzy} alt="" />
              </Link>
              <div className="search-bar col lg-6">
                <Input
                  className="search-bar__input"
                  placeholder="Search our item here"
                />
                <button className="search-bar__button">
                  <IoSearchSharp className="search-bar__button-icon" />
                </button>
              </div>
              <Link to="/cart" className="cart col lg-3">
                <div className="cart__icon">
                  <IoCartOutline />
                </div>
                <div className="cart__info">
                  <p className="cart__info-label">my cart</p>
                  <span className="cart__info-count">
                    {getItemQuantity() > 1
                      ? getItemQuantity() + " items"
                      : getItemQuantity() + " item"}
                  </span>
                </div>
              </Link>
            </div>
          </div>
        </div>
        <div className="header__bottom">
          <div className="grid wide menuHeader">
            <ul>
              {categoryState.categories.length > 0 &&
                renderCategories(categoryState.categories)}
            </ul>
          </div>
        </div>
      </header>
      {renderSigninModal()}
      {renderSignupModal()}
    </>
  );
};

export default Header;
