import React, { Component } from "react";
import "./Homepage.css";

export class Homepage extends Component {
  render() {
    return (
      <div className="bground">
        <p className="lookup">Look Up the Archive</p>
        <p className="selectdomain">
          Select the domain of the project you are loooking for
        </p>
        <div className="row justify-content-center">
          <div className="col-lg-2 domain">
            <p className="domaintext">Machine</p>
            <p className="domaintext">Learning</p>
          </div>
          <div className="col-lg-2 domain">
            <p className="domaintext">Artificial</p>
            <p className="domaintext">Intelligence</p>
          </div>
          <div className="col-lg-2 domain">
            <p className="domaintext">Image</p>
            <p className="domaintext">Processing</p>
          </div>
          <div className="col-lg-2 domain">
            <p className="domaintext">Computer</p>
            <p className="domaintext">Vision</p>
          </div>
        </div>
        <div className="row justify-content-center">
          <div className="col-lg-2 domain">
            <p className="domaintext">Data Mining</p>
            <p className="domaintext">and</p>
            <p className="domaintext">Analytics</p>
          </div>
          <div className="col-lg-2 domain">
            <p className="domaintext">Natural</p>
            <p className="domaintext">Language</p>
            <p className="domaintext">Processing</p>
          </div>
          <div className="col-lg-2 domain">
            <p className="domaintext">Networking</p>
          </div>
          <div className="col-lg-2 domain">
            <p className="domaintext">Security</p>
          </div>
        </div>
        <div className="row justify-content-center">
          <div className="col-lg-2 domain">
            <p className="domaintext">Internet of</p>
            <p className="domaintext">Things</p>
          </div>
          <div className="col-lg-2 domain">
            <p className="domaintext">Mobile</p>
            <p className="domaintext">Computing</p>
          </div>
          <div className="col-lg-2 domain">
            <p className="domaintext">Big Data</p>
          </div>
          <div className="col-lg-2 domain">
            <p className="domaintext">Cloud</p>
            <p className="domaintext">Computing</p>
          </div>
        </div>
        <p className="interests">Couldn't find your interests?</p>
        <a href="/search" className="advancesearch">
          Perform Advanced Search
        </a>
      </div>
    );
  }
}

export default Homepage;
