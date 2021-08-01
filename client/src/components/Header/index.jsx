import React, { useState } from "react";
import "./style.css";
import flipkartLogo from "../../images/logo/flipkart.png";
import goldenStar from "../../images/logo/golden-star.png";
import { IoIosArrowDown, IoIosCart, IoIosSearch } from "react-icons/io";
import { Modal, Input, Button, DropdownMenu } from "../UI/Common";
import { useDispatch, useSelector } from "react-redux";
import { login, signout, signup } from "../../actions";
import { Link } from "react-router-dom";
const Header = (props) => {
  const [loginModal, setLoginModal] = useState(false);
  const [signupModal, setSignupModal] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const auth = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const handleLogin = () => {
    dispatch(login({ email, password }));
    setLoginModal(false);
  };
  const handleSignUp = () => {
    dispatch(signup({ email, password, firstName, lastName }));
    setSignupModal(false);
  };
  const handleLogout = (e) => {
    e.preventDefault();
    dispatch(signout());
  };
  const loggedIn = () => {
    return (
      <DropdownMenu
        menu={<a className="fullname">{auth.user.fullName}</a>}
        menus={[
          // { label: "My Profile", href: "", icon: null },
          // { label: "Flipkart Plus Zone", href: "", icon: null },
          { label: "Orders", href: "/account/order", icon: null },
          // { label: "Wishlist", href: "", icon: null },
          // { label: "Rewards", href: "", icon: null },
          // { label: "Gift Cards", href: "", icon: null },
          { label: "Sign out", href: "", icon: null, onClick: handleLogout },
        ]}
        firstMenu={
          <div className="firstmenu">
            <span>New Customer?</span>
            <a style={{ color: "#2874f0" }}>Sign Up</a>
          </div>
        }
      />
    );
  };
  const notLoggedIn = () => {
    return (
      <DropdownMenu
        menu={
          <a className="loginButton" onClick={() => setLoginModal(true)}>
            Login
          </a>
        }
        menus={[
          { label: "My Profile", href: "", icon: null },
          { label: "Flipkart Plus Zone", href: "", icon: null },
          { label: "Orders", href: "", icon: null },
          { label: "Wishlist", href: "", icon: null },
          { label: "Rewards", href: "", icon: null },
          { label: "Gift Cards", href: "", icon: null },
        ]}
        firstMenu={
          <div className="firstmenu" onClick={() => setSignupModal(true)}>
            <span>New Customer?</span>
            <a style={{ color: "#2874f0" }}>Sign Up</a>
          </div>
        }
      />
    );
  };
  return (
    <div className="header">
      <div className="subHeader">
        <div className="logo">
          <a href="">
            <img src={flipkartLogo} className="logoimage" alt="" />
          </a>
          <a style={{ marginTop: "-10px" }}>
            <span className="exploreText">Explore</span>
            <span className="plusText">Plus</span>
            <img src={goldenStar} className="goldenStar" alt="" />
          </a>
        </div>
        <div
          style={{
            padding: "0 10px",
          }}
        >
          <div className="searchInputContainer">
            <input
              className="searchInput"
              placeholder={"search for products, brands and more"}
            />
            <div className="searchIconContainer">
              <IoIosSearch
                style={{
                  color: "#2874f0",
                }}
              />
            </div>
          </div>
        </div>
        <div className="rightMenu">
          {auth.authenticate ? loggedIn() : notLoggedIn()}
          <DropdownMenu
            menu={
              <a className="more">
                <span>More</span>
                <IoIosArrowDown />
              </a>
            }
            menus={[
              { label: "Notification Preference", href: "", icon: null },
              { label: "Sell on flipkart", href: "", icon: null },
              { label: "24x7 Customer Care", href: "", icon: null },
              { label: "Advertise", href: "", icon: null },
              { label: "Download App", href: "", icon: null },
            ]}
          />
          <div>
            <Link to="/cart" className="cart">
              <IoIosCart />
              <span style={{ margin: "0 10px" }}>Cart</span>
            </Link>
          </div>
        </div>
      </div>

      <Modal visible={signupModal} onClose={() => setSignupModal(false)}>
        <div className="authContainer">
          <div className="row">
            <div className="leftspace">
              <h2>Sign up</h2>
              <p style={{ minWidth: "200px" }}>
                Welcome to our shopping website and get the best sale at here
              </p>
            </div>
            <div className="rightspace">
              <div className="loginInputContainer">
                <Input
                  type="text"
                  label="Enter First Name"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                />
                <Input
                  type="text"
                  label="Enter Last Name"
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                />
                <Input
                  type="text"
                  label="Enter Email/Enter Mobile Number"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />

                <Input
                  type="password"
                  label="Enter Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
                <Button
                  title="Sign Up"
                  bgColor="#fb641b"
                  textColor="#ffffff"
                  style={{ margin: "20px 0" }}
                  onClick={handleSignUp}
                />
              </div>
            </div>
          </div>
        </div>
      </Modal>
      <Modal visible={loginModal} onClose={() => setLoginModal(false)}>
        <div className="authContainer">
          <div className="row">
            <div className="leftspace">
              <h2>Login</h2>
              <p style={{ minWidth: "200px" }}>
                Get access to your Orders, Wishlist and Recommendations
              </p>
            </div>
            <div className="rightspace">
              <div className="loginInputContainer">
                <Input
                  type="text"
                  label="Enter Email/Enter Mobile Number"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />

                <Input
                  type="password"
                  label="Enter Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
                <Button
                  title="Login"
                  bgColor="#fb641b"
                  textColor="#ffffff"
                  style={{ margin: "20px 0" }}
                  onClick={handleLogin}
                />
              </div>
            </div>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default Header;
