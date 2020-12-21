import React, { useState, useEffect } from "react";
import { Login } from "../../components";
import { useHistory } from "react-router-dom";
import firebase from "firebase/app";
import "firebase/auth";
import {
  AppBar,
  Toolbar,
  IconButton,
  Typography,
  Button,
  Menu,
  MenuItem,
  Avatar,
  Modal,
  makeStyles,
  Paper,
} from "@material-ui/core";

const useStyles = makeStyles(() => ({
  toolbar: {
    display: "flex",
    justifyContent: "space-between",
  },
  modal: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
}));

function Header() {
  const classes = useStyles();
  const User = firebase.auth().currentUser;
  const [user, setUser] = useState(false);
  const history = useHistory();
  const [modalState, setModalState] = useState(false);
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
    <AppBar position="sticky">
      <Toolbar className={classes.toolbar}>
        <Typography variant="h6" onClick={() => history.push("/")}>
          Digital_Art
        </Typography>
        {!user && (
          <div>
            <Button
              variant="contained"
              color="default"
              onClick={() => setModalState(true)}
            >
              Login
            </Button>
            <Modal
              className={classes.modal}
              open={modalState}
              onClose={() => setModalState(false)}
            >
              <Paper>
                <Login />
              </Paper>
            </Modal>
          </div>
        )}

        {user && (
          <div>
            <IconButton
              aria-controls="simple-menu"
              aria-haspopup="true"
              onClick={handleMenu}
              color="inherit"
            >
              <Avatar alt={User.displayName} src={User.photoURL} />
            </IconButton>

            <Menu
              id="simple-menu"
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
                Upload image
              </MenuItem>
              <MenuItem
                onClick={() => {
                  handleClose();
                  firebase.auth().signOut();
                  history.push("/");
                  setModalState(false);
                }}
              >
                Logout
              </MenuItem>
            </Menu>
          </div>
        )}
      </Toolbar>
    </AppBar>
  );
}

export default Header;
