import React from "react";
import Header from "../Header";
import { Container } from "react-bootstrap";
function Layout(props) {
  return (
    <>
      <Header />
      <Container fluid>{props.children}</Container>
    </>
  );
}

export default Layout;
