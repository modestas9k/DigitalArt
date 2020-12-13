import React, { useState, useEffect } from "react";
import { Link, useHistory } from "react-router-dom";
import firebase from "firebase/app";
import "firebase/auth";
import "./Header.scss";
import {
  AppBar,
  Toolbar,
  IconButton,
  Typography,
  Button,
  Menu,
  MenuItem,
  Avatar,
} from "@material-ui/core";

//import AccountCircle from "@material-ui/icons/AccountCircle";

function Header() {
  const User = firebase.auth().currentUser;
  const [user, setUser] = useState(false);
  const history = useHistory();
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);

  useEffect(() => {
    firebase.auth().onAuthStateChanged((user) => {
      if (user) {
        setUser(true);
      } else {
        setUser(false);
      }
    });
  }, []);
  const handleMenu = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  return (
    <AppBar position="static">
      <Toolbar className="header">
        <Typography variant="h5" onClick={() => history.push("/")}>
          Digital_Art
        </Typography>
        {!user && (
          <div className="header__buttons">
            <Button
              onClick={() => history.push("/login")}
              variant="outlined"
              color="inherit"
            >
              Login
            </Button>
            <Button
              onClick={() => history.push("/register")}
              variant="outlined"
              color="inherit"
            >
              Register
            </Button>
          </div>
        )}
        {user && (
          <div>
            <IconButton onClick={handleMenu} color="inherit">
              <Avatar alt={User.displayName} src={User.photoURL} />
              {/* <AccountCircle /> */}
            </IconButton>
            <Menu
              id="menu-appbar"
              anchorEl={anchorEl}
              anchorOrigin={{
                vertical: "top",
                horizontal: "right",
              }}
              keepMounted
              transformOrigin={{
                vertical: "top",
                horizontal: "right",
              }}
              open={open}
              onClose={handleClose}
            >
              <MenuItem
                onClick={() => {
                  handleClose();
                  history.push("/myProfile");
                }}
              >
                Profile
              </MenuItem>
              <MenuItem
                onClick={() => {
                  handleClose();
                  history.push("/upload");
                }}
              >
                Upload
              </MenuItem>
              <MenuItem
                onClick={() => {
                  handleClose();
                  firebase.auth().signOut();
                  history.push("/");
                }}
              >
                Logout
              </MenuItem>
            </Menu>
          </div>
        )}
      </Toolbar>
    </AppBar>

    // <div className="header">
    //   <Link className="logo" to="/">
    //     <h1>Digital_Art</h1>
    //   </Link>
    //   <nav>
    //     {user && (
    //       <>
    //         <Link className="styled-link" to="/">
    //           Home
    //         </Link>
    //         <Link className="styled-link" to="/myProfile">
    //           My Profile
    //         </Link>
    //         <Link className="styled-link" to="/upload">
    //           Upload
    //         </Link>
    //         <button
    //           onClick={() => {
    //             firebase.auth().signOut();
    //             history.push("/");
    //           }}
    //         >
    //           Logout
    //         </button>
    //       </>
    //     )}
    //     {!user && (
    //       <>
    //         <Link to="/register" className="styled-link">
    //           Register
    //         </Link>
    //         <Link to="/login" className="styled-link">
    //           Login
    //         </Link>
    //       </>
    //     )}
    //   </nav>
    // </div>
  );
}

export default Header;
