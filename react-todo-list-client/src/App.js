import React from 'react';
import {
  BrowserRouter as Router,
  Switch,
  Route,
} from 'react-router-dom';
import Store from './store/store';
import Error404 from './containers/errors/404';
import Login from './containers/login/login';
import Register from './containers/register/register';
import Home from './containers/home/home';

export default function App() {
  return (
    <Store>
      <Router>
        <Switch>
          <Route exact path="/">
            <Home />
          </Route>
          <Route path="/login">
            <Login />
          </Route>
          <Route path="/register">
            <Register />
          </Route>
          <Route path="*">
            <Error404 />
          </Route>
        </Switch>
      </Router>
    </Store>
  );
}
