import React from "react";
import PropTypes from "prop-types";
import { Jumbotron, Row, Col } from "react-bootstrap";
import "./style.css";
function Home(props) {
  return (
    // <Jumbotron className="text-center bg-white" style={{ margin: "5rem" }}>
    //   <h1>Welcome to Admin Dashboard</h1>
    // </Jumbotron>
    <Row>
      <Col md={2} className="sidebar">
        Side bar
      </Col>
      <Col md={10} style={{ marginLeft: "auto" }}>
        Container
      </Col>
    </Row>
  );
}

Home.propTypes = {};

export default Home;
