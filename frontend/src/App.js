import React from 'react';
import {
  BrowserRouter as Router,
  Switch,
  Route
} from "react-router-dom";
import MainNav from './components/Header/MainNav';
import Home from './components/Home';
import Search from './components/Search';
import Login from './components/Login';
import Upload from './components/Upload';

function App() {
  return (
    <div className="App">
      <MainNav/>
      <Router>
        <Switch>
          <Route exact path="/" component={Home}/>
          <Route exact path="/search" component={Search}/>
          <Route exact path="/login" component={Login}/>
          <Route exact path="/upload" component={Upload}/>
        </Switch>
      </Router>
    </div>
  );
}

export default App;
