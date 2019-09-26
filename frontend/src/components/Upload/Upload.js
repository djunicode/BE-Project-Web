import React, { Component } from "react";
import "./Upload.css";
import OutHouse from "./OutHouse";
import InHouse from "./InHouse";

class Upload extends Component {
  state = {
    type: "inhouse"
  };

  handleChange = async e => {
    this.setState({ type: e.target.value });
  };

  render() {
    return (
      <div>
        <h2 className="head">Upload Projects</h2>
        <div
          style={{ display: "flex", flexDirection: "row", marginLeft: "10%" }}
        >
          <h3>Project Type: </h3>
          <label style={{ marginLeft: "2%", marginRight: "2%" }}>
            <input
              type="radio"
              value="inhouse"
              checked={this.state.type === "inhouse"}
              onChange={this.handleChange}
            />
            Inhouse
          </label>
          <label>
            <input
              type="radio"
              value="outhouse"
              checked={this.state.type === "outhouse"}
              onChange={this.handleChange}
            />
            Outhouse
          </label>
        </div>
        {this.state.type === "inhouse" ? <InHouse /> : <OutHouse />}
      </div>
    );
  }
}

export default Upload;
