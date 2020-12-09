import React, { useState, useContext } from "react";
import { Button, Section, Input } from "../../components";
import firebase from "firebase/app";
import "firebase/auth";
import { AuthContext } from "../../contexts/AuthContext";
import { useHistory } from "react-router-dom";
import "./Login.scss";

function Login() {
  const history = useHistory();
  const Auth = useContext(AuthContext);
  const [fields, setFields] = useState({
    email: "",
    password: "",
  });

  function login(data) {
    firebase
      .auth()
      .signInWithEmailAndPassword(data.email, data.password)
      .then((user) => {
        Auth.setState(user.uid);
        history.push("/");
      })
      .catch((error) => {
        console.log(error);
      });
  }

  return (
    <Section>
      <form
        className="form"
        onSubmit={(e) => {
          e.preventDefault();
          login(fields);
        }}
      >
        <h1 className="headline">Login</h1>
        <Input
          name="email"
          label="Email address"
          type="email"
          placeholder="example@mail.com"
          required
          handleChange={(e) =>
            setFields({
              ...fields,
              email: e.target.value.toLowerCase(),
            })
          }
        />
        <Input
          name="password"
          label="Password"
          type="Password"
          placeholder="write something secret"
          required
          handleChange={(e) =>
            setFields({
              ...fields,
              password: e.target.value.toLowerCase(),
            })
          }
        />
        <Button className="button button-primary">Login</Button>
      </form>
    </Section>
  );
}

export default Login;
