import React, { Component } from "react";
import "./Upload.css";

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

class OutHouse extends Component {
  state = {
    is_inhouse: false,
    title: "",
    domain: "",
    description: "",
    link: "",
    date: "",
    company: "",
    supervisor: "",
  };

  handleChange = async (e) => {
    e.preventDefault(); // console.log(e.target.name, e.target.value);
    this.setState({ [e.target.name]: e.target.value });
  };

  handleSubmit = async (e) => {
    e.preventDefault();
    console.log(this.state);
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
          <input
            type="text"
            placeholder="Company"
            name="company"
            value={this.state.company}
            onChange={this.handleChange}
            required
          />
          <input
            type="text"
            placeholder="Supervisor"
            name="supervisor"
            value={this.state.supervisor}
            onChange={this.handleChange}
            required
          />
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
              Upload a file
            </label>
            <i class="far fa-folder-open" />
            <input id="file-upload" type="file" />
          </div>
        </div>
        <button className="upload" type="submit" onClick={this.handleSubmit}>
          Upload
        </button>
      </form>
    );
  }
}

export default OutHouse;
