import React from "react";
import PropTypes from "prop-types";
import { Jumbotron } from "react-bootstrap";
function Home(props) {
  return (
    <Jumbotron className="text-center bg-white" style={{ margin: "5rem" }}>
      <h1>Welcome to Admin Dashboard</h1>
    </Jumbotron>
  );
}

Home.propTypes = {};

export default Home;
