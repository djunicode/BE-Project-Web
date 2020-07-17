import React, { Component } from "react";
import "./Login.css";
import axios from "axios";
class Login extends Component {
  state = {
    username: "",
    password: "",
  };

  handleChange = async (e) => {
    e.preventDefault(); // console.log(e.target.name, e.target.value);
    await this.setState({ [e.target.name]: e.target.value });
  };

  handleSubmit = async (e) => {
    e.preventDefault();
    // await console.log(this.state);
    // change this to post a form data as the username and password are to be posted as the part of data part of the request
    // axios
    //   .post(
    //     `http://127.0.0.1:8000/api/Login/ username=${this.state.username} password=${this.state.password}`,
    //     this.state
    //   )
    //   .then((res) => {
    //     //   token = res.data.token;
    //     localStorage.setItem("token", `${res.data.token}`);
    //   });
  };

  render() {
    return (
      <div id="login">
        <h3 className="text-center text-white pt-5">Login form</h3>
        <div className="container">
          <div
            id="login-row"
            className="row justify-content-center align-items-center"
          >
            <div id="login-column" className="col-md-6">
              <div id="login-box" className="col-md-12">
                <form id="login-form" className="form">
                  <h3 className="text-center text-info">Login</h3>
                  <div className="form-group text-center">
                    <label htmlFor="username" className="text-info">
                      Username:
                    </label>
                    <br />
                    <input
                      type="text"
                      name="username"
                      id="username"
                      className="form-control"
                      value={this.state.username}
                      onChange={this.handleChange}
                    />
                  </div>
                  <div className="form-group text-center">
                    <label htmlFor="password" className="text-info">
                      Password:
                    </label>
                    <br />
                    <input
                      type="password"
                      name="password"
                      id="password"
                      className="form-control"
                      value={this.state.password}
                      onChange={this.handleChange}
                    />
                  </div>
                  <div className="form-group text-center">
                    {/* <label htmlFor="remember-me" className="text-info"><span>Remember me</span> <span><input id="remember-me" name="remember-me" type="checkbox" /></span></label><br /> */}
                    <button
                      className="btn btn-primary text-center"
                      onClick={this.handleSubmit}
                    >
                      Login
                    </button>
                  </div>
                  {/* <div id="register-link" className="text-right">
                                <a href="#" className="text-info">Register here</a>
                            </div> */}
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default Login;
