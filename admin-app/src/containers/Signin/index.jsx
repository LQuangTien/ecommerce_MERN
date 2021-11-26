import React, { useState } from "react";
import { Button, Col, Form, Row } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import { Redirect } from "react-router-dom";
import { login } from "../../actions";
import Input from "../../components/UI/Input";
function Signin(props) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const auth = useSelector((state) => state.auth);
  const dispatch = useDispatch();

  if (auth.authenticate) {
    return <Redirect to="/" />;
  }

  const userLogin = (e) => {
    e.preventDefault();
    const user = { email, password };
    dispatch(login(user));
  };

  return (
    <Row className="m-5">
      <Col md={{ span: 6, offset: 3 }}>
        <Form onSubmit={userLogin}>
          <Input
            label="Email"
            placeholder="Email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <Input
            label="Password"
            placeholder="Password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
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
