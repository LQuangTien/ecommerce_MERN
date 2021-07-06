import React from "react";
import Header from "../Header";
import { Container, Col, Row } from "react-bootstrap";
import { NavLink } from "react-router-dom";
import { useSelector } from "react-redux";
function Layout(props) {
  const auth = useSelector((state) => state.auth);
  const wasLoggedIn = () => (
    <Container fluid>
      <Row>
        <Col md={2} className="sidebar">
          <ul>
            <li>
              <NavLink to="/">Home</NavLink>
            </li>
            <li>
              <NavLink to="/category">Category</NavLink>
            </li>
            <li>
              <NavLink to="/products">Products</NavLink>
            </li>
            <li>
              <NavLink to="/orders">Orders</NavLink>
            </li>
          </ul>
        </Col>
        <Col md={10} style={{ marginLeft: "auto" }}>
          {props.children}
        </Col>
      </Row>
    </Container>
  );
  return (
    <>
      <Header />
      {auth.authenticate ? wasLoggedIn() : props.children}
    </>
  );
}

export default Layout;
