import React from "react";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import { AuthProvider } from "./contexts/AuthContext";
import { ToastProvider, useToasts } from "react-toast-notifications";
import Home from "./components/Home";
import Register from "./components/Authentication/register";
import Login from "./components/Authentication/login";
import Resetpassword from "./components/Authentication/resetpassword";
import ChangePassword from "./components/Authentication/changepassword";
import CreateQuiz from "./components/Quiz/createquiz";


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
            <Route exact path="/createquiz" component={CreateQuiz} />
          </Switch>
        </Router>
      </AuthProvider>
    </ToastProvider>
  );
}

export default App;
