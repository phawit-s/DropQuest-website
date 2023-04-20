import React, { useEffect, useState } from "react";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import { AuthProvider } from "./contexts/AuthContext";
import { ToastProvider } from "react-toast-notifications";
import Home from "./components/Home";
import Detail from "./components/detail";
import Register from "./components/Authentication/register";
import Login from "./components/Authentication/login";
import Resetpassword from "./components/Authentication/resetpassword";
import ChangePassword from "./components/Authentication/changepassword";
import Profile from "./components/Authentication/profile";
import CreateQuiz from "./components/Quiz/createquiz";
import CreateQuestion from "./components/Quiz/createquestion";
import Myquiz from "./components/created/myquiz";
import Createroom from "./components/Quiz/createroom";
import Myroom from "./components/created/myroom";
import Score from "./components/summary/score";
import { ThemeProvider } from "styled-components";
import theme from "./contexts/theme";

function App() {
  useEffect(() => {
    document.title = "Dropquest"; // set the tab name
  }, []);
  return (
    <ThemeProvider theme={theme}>
      <ToastProvider>
        <AuthProvider>
          <Router>
            <Switch>
              <Route exact path="/" component={Home} />
              <Route exact path="/detail" component={Detail} />
              <Route exact path="/login" component={Login} />
              <Route exact path="/register" component={Register} />
              <Route exact path="/profile" component={Profile} />
              <Route exact path="/resetpassword" component={Resetpassword} />
              <Route path="/resetpassword/:token" component={ChangePassword} />
              <Route exact path="/createquiz" component={CreateQuiz} />
              <Route exact path="/createquestion" component={CreateQuestion} />
              <Route exact path="/myquiz" component={Myquiz} />
              <Route exact path="/createroom" component={Createroom} />
              <Route exact path="/myroom" component={Myroom} />
              <Route exact path="/summary" component={Score} />
            </Switch>
          </Router>
        </AuthProvider>
      </ToastProvider>
    </ThemeProvider>
  );
}

export default App;
