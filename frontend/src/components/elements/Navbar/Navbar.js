import React, { Component } from 'react';
class NavBar extends Component {
  render() {
    return (
      <>
        <nav className="navbar navbar-expand-lg navbar-light bg-light" style={{height: 75}}>
          <div className="col-4" style={{textAlign:'left',}}>
            <a className="navbar-brand" href="/" style={{color: '#1E5CB9' }}>DJ ARCHIVE</a>
          </div>
          <button className="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarText" aria-controls="navbarText" aria-expanded="false" aria-label="Toggle navigation">
            <span className="navbar-toggler-icon"></span>
          </button>
          
          <div className="collapse navbar-collapse" id="navbarText">
            <div className="col-6 mr-auto">
            <ul className="navbar-nav " style={{}}>
              <div className="col">
              <li className="nav-item active ">
                <a className="nav-link" href="/">Home <span className="sr-only">(current)</span></a>
              </li>
              </div>
              <div className="col">
              <li className="nav-item">
                <a className="nav-link" href="Search">Search</a>
              </li>
              </div>
              <div className="col">
              <li className="nav-item">
                <a className="nav-link" href="Upload">Upload</a>
              </li>
              </div>
            </ul>
            </div>
            <div className="col-2 ">
            
            <span className="navbar-text">
            <i className="fa fa-lock" aria-hidden="true"> - </i>
              Faculty login
            </span>
            
            </div>
          </div>
          </nav>
      </>
    );
  }
}

export default NavBar;
