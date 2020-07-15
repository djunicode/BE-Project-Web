import React, { Component } from "react";
import "./Upload.css";

class Contributors extends Component {
  state = {
    name1: "",
    name2: "",
    name3: "",
    name4: "",
  };

  handleChange = async (e) => {
    e.preventDefault();
    this.setState({ [e.target.name]: e.target.value });
  };

  handleSubmit = async (e) => {
    e.preventDefault();
    console.log(this.state);
  };

  render() {
    return (
      <div className="contibutors">
        <h3 className="text-center">Contibutors</h3>
        <div>
          <div className="inner">
            <input
              type="text"
              placeholder="Name"
              name="name1"
              value={this.state.name1}
              onChange={this.handleChange}
            />
            <input
              type="text"
              placeholder="Name"
              name="name2"
              value={this.state.name2}
              onChange={this.handleChange}
            />
          </div>
          <div className="inner">
            <input
              type="text"
              placeholder="Name"
              name="name3"
              value={this.state.name3}
              onChange={this.handleChange}
            />
            <input
              type="text"
              placeholder="Name"
              name="name4"
              value={this.state.name4}
              onChange={this.handleChange}
            />
          </div>
          <div className="text-center mb-3">
            <button
              className="btn btn-primary text-center"
              type="submit"
              onClick={this.handleSubmit}
            >
              Upload
            </button>
          </div>
        </div>
      </div>
    );
  }
}

export default Contributors;
