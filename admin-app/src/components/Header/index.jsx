import React from "react";
import { Nav, Navbar, Container } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import { NavLink, Link, useHistory } from "react-router-dom";
import { signout } from "../../actions/auth.actions";
function Header() {
  const history = useHistory();
  const auth = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const handleSignout = () => {
    dispatch(signout());
    history.push("/signin");
  };
  const wasLoggedIn = () => {
    return (
      <Nav>
        {auth && auth.user.role === "admin" && (
          <li className="nav-item">
            <NavLink to="/signup" className="nav-link">
              Sign up
            </NavLink>
          </li>
        )}
        <li className="nav-item">
          <span role="button" className="nav-link" onClick={handleSignout}>
            Sign out
          </span>
        </li>
      </Nav>
    );
  };
  const notLogIn = () => {
    return (
      <Nav>
        <li className="nav-item">
          <NavLink to="/signin" className="nav-link">
            Sign in
          </NavLink>
        </li>
      </Nav>
    );
  };
  return (
    <Navbar
      collapseOnSelect
      fixed="top"
      expand="lg"
      bg="dark"
      variant="dark"
      style={{ zIndex: 999 }}
    >
      <Container fluid>
        <Link to="/" className="navbar-brand">
          Admin Dashboard
        </Link>
        <Navbar.Toggle aria-controls="responsive-navbar-nav" />
        <Navbar.Collapse id="responsive-navbar-nav">
          {auth.authenticate ? wasLoggedIn() : notLogIn()}
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}

export default Header;
