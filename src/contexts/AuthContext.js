import React, { createContext, useContext, useEffect, useState } from "react";
// import { Dimmer, Loader, Segment } from "semantic-ui-react";
import { useToasts } from "react-toast-notifications";
import { Box } from "rebass";
import { auth, storage, database } from "../config/firebaseconfig";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  sendPasswordResetEmail,
  signInWithPopup,
  GoogleAuthProvider,
  FacebookAuthProvider,
  GithubAuthProvider,
  signOut,
  updateProfile,
  fetchSignInMethodsForEmail,
  linkWithCredential,
  confirmPasswordReset,
} from "firebase/auth";
// import from "firebase/"
import {
  ref as ref_storage,
  uploadBytes,
  getDownloadURL,
  listAll,
} from "firebase/storage";
import { ref as ref_database, set, getDatabase, push } from "firebase/database";
import { v4 } from "uuid";

const AuthContext = createContext({
  currentUser: null,
  registeremail: () => Promise,
  loginemail: () => Promise,
  signInWithGoogle: () => Promise,
  signInWithFacebook: () => Promise,
  signInWithGithub: () => Promise,
  resetpassword: () => Promise,
  changepassword: () => Promise,
  uploadphoto: () => Promise,
  logout: () => Promise,
  savequiz: () => Promise
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
      <Box></Box>
    );
  }

  const providers = {
    google: new GoogleAuthProvider(auth),
    facebook: new FacebookAuthProvider(auth),
    github: new GithubAuthProvider(auth),
  };

  async function registeremail(email, password, username, picture) {
    const pictureref = ref_storage(storage, `profile/${picture.name + v4()}`);
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
        }).then(() => {
          const userid = auth.currentUser;
          push(ref_database(database, "users/" + userid.uid), {
            username: username,
            profile_picture: photoURL,
          });
        });

        addToast("Register success!!", {
          appearance: "success",
          autoDismiss: true,
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
    return await signInWithEmailAndPassword(auth, email, password)
      .then(() => {
        addToast("Login success!!", {
          appearance: "success",
          autoDismiss: true,
        });
      })
      .catch((error) => {
        addToast(error.message, {
          appearance: "error",
          autoDismiss: true,
        });
      });
  }

  async function logout() {
    return await signOut(auth).then(() => {
      addToast("Logout!!", {
        appearance: "warning",
        autoDismiss: true,
      });
    });
  }

  async function signInWithGoogle() {
    const provider = new GoogleAuthProvider();
    await signInWithPopup(auth, provider);
  }
  async function signInWithFacebook() {
    const provider = new FacebookAuthProvider();
    await signInWithPopup(auth, provider);
  }
  async function signInWithGithub() {
    const provider = new GithubAuthProvider();
    await signInWithPopup(auth, provider).catch((error) => {
      if (
        error.message ===
        "Firebase: Error (auth/account-exists-with-different-credential)."
      ) {
        addToast("Your email has been register!!", {
          appearance: "error",
          autoDismiss: true,
        });
      }
    });
  }
  async function savequiz(quizdata, questiondata) {
    const userid = auth.currentUser;
    push(ref_database(database, "Quiz/" + userid.uid), {
      name: quizdata.name,
      createby: userid.displayName,
      uid: userid.uid,
      question: questiondata,
      category: quizdata.category,
      releasedate: quizdata.releasedate,

    });
    window.localStorage.removeItem("Question")
  }
  const value = {
    currentUser,
    registeremail,
    loginemail,
    signInWithGoogle,
    signInWithFacebook,
    signInWithGithub,
    resetpassword,
    changepassword,
    logout,
    savequiz
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
