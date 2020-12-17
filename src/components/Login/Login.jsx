import React, { useState } from "react";
import firebase from "firebase/app";
import "firebase/auth";
import {
  Paper,
  Container,
  Typography,
  Button,
  TextField,
  Box,
} from "@material-ui/core";

export default function Login() {
  const [register, setRegister] = useState(false);
  const [loginData, setLoginData] = useState({
    email: "",
    password: "",
  });
  const [registerData, setRegisterData] = useState({
    email: "",
    password: "",
  });

  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");

  function login(data) {
    setEmailError("");
    setPasswordError("");

    if (!data.email) {
      return setEmailError("Enter email");
    }
    if (!data.password) {
      return setPasswordError("Enter password");
    }
    if (data.email && data.password) {
      firebase
        .auth()
        .signInWithEmailAndPassword(data.email, data.password)
        .then((user) => {
          console.log(user.uid);
        })
        .catch((error) => {
          if (error.code === "auth/invalid-email") {
            setEmailError(error.message);
          } else {
            setPasswordError(error.message);
          }
        });
    }
  }
  function registerUser(data) {
    setEmailError("");
    setPasswordError("");

    if (!data.email) {
      return setEmailError("Enter email");
    }
    if (!data.password) {
      return setPasswordError("Enter password");
    }
    if (data.email && data.password) {
      firebase
        .auth()
        .createUserWithEmailAndPassword(data.email, data.password)
        .then((user) => {
          console.log(user.uid);
        })
        .catch((error) => {
          if (error.code === "auth/invalid-email") {
            setEmailError(error.message);
          } else {
            setPasswordError(error.message);
          }
        });
    }
  }

  return (
    <>
      <Paper>
        {!register && (
          <Container>
            <Box p={2}>
              <Typography variant="h2" align="center">
                Login
              </Typography>
            </Box>
            <form>
              <TextField
                autoComplete
                helperText={emailError}
                error={Boolean(emailError)}
                margin="normal"
                fullWidth
                label="Email"
                variant="filled"
                required
                type="email"
                onChange={(e) =>
                  setLoginData({ ...loginData, email: e.target.value })
                }
              />

              <TextField
                autoComplete
                helperText={passwordError}
                error={Boolean(passwordError)}
                margin="normal"
                fullWidth
                label="Password"
                variant="filled"
                type="password"
                required
                onChange={(e) =>
                  setLoginData({ ...loginData, password: e.target.value })
                }
              />
              <Button
                fullWidth
                variant="contained"
                size="large"
                color="primary"
                type="submit"
                onClick={(e) => {
                  e.preventDefault();
                  login(loginData);
                }}
              >
                Enter
              </Button>
            </form>
            <Box pt={2}>
              <Typography align="center" variant="h6">
                Don't have account?
              </Typography>
            </Box>
            <Box
              p={2}
              display="flex"
              justifyContent="center"
              alignItems="center"
            >
              <Button
                variant="contained"
                color="primary"
                onClick={() => setRegister(true)}
              >
                Register
              </Button>
            </Box>
          </Container>
        )}
        {register && (
          <Container>
            <Box p={2}>
              <Typography variant="h2" align="center">
                Register
              </Typography>
            </Box>
            <form>
              <TextField
                helperText={emailError}
                error={Boolean(emailError)}
                margin="normal"
                fullWidth
                label="Email"
                variant="filled"
                type="email"
                required
                onChange={(e) =>
                  setRegisterData({ ...registerData, email: e.target.value })
                }
              />
              <TextField
                helperText={passwordError}
                error={Boolean(passwordError)}
                margin="normal"
                fullWidth
                label="Password"
                variant="filled"
                type="password"
                required
                onChange={(e) =>
                  setRegisterData({ ...registerData, password: e.target.value })
                }
              />
              <Button
                fullWidth
                variant="contained"
                color="primary"
                type="submit"
                onClick={(e) => {
                  e.preventDefault();
                  registerUser(registerData);
                }}
              >
                Enter
              </Button>
            </form>
            <Box pt={2}>
              <Typography align="center" variant="h6">
                Have account?
              </Typography>
            </Box>
            <Box
              p={2}
              display="flex"
              justifyContent="center"
              alignItems="center"
            >
              <Button
                variant="contained"
                color="primary"
                onClick={() => setRegister(!true)}
              >
                Login
              </Button>
            </Box>
          </Container>
        )}
      </Paper>
    </>
  );
}
