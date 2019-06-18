import React, { Component } from 'react';
import {BrowserRouter,Switch,Route} from 'react-router-dom';
import Home from './components/Home';
import Search from './components/Search';
import Upload from './components/Upload';
import Navbar from './components/elements/Navbar/Navbar';
import Contact from './components/Contact-Us';
import Notfound from './components/Notfound';
import Login from "./components/Login/Login"
class App extends Component {
  render() {
    return (
    <BrowserRouter>
      <div >
        <Navbar/>
        <hr></hr>
        <Switch >
          <Route path="/" component={Home} exact />
          <Route path="/search" component={Search} exact />
          <Route path="/upload" component={Upload} exact />
          <Route path="/contact" component={Contact} exact />          
          <Route path="/login" component={Login} exact />          
          <Route component={Notfound}/>
        </Switch>
      </div>
    </BrowserRouter>
    );
  }
}

export default App;
