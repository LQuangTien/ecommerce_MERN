import React from "react";
import PropTypes from "prop-types";
import { Form, Button, Row, Col } from "react-bootstrap";
import Input from "../../components/UI/Input";
function Signup(props) {
  return (
    <Row className="m-5">
      <Col md={{ span: 6, offset: 3 }}>
        <Form>
          <Row>
            <Col md={6}>
              <Input
                label="Frist name"
                placeholder="Frist name"
                type="text"
                value=""
                onChange={() => {}}
              />
            </Col>
            <Col md={6}>
              <Input
                label="Last name"
                placeholder="Last name"
                type="text"
                value=""
                onChange={() => {}}
              />
            </Col>
          </Row>
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
            Submit
          </Button>
        </Form>
      </Col>
    </Row>
  );
}

Signup.propTypes = {};

export default Signup;
