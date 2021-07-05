import React from "react";
import { Nav, Navbar, Container } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import { NavLink, Link } from "react-router-dom";
import { signout } from "../../actions/auth.actions";
function Header() {
  const auth = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const handleSignout = () => {
    dispatch(signout());
  };
  const wasLoggedIn = () => {
    return (
      <Nav>
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
        <li className="nav-item">
          <NavLink to="/signup" className="nav-link">
            Sign up
          </NavLink>
        </li>
      </Nav>
    );
  };
  return (
    <Navbar
      collapseOnSelect
      expand="lg"
      bg="dark"
      variant="dark"
      style={{ zIndex: 1 }}
    >
      <Container fluid>
        <Link to="/" className="navbar-brand">
          Admin Dashboard
        </Link>
        <Navbar.Toggle aria-controls="responsive-navbar-nav" />
        <Navbar.Collapse id="responsive-navbar-nav">
          <Nav className="mr-auto">
            {/* <NavDropdown title="Dropdown" id="collasible-nav-dropdown">
      <NavDropdown.Item href="#action/3.1">Action</NavDropdown.Item>
      <NavDropdown.Item href="#action/3.2">
        Another action
      </NavDropdown.Item>
      <NavDropdown.Item href="#action/3.3">
        Something
      </NavDropdown.Item>
      <NavDropdown.Divider />
      <NavDropdown.Item href="#action/3.4">
        Separated link
      </NavDropdown.Item>
    </NavDropdown> */}
          </Nav>
          {auth.authenticate ? wasLoggedIn() : notLogIn()}
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}

export default Header;
