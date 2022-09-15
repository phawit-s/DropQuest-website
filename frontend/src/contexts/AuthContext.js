import React, { createContext, useContext, useEffect, useState } from "react";
import { Dimmer, Loader, Segment } from "semantic-ui-react";
import { useToasts } from "react-toast-notifications";
import { Box } from "rebass";
import { auth, storage } from "../config/firebaseconfig";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  sendPasswordResetEmail,
  signInWithPopup,
  GoogleAuthProvider,
  FacebookAuthProvider,
  signOut,
  updateProfile,
  confirmPasswordReset,
} from "firebase/auth";
import { ref, uploadBytes, getDownloadURL, listAll } from "firebase/storage";
import { v4 } from "uuid";

const AuthContext = createContext({
  currentUser: null,
  registeremail: () => Promise,
  loginemail: () => Promise,
  signInWithGoogle: () => Promise,
  signInWithFacebook: () => Promise,
  resetpassword: () => Promise,
  changepassword: () => Promise,
  uploadphoto: () => Promise,
  logout : ()=> Promise
});

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [loading, setLoading] = useState(true);
  const [currentUser, setCurrentuser] = useState(null);
  const { addToast } = useToasts();

  useEffect(() => {
    auth.onAuthStateChanged((user) => {
      setCurrentuser(user);
      setLoading(false);
    });
  }, []);
  if (loading) {
    return (
      <Box>
        <Segment>
          <Dimmer active>
            <Loader content="Loading" />
          </Dimmer>
        </Segment>
      </Box>
    );
  }
  async function registeremail(email, password, username, picture) {
    const pictureref = ref(storage, `profile/${picture.name + v4()}`);
    await uploadBytes(pictureref, picture).catch((error) => {
      addToast(error.message, {
        appearance: "error",
        autoDismiss: true,
      });
    });
    const photoURL = await getDownloadURL(pictureref);
    await createUserWithEmailAndPassword(auth, email, password)
      .then(() => {
        updateProfile(auth.currentUser, {
          displayName: username,
          photoURL: photoURL,
        });
      })
      .catch((error) => {
        addToast(error.message, {
          appearance: "error",
          autoDismiss: true,
        });
      });
  }

  async function resetpassword(email) {
    return await sendPasswordResetEmail(auth, email, {
      url: "http://localhost:3000/login",
    });
  }

  function changepassword(oobcode, password) {
    return confirmPasswordReset(auth, oobcode, password);
  }


  async function loginemail(email, password) {
    return await signInWithEmailAndPassword(auth, email, password).then(()=>{
      addToast("Login success!!", {
        appearance: "success",
        autoDismiss: true,
      });
    }).catch((error) => {
      addToast(error.message, {
        appearance: "error",
        autoDismiss: true,
      });
    });
  }

  async function logout() {
    return await signOut(auth).then(()=>{
      addToast("Logout!!", {
        appearance: "warning",
        autoDismiss: true,
      });
    })
  }

  async function signInWithGoogle() {
    const provider = new GoogleAuthProvider();
    return await signInWithPopup(auth, provider);
  }

  async function signInWithFacebook() {
    const provider = new FacebookAuthProvider();
    return await signInWithPopup(auth, provider);
  }

  const value = {
    currentUser,
    registeremail,
    loginemail,
    signInWithGoogle,
    signInWithFacebook,
    resetpassword,
    changepassword,
    logout
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
