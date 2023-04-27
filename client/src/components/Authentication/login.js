import React, { useEffect, useState, useRef } from "react";
import { useHistory, Redirect } from "react-router-dom";
import { Box, Text, Card, Flex, Button } from "rebass";
import { Label, Input } from "@rebass/forms";
import { useAuth } from "../../contexts/AuthContext";
import { GoogleLogin } from "react-google-login";
import { gapi } from "gapi-script";

const Login = () => {
  const history = useHistory();
  const emailref = useRef();
  const passwordref = useRef();
  const [isLogin, setIsLogin] = useState(false);
  const [profile, setProfile] = useState("");
  const { loginemail, googlelogin } = useAuth();
  const clientid =
    "104253971362-maefhqpjrko1rdmbcrjeng9r605j3qor.apps.googleusercontent.com";

  useEffect(() => {
    gapi.load("auth2", () => {
      // Initialize the auth2 library with your client ID
      gapi.auth2.init({ client_id: clientid }).then(() => {
        // Get the auth2 instance
        const auth2 = gapi.auth2.getAuthInstance();
        const check = auth2.isSignedIn.get();
        // Sign out the user
        if (check) {
          
          setProfile(null);
          auth2.signOut().then(() => {
            console.log("User signed out.");
          });
        }
      });
    });
  }, []);

  useEffect(() => {
    if (profile) {
      googlelogin(
        profile.email,
        profile.givenName,
        profile.imageUrl,
        profile.googleId
      ).then(() => {
        setIsLogin(true);
      });
    }
  }, [profile]);

  const onSuccess = (res) => {
    setProfile(res.profileObj);
    console.log("success", res);
  };
  const onError = (res) => {
    console.log("error", res);
  };
  const loginsubmit = async () => {
    loginemail(emailref.current.value, passwordref.current.value).then(() => {
      setIsLogin(true);
    });
  };

  const gotoregister = () => {
    history.push({
      pathname: `/register`,
    });
  };

  const forget = () => {
    history.push({
      pathname: `/resetpassword`,
    });
  };

  const { currentUser } = useAuth();
  if (currentUser && isLogin) {
    return <Redirect to="/" />;
  }

  return (
    <Box sx={{ backgroundColor: "red" }}>
      <Card
        width={["80%", 2 / 4, 1 / 4]}
        py={4}
        sx={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          borderRadius: "10px",
          fontWeight: "500",
          fontSize: "20px",
          backgroundColor: "rgba(255,255,255,0.50)",
          border: "1px solid #ced4da",
          boxShadow: "0px 3px 10px 2px rgb(240, 242, 245);",
        }}
      >
        <Box m={3} mx={56}>
          <Text sx={{ textAlign: "center", fontSize: "50px" }}>
            เข้าสู่ระบบ
          </Text>
          <Label mb={2} mt={4} htmlFor="email">
            อีเมล
          </Label>
          <Input
            my={4}
            sx={{
              border: "none",
              borderBottom: "2px solid #333",
              padding: "5px",
              fontSize: "18px",
              color: "#333",
              ":focus": {
                outline: "none",
                borderBottom: "2px solid #23aaff",
              },
            }}
            id="email"
            name="email"
            ref={emailref}
            placeholder="ใส่ชื่ออีเมล"
          />

          <Label mb={2} mt={4} htmlFor="password">
            รหัสผ่าน
          </Label>
          <Input
            my={4}
            sx={{
              border: "none",
              borderBottom: "2px solid #333",
              padding: "5px",
              fontSize: "18px",
              color: "#333",
              ":focus": {
                outline: "none",
                borderBottom: "2px solid #23aaff",
              },
            }}
            id="password"
            name="password"
            type="password"
            ref={passwordref}
            placeholder="ใส่รหัสผ่าน"
          />
          <Text
            mt={3}
            sx={{
              textAlign: "right",
              cursor: "pointer",
              ":hover": {
                color: "#1e95d4",
              },
            }}
            onClick={forget}
          >
            ลืมรหัสผ่าน
          </Text>
        </Box>

        <Button
          mx="auto"
          my={2}
          width={4 / 5}
          sx={{
            backgroundColor: "#23aaff",
            color: "#fff",
            padding: "10px 20px",
            display: "flex",
            justifyContent: "center",
            fontSize: "18px",
            borderRadius: "5px",
            cursor: "pointer",
            ":hover": {
              backgroundColor: "#1e95d4",
            },
          }}
          onClick={loginsubmit}
        >
          <Text
            sx={{
              color: " #fff",
              fontSize: "20px",
            }}
          >
            เข้าสู่ระบบ
          </Text>
        </Button>
        <Flex
          mr={60}
          mt={3}
          sx={{ justifyContent: "flex-end", display: "flex" }}
        >
          <Text>หากยังไม่มีบัญชี </Text>
          <Text
            ml={1}
            sx={{
              color: "#1e95d4;",
              textDecoration: "underline",
              cursor: "pointer",
              ":hover": {
                color: "red",
              },
            }}
            onClick={gotoregister}
          >
            ลงทะเบียน
          </Text>
        </Flex>

        <Text mt="50px" sx={{ textAlign: "center" }}>
          เข้าสู่ระบบด้วย
        </Text>

        <Flex justifyContent="center" mt={4}>
          <GoogleLogin
            clientId={clientid}
            buttonText="Sign in with Google"
            onSuccess={onSuccess}
            onFailure={onError}
            cookiePolicy={"single_host_origin"}
            isSignedIn={true}
          />
        </Flex>
      </Card>
    </Box>
  );
};

export default Login;
