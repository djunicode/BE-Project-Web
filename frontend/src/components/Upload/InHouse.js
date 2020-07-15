import React, { Component } from "react";
import { Link } from "react-router-dom";
import "./Upload.css";
import axios from "axios";

const domains = [
  "Data Mining & Analytics",
  "Machine Learning",
  "Deep Learning",
  "Image Processing/Computer Vision",
  "Natural Language Processing/Artificial Intelligence",
  "Networking/Security",
  "Internet of Things(IOT)",
  "Mobile Computing",
  "Big Data",
  "Cloud Computing",
  "Computer Vision & Artificial Intelligence",
  "Blockchain",
  "Operating Systems",
];

class InHouse extends Component {
  state = {
    is_inhouse: true,
    title: "",
    domain: "",
    teacher: "",
    description: "",
    link: "",
    document: null,
    file: "Upload a File",
    date: "",
  };

  fileChange = async (e) => {
    e.preventDefault();
    this.setState({
      document: e.target.files[0],
      loaded: 0,
      file: e.target.files[0].name,
    });
  };

  handleChange = async (e) => {
    e.preventDefault();
    this.setState({ [e.target.name]: e.target.value });
  };

  handleSubmit = async (e) => {
    e.preventDefault();
    console.log(this.state);
    axios
      .post("http://127.0.0.1:8000/api/projects/", this.state)
      .then((res) => {
        console.log(res.data);
      });
  };

  render() {
    return (
      <form>
        <div className="flex">
          <input
            type="text"
            placeholder="Project title"
            name="title"
            value={this.state.title}
            onChange={this.handleChange}
            required
          />
          <select
            name="domain"
            value={this.state.domain}
            onChange={this.handleChange}
            required
          >
            <option value="" disabled selected>
              Select domian
            </option>
            {domains.map((domain) => (
              <option value={domain}>{domain}</option>
            ))}
          </select>
          <select name="mentor" id="" required>
            <option value="" disabled selected>
              Mentor
            </option>
            <option
              value="pranit-bari"
              name="mentor"
              onChange={this.handleChange}
            >
              Pranit Bari
            </option>
            <option
              value="pankaj-sonawane"
              name="mentor"
              onChange={this.handleChange}
            >
              Pankaj Sonawane
            </option>
          </select>
          <textarea
            cols="30"
            rows="5"
            placeholder="Description"
            name="description"
            value={this.state.description}
            onChange={this.handleChange}
            required
          />
          <input
            type="text"
            placeholder="Project Link"
            name="link"
            value={this.state.link}
            onChange={this.handleChange}
          />
          <div className="link">
            <input
              type="date"
              placeholder="Date of Creation"
              className="link1"
              name="date"
              onChange={this.handleChange}
              required
            />
            <label for="file-upload" class="custom-file-upload">
              {this.state.file}
            </label>
            <i class="far fa-folder-open" />
            <input id="file-upload" type="file" onChange={this.fileChange} />
          </div>
        </div>

        <button className="upload" type="submit" onClick={this.handleSubmit}>
          <Link style={{ color: "white" }} to="/contributors">
            Upload
          </Link>
        </button>
      </form>
    );
  }
}

export default InHouse;
