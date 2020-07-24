import React from 'react';
import {
  BrowserRouter as Router,
  Switch,
  Route
} from "react-router-dom";
import ProtectedRoute from './ProtectedRoute';
import SignedInRoute from './SignInRoute';
import MainNav from './components/MainNav';
import Home from './components/Home';
import Search from './components/Search';
import Login from './components/Login';
import Upload from './components/Upload';
import TeacherDashboard from './components/TeacherDashboard';
import Footer from './components/Footer';

function App() {
  return (
    <div className="App">
      <Router>
        <Switch>
          <Route exact path="/" component={Home}/>
          <Route exact path="/search" component={Search}/>
          <SignedInRoute exact path="/login" component={Login}/>
          <Route exact path="/upload" component={Upload}/>
          <ProtectedRoute exact path="/teacher" component={TeacherDashboard}/>
          <Route path="*" exact component={() => '404 NOT FOUND'} />{' '}
        </Switch>
      </Router>
      <Footer/>
    </div>
  );
}

export default App;
