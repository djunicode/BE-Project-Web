import React, { Component } from "react";
import "./Navbar.css";

class NavBar extends Component {
  render() {
    return (
      <div>
        <nav>
          <ul>
            <li>
              <a href="/" className="navbar-brand" style={{ marginTop: 25 }}>
                DJ ARCHIVE
              </a>
            </li>
            <li>
              <a href="/browse" className="browse">
                Browse
              </a>
            </li>
            <li>
              <a href="/upload" className="upload">
                Upload
              </a>
            </li>
            <li>
              <a href="/contact-us" className="contact">
                Contact Us
              </a>
            </li>
            <li>
              <a href="/login" className="flogin">
                <i className="fas fa-lock" height="15px" />
                Faculty Login
              </a>
            </li>
          </ul>
        </nav>
      </div>
    );
  }
}

export default NavBar;
