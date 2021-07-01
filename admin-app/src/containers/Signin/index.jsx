import React from "react";
import PropTypes from "prop-types";
import { Form, Button, Row, Col } from "react-bootstrap";
import Input from "../../components/UI/Input";
function Signin(props) {
  return (
    <Row className="m-5">
      <Col md={{ span: 6, offset: 3 }}>
        <Form>
          <Input
            label="Email"
            placeholder="Email"
            type="email"
            value=""
            onChange={() => {}}
          />
          <Input
            label="Password"
            placeholder="Password"
            type="password"
            value=""
            onChange={() => {}}
          />
          <Button variant="primary" type="submit">
            Submitt
          </Button>
        </Form>
      </Col>
    </Row>
  );
}

Signin.propTypes = {};

export default Signin;
