import React, { Component } from 'react';
import {BrowserRouter,Switch,Route} from 'react-router-dom';
import Home from './components/Home';
import Search from './components/Search';
import Upload from './components/Upload';
import Navbar from './components/elements/Navbar/Navbar';
import Notfound from './components/Notfound'

class App extends Component {
  render() {
    return (
    <BrowserRouter>
      <>
        <Navbar/>
        <Switch>
          <Route path="/" component={Home} exact />
          <Route path="/search" component={Search} exact />
          <Route path="/upload" component={Upload} exact />
          <Route component={Notfound}/>
        </Switch>
      </>
    </BrowserRouter>
    );
  }
}

export default App;
