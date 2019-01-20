import React, { Component } from "react";
import { BrowserRouter, Switch, Route } from "react-router-dom";
import Homepage from "./components/Homepage/Homepage";
import Browse from "./components/Browse";
import Upload from "./components/Upload";
import Navbar from "./components/elements/Navbar/Navbar";
import Notfound from "./components/Notfound";

class App extends Component {
  render() {
    return (
      <BrowserRouter>
        <React.Fragment>
          <Navbar />
          <Switch>
            <Route path="/" component={Homepage} exact />
            <Route path="/browse" component={Browse} exact />
            <Route path="/upload" component={Upload} exact />
            <Route component={Notfound} />
          </Switch>
        </React.Fragment>
      </BrowserRouter>
    );
  }
}

export default App;
