import React, { useState } from "react";
import { Button, Col, Form, Row } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import { Redirect } from "react-router-dom";
import { signup } from "../../actions";
import Input from "../../components/UI/Input";
function Signup(props) {
  const [firstName, setFristName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const auth = useSelector((state) => state.auth);
  const user = useSelector((state) => state.user);
  const dispatch = useDispatch();

  const handleSubmit = (e) => {
    e.preventDefault();
    const user = { firstName, lastName, email, password };
    dispatch(signup(user));
  };
  if (auth.authenticate) {
    return <Redirect to="/" />;
  }
  if (user.loading) {
    return <h1>LOADING ...</h1>;
  }
  return (
    <div
      style={{ height: "100vh" }}
      className="d-flex justify-content-center align-items-center"
    >
      {user.message ? user.message : ""}
      <Form onSubmit={handleSubmit} className="w-25">
        <Row>
          <Col md={6}>
            <Input
              label="Frist name"
              placeholder="Frist name"
              type="text"
              value={firstName}
              onChange={(e) => setFristName(e.target.value)}
            />
          </Col>
          <Col md={6}>
            <Input
              label="Last name"
              placeholder="Last name"
              type="text"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
            />
          </Col>
        </Row>
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
          Submit
        </Button>
      </Form>
    </div>
  );
}

Signup.propTypes = {};

export default Signup;
