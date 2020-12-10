import React, { useState, useContext } from "react";
import { Button, Section, Input } from "../../components";
import firebase from "firebase/app";
import "firebase/auth";
import { AuthContext } from "../../contexts/AuthContext";
import { useHistory } from "react-router-dom";
import "./Register.scss";

function Register() {
  const history = useHistory();
  const Auth = useContext(AuthContext);
  const [error, setError] = useState();
  const [fields, setFields] = useState({
    email: "",
    password: "",
  });

  function register(data) {
    firebase
      .auth()
      .createUserWithEmailAndPassword(data.email, data.password)
      .then((user) => {
        Auth.setState(user.uid);
        history.push("/");
      })
      .catch((error) => {
        setError(error);
      });
  }

  return (
    <Section>
      <form
        className="form"
        onSubmit={(e) => {
          e.preventDefault();
          register(fields);
        }}
      >
        <h1 className="headline">Register</h1>

        <Input
          name="email"
          label="Email"
          type="email"
          placeholder="Enter your email"
          required
          handleChange={(e) =>
            setFields({
              ...fields,
              email: e.target.value.toLowerCase(),
            })
          }
        >
          {error && error.code === "auth/invalid-email" && (
            <span>{error.message}</span>
          )}
        </Input>

        <Input
          name="password"
          label="Password"
          type="Password"
          placeholder="Enter your password"
          required
          handleChange={(e) =>
            setFields({
              ...fields,
              password: e.target.value.toLowerCase(),
            })
          }
        >
          {error && error.code === "auth/weak-password" && (
            <span>{error.message}</span>
          )}
        </Input>
        <Button className="button button-primary">Register</Button>
      </form>
    </Section>
  );
}

export default Register;
