import React, { Component } from "react";
import { BrowserRouter, Switch, Route } from "react-router-dom";
import Home from "./components/Home";
import Search from "./components/Search";
import Navbar from "./components/elements/Navbar/Navbar";
import Contact from "./components/Contact-Us";
import Notfound from "./components/Notfound";
import Login from "./components/Login/Login";
import Upload from "./components/Upload/Upload";
import InHouse from "./components/Upload/InHouse";
import OutHouse from "./components/Upload/OutHouse";
import Contributors from "./components/Upload/Contributors";
class App extends Component {
  render() {
    return (
      <BrowserRouter>
        <div>
          <Navbar />
          <hr />
          <Switch>
            <Route path="/" component={Home} exact />
            <Route path="/search" component={Search} exact />
            <Route path="/upload" component={Upload} exact />
            <Route path="/inhouse" component={InHouse} exact />
            <Route path="/outhouse" component={OutHouse} exact />
            <Route path="/contributors" component={Contributors} exact />
            <Route path="/contact" component={Contact} exact />
            <Route path="/login" component={Login} exact />
            <Route component={Notfound} />
          </Switch>
        </div>
      </BrowserRouter>
    );
  }
}

export default App;
