import React, { useState, useEffect } from "react";
import { Link, useHistory } from "react-router-dom";
import firebase from "firebase/app";
import "firebase/auth";
import "./Header.scss";

function Header() {
  const [user, setUser] = useState(false);
  const history = useHistory();

  useEffect(() => {
    firebase.auth().onAuthStateChanged((user) => {
      if (user) {
        setUser(true);
      } else {
        setUser(false);
      }
    });
  }, []);

  return (
    <div className="header">
      <Link className="logo" to="/">
        <h1>Digital_Art</h1>
      </Link>
      <nav>
        {user && (
          <>
            <Link className="styled-link" to="/">
              Home
            </Link>
            <Link className="styled-link" to="/about">
              About
            </Link>
            <button
              onClick={() => {
                firebase.auth().signOut();
                history.push("/");
              }}
            >
              Logout
            </button>
          </>
        )}
        {!user && (
          <>
            <Link to="/register" className="styled-link">
              Register
            </Link>
            <Link to="/login" className="styled-link">
              Login
            </Link>
          </>
        )}
      </nav>
    </div>
  );
}

export default Header;
