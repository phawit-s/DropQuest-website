import React, { Fragment, lazy, Component } from "react";
import Home from "./components/Home";
import Register from "./components/register";
import Login from "./components/login";
import { BrowserRouter as Router, Link, Route, Switch } from "react-router-dom";
import { AuthProvider } from "./contexts/AuthContext"

function App() {
  return (
    <AuthProvider>
      <Router>
        <Switch>
          <Route exact path="/" component={Home} />
          <Route exact path="/login" component={Login} />
          <Route exact path="/register" component={Register} />
        </Switch>
      </Router>
    </AuthProvider>
  );
}

export default App;
