import React, { Component } from 'react';
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import './App.css';
import Dashboard from './Dashboard/Dashboard.js';
import SetsSelector from './Sets/SetsSelector';
import EditSet from './Sets/EditSet';
import jwt_decode from "jwt-decode";
import setAuthToken from "./utils/setAuthToken";
import { setCurrentUser, logoutUser } from "./actions/authActions";

import { Provider } from "react-redux";
import store from "./store";

import Navbar from "./components/layout/Navbar";
import Landing from "./components/layout/Landing";
import Register from "./components/auth/Register";
import Login from "./components/auth/Login";
import PrivateRoute from "./components/private-route/PrivateRoute";
import Layout from './Layout/Layout';
import EditCard from './Cards/EditCard';
import SelectArrangements from './Arrangements/SelectArrangments';
import LoadDataIfNotPresent from './components/LoadDataIfNotPresent';
import EditArrangement from './Arrangements/EditArrangement';
import FAQ from './UserManual/FAQ';

// Check for token to keep user logged in
if (localStorage.jwtToken) {
  // Set auth token header auth
  const token = localStorage.jwtToken;
  setAuthToken(token);
  // Decode token and get user info and exp
  const decoded = jwt_decode(token);
  // Set user and isAuthenticated
  store.dispatch(setCurrentUser(decoded));
  // Check for expired token
  const currentTime = Date.now() / 1000; // to get in milliseconds
  if (decoded.exp < currentTime) {
    // Logout user
    store.dispatch(logoutUser());
    // Redirect to login
    window.location.href = "./login";
  }
}

class App extends Component {
  render() {
    return (
      <Provider store={store}>
      <Router>
      <div className="App">
        <Navbar />
        <Switch>
          <Route exact path="/" component={Landing} />
          <Route exact path="/register" component={Register} />
          <Route exact path="/login" component={Login} />
          <Layout>
            <LoadDataIfNotPresent>
              <PrivateRoute exact path="/dashboard" component={Dashboard} />
              <PrivateRoute exact path="/sets" component={SetsSelector} />
              <PrivateRoute exact path="/edit-set" component={EditSet} />
              <PrivateRoute exact path="/edit-card" component={EditCard} />
              <PrivateRoute exact path="/edit-arrangement" component={EditArrangement} />
              <PrivateRoute exact path="/arrangements" component={SelectArrangements} />
              <PrivateRoute exact path="/faq" component={FAQ} />
            </LoadDataIfNotPresent>
          </Layout>
        </Switch>
      </div>
      </Router>
      </Provider>
    );
  }
}

export default App;
