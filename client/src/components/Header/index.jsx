import React, { useEffect, useState } from "react";
import {
  IoCartOutline,
  IoLogoFacebook,
  IoLogoGoogle,
  IoLogoInstagram,
  IoSearchSharp,
} from "react-icons/io5";
import { useDispatch, useSelector } from "react-redux";
import { Link, useHistory } from "react-router-dom";
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
  const [confirmPassword, setConfirmPassword] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [search, setSearch] = useState("");
  const auth = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const history = useHistory();
  const categoryState = useSelector((state) => state.categories);
  const { cartItems } = useSelector((state) => state.cart);
  useEffect(() => {
    dispatch(getAllCategory());
  }, [dispatch]);
  useEffect(() => {
    dispatch(getCart());
    if (auth.authenticate) {
      setSigninModal(false);
      setSignupModal(false);
    }
  }, [auth.authenticate, dispatch]);
  const handleLogin = () => {
    dispatch(login({ email, password }));
  };
  const handleSignUp = () => {
    dispatch(signup({ email, password, firstName, lastName, confirmPassword }));
  };
  const handleLogout = (e) => {
    e.preventDefault();
    dispatch(signout());
  };
  const handleSearch = () => {
    history.push(`/search?q=${search}&page=1`);
  };
  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      history.push(`/search?q=${search}&page=1`);
    }
  };
  const renderSigninModal = () => {
    return (
      <Modal
        visible={signinModal}
        onClose={() => {
          setEmail("");
          setPassword("");
          setFirstName("");
          setLastName("");
          setConfirmPassword("");
          setSigninModal(false);
        }}
        title="Sign in"
      >
        <div className="row">
          <div className="col sm-12 md-12 lg-12">
            {auth.error && (
              <p
                style={{
                  fontSize: "1.2rem",
                  color: "red",
                  paddingLeft: "0.2rem",
                }}
              >
                {auth.error}
              </p>
            )}
          </div>

          <div className="col sm-12 md-12 lg-12 mt-8">
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
            <Anchor
              title="No account? Create one here"
              onClick={() => {
                setEmail("");
                setPassword("");
                setFirstName("");
                setLastName("");
                setConfirmPassword("");
                setSigninModal(false);
                setSignupModal(true);
              }}
            />
          </div>
          <div className="col sm-12 md-12 lg-12 mt-16 socials flex-center">
            <p className="socials__label">Hope you have fun with us</p>
            <div className="mt-12">
              <div className="logo">
                <img src={kinzy} alt="" />
              </div>
            </div>
          </div>
        </div>
      </Modal>
    );
  };
  const renderSignupModal = () => {
    return (
      <Modal
        visible={signupModal}
        onClose={() => {
          setEmail("");
          setPassword("");
          setFirstName("");
          setLastName("");
          setConfirmPassword("");
          setSignupModal(false);
        }}
        title="Sign up"
      >
        <div className="row">
          <div className="col sm-12 md-12 lg-12">
            {auth.signupError && (
              <p
                style={{
                  fontSize: "1.2rem",
                  color: "red",
                  paddingLeft: "0.2rem",
                }}
              >
                {auth.signupError}
              </p>
            )}
          </div>
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
          <div className="col sm-12 md-12 lg-12 mt-16">
            <Input
              placeholder="Confirm password"
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
            />
          </div>
          <div className="col sm-12 md-12 lg-12 mt-16 ">
            <Button title="SIGN UP" onClick={handleSignUp} />
          </div>
          <div className="col sm-12 md-12 lg-12 mt-16">
            <Anchor
              title="Already have an account? Login instead here"
              onClick={() => {
                setEmail("");
                setPassword("");
                setFirstName("");
                setLastName("");
                setConfirmPassword("");
                setSigninModal(true);
                setSignupModal(false);
              }}
            />
          </div>
          <div className="col sm-12 md-12 lg-12 mt-16 socials flex-center">
            <p className="socials__label">Hope you have fun with us</p>
            <div className="mt-12">
              <div className="logo">
                <img src={kinzy} alt="" />
              </div>
            </div>
          </div>
        </div>
      </Modal>
    );
  };
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
  const renderCategories = () => {
    return categoryState.categories.map((category) => (
      <li key={category._id} className="main-menu-item">
        <Link className="main-menu-link" to={"/products/" + category.name}>
          <span>{category.name}</span>
        </Link>
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
                  value={search}
                  onKeyDown={handleKeyDown}
                  onChange={(e) => setSearch(e.target.value)}
                  className="search-bar__input"
                  placeholder="Search our item here"
                />
                <button onClick={handleSearch} className="search-bar__button">
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
            <div className="row menuHeader">
              <div className="col lg-o-3 lg-9">
                <ul>
                  {categoryState.categories.length > 0 && renderCategories()}
                </ul>
              </div>
            </div>
          </div>
        </div>
      </header>
      {renderSigninModal()}
      {renderSignupModal()}
    </>
  );
};

export default Header;
