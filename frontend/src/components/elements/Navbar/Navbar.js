import React, { Component } from 'react';
import './Navbar.css';

class NavBar extends Component {
  render() {
    return (
      <>
        <nav className="navbar navbar-expand-lg" style={{height: 47, width:1170}}>
          <div className="col-4" style={{width:188 ,height:32}}>
            <a className="navbar-brand" href="/" >DJ ARCHIVE</a>
          </div>
          <button className="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarText" aria-controls="navbarText" aria-expanded="false" aria-label="Toggle navigation">
            <span className="navbar-toggler-icon"></span>
          </button>
          
          <div className="collapse navbar-collapse" id="navbarText" style={{width:364 ,height:43}}>
            <div className="col-6 mr-auto">
            <ul className="navbar-nav " style={{}}>
              <div className="col">
              <li className="nav-item">
                <span className="link-1" >
                  <a className="nav-link" href="Search">Browse <span className="sr-only">(current)</span></a>
                </span>
              </li>
              </div>
              <div className="col">
              <li className="nav-item">
                <a className="nav-link" href="Upload">Upload</a>
              </li>
              </div>
              <div className="col">
              <li className="nav-item">
                <a className="nav-link" href="Contact">Contact-Us</a>
              </li>
              </div>
            </ul>
            </div>
            <div className="col-2 ">
            
            <a href="Login">
            <span className="navbar-text" >
            <i className="fa fa-lock" aria-hidden="true" style={{  left: 1107}}> - </i>
              Faculty login
            </span>
            </a>
            
            </div>
          </div>
          </nav>
      </>
    );
  }
}

export default NavBar;
