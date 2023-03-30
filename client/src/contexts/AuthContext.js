import React, { createContext, useContext, useEffect, useState } from "react";
import { useHistory, Redirect } from "react-router-dom";
import { useToasts } from "react-toast-notifications";
import { Box } from "rebass";
import api from "../api";
import { auth, database } from "../config/firebaseconfig";
import { signInWithEmailAndPassword, signOut } from "firebase/auth";
import _ from "lodash";

const AuthContext = createContext({
  currentUser: null,
  registeremail: () => Promise,
  loginemail: () => Promise,
  resetpassword: () => Promise,
  changepassword: () => Promise,
  uploadphoto: () => Promise,
  logout: () => Promise,
  savequiz: () => Promise,
  editquiz: () => Promise,
  createroom: () => Promise,
});

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [loading, setLoading] = useState(true);
  const [currentUser, setCurrentuser] = useState(null);
  const { addToast } = useToasts();
  const history = useHistory();
  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      setCurrentuser(JSON.parse(storedUser));
    }
    setLoading(false);
  }, []);
  if (loading) {
    return <Box></Box>;
  }

  async function registeremail(email, password, username, imageFile) {
    const formData = new FormData();
    formData.append("image", imageFile);
    formData.append("email", email);
    formData.append("username", username);
    formData.append("password", password);

    try {
      await api.post("/create", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      addToast("Register success!!", {
        appearance: "success",
        autoDismiss: true,
      });
    } catch (error) {
      addToast(error.response.data.message, {
        appearance: "error",
        autoDismiss: true,
      });
    }
  }

  async function resetpassword(email) {
    api.post("/resetpassword", { email: email }).catch((error) => {
      addToast(error.response.data.message, {
        appearance: "error",
        autoDismiss: true,
      });
    });
  }

  function changepassword(token, password) {
    api
      .post("/changepassword", { token: token, password: password })
      .then(() => {
        addToast("Password has been change", {
          appearance: "success",
          autoDismiss: true,
        });
      })
      .catch((error) => {
        addToast(error.response.data.message, {
          appearance: "error",
          autoDismiss: true,
        });
      });
  }

  async function loginemail(email, password) {
    api
      .post("/login", { email: email, password: password })
      .then((response) => {
        localStorage.setItem("user", JSON.stringify(response.data));
        setCurrentuser(response.data);
        addToast("Login success!!", {
          appearance: "success",
          autoDismiss: true,
        });
      })
      .catch((error) => {
        addToast(error.response.data.message, {
          appearance: "error",
          autoDismiss: true,
        });
      });
  }

  async function logout() {
    localStorage.removeItem("user");
    localStorage.removeItem("Question");
    setCurrentuser(null);
    history.push({
      pathname: `/login`,
    });
    addToast("Logout!!", {
      appearance: "warning",
      autoDismiss: true,
    });
  }

  async function editquiz(quizdata, questiondata, quizid) {
    const formData = new FormData();
    formData.append("quizid", quizid);
    formData.append("quizdata", JSON.stringify(quizdata));
    formData.append("questiondata", JSON.stringify(questiondata));

    api
      .post("/updatequiz", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      })
      .then(() => {
        addToast("Create success!!", {
          appearance: "success",
          autoDismiss: true,
        });
      });

    window.localStorage.removeItem("Question");
    window.localStorage.removeItem("EditQuiz");
  }

  async function createroom(name, startdate, enddate, quizid, rooms) {
    const userid = currentUser.user_id;
    api
      .post("/createroom", {
        userid: userid,
        name: name,
        startdate: startdate,
        enddate: enddate,
        quizid: quizid,
        room : JSON.stringify(rooms)
      })
      .then(() => {
        addToast("Create Room success!!", {
          appearance: "success",
          autoDismiss: true,
        });
      });
  }

  async function savequiz(quizdata, questiondata, imageFile) {
    const userid = currentUser.user_id;
    const formData = new FormData();
    formData.append("userid", userid);
    formData.append("quizdata", JSON.stringify(quizdata));
    formData.append("questiondata", JSON.stringify(questiondata));
    formData.append("image", imageFile);

    api
      .post("/createquiz", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      })
      .then(() => {
        addToast("Create success!!", {
          appearance: "success",
          autoDismiss: true,
        });
      });

    window.localStorage.removeItem("Question");
  }
  const value = {
    currentUser,
    registeremail,
    loginemail,
    resetpassword,
    changepassword,
    logout,
    savequiz,
    editquiz,
    createroom,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
