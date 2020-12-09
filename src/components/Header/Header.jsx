import React from "react";
import "./Header.scss";
import { Link } from "react-router-dom";
import logoImg from "../../assets/logo.png";

function Header() {
  return (
    <div className="header">
      <Link to="/">
        <img className="img-logo" src={logoImg} alt="Logo" />
      </Link>
      <nav>
        <Link className="styled-link" to="/">
          Home
        </Link>
        <Link className="styled-link" to="/about">
          About
        </Link>
      </nav>
    </div>
  );
}

export default Header;
