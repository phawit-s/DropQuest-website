import React, { createContext, useContext, useEffect, useState } from "react";
import { useHistory, Redirect } from "react-router-dom";
import { useToasts } from "react-toast-notifications";
import { Box } from "rebass";
import api from "../api";
import { auth, database } from "../config/firebaseconfig";
import { signInWithEmailAndPassword, signOut } from "firebase/auth";

const AuthContext = createContext({
  currentUser: null,
  registeremail: () => Promise,
  loginemail: () => Promise,
  resetpassword: () => Promise,
  changepassword: () => Promise,
  uploadphoto: () => Promise,
  logout: () => Promise,
  savequiz: () => Promise,
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
    setCurrentuser(null);
    history.push({
      pathname: `/login`,
    });
    addToast("Logout!!", {
      appearance: "warning",
      autoDismiss: true,
    });
  }

  async function savequiz(quizdata, questiondata) {
    //   const userid = auth.currentUser;
    //   push(ref_database(database, "Quiz/" + userid.uid), {
    //     name: quizdata.name,
    //     createby: userid.displayName,
    //     uid: userid.uid,
    //     question: questiondata,
    //     category: quizdata.category,
    //     releasedate: quizdata.releasedate,
    //   });
    //   window.localStorage.removeItem("Question");
  }
  const value = {
    currentUser,
    registeremail,
    loginemail,
    resetpassword,
    changepassword,
    logout,
    savequiz,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
