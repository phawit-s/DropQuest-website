import React from "react";
import Home from "./components/Home";
import Register from "./components/register";
import Login from "./components/login";
import Resetpassword from "./components/resetpassword";
import ChangePassword from "./components/changepassword";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import { AuthProvider } from "./contexts/AuthContext";
import { ToastProvider, useToasts } from "react-toast-notifications";

function App() {
  return (
    <ToastProvider>
      <AuthProvider>
        <Router>
          <Switch>
            <Route exact path="/" component={Home} />
            <Route exact path="/login" component={Login} />
            <Route exact path="/register" component={Register} />
            <Route exact path="/forgotpassword" component={Resetpassword} />
            <Route exact path="/changepassword" component={ChangePassword} />
          </Switch>
        </Router>
      </AuthProvider>
    </ToastProvider>
  );
}

export default App;
