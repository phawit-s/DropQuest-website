import React, { useEffect, useState, useRef } from "react";
import { useHistory, Redirect } from "react-router-dom";
import { Box, Text, Card, Flex, Button, Image } from "rebass";
import { Label, Input } from "@rebass/forms";
import { FaGoogle, FaFacebookF, FaGithub } from "react-icons/fa";
import { useAuth } from "../../contexts/AuthContext";

const Login = () => {
  const history = useHistory();
  const emailref = useRef();
  const passwordref = useRef();
  const [isLogin, setIsLogin] = useState(false);
  const { loginemail } = useAuth();

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
    <Box
    sx={{backgroundColor: "red"}}
      
    >
      <Card
        width={["100%", 2 / 4, 1 / 4]}
        py={4}
        sx={{
          position: "absolute" /* or absolute */,
        top: "50%",
        left: "50%",
        /* bring your own prefixes */
        transform: "translate(-50%, -50%)",
          borderRadius: "10px",
          fontWeight: "500",
          fontSize: "20px",
          backgroundColor: "rgba(255,255,255,0.50)",
          // backdropFilter: "blur(15px)",
          border: "1px solid #ced4da",
          borderBottom: "1px solid rgba(255,255,255,0.50)",
          borderRight: "1px solid rgba(255,255,255,0.50)",
          // boxShadow: "0 25px 50px rgba(0,0,0,0.1)",
          // gap: "30px",
          boxShadow: "0px 1px 10px 2px #23aaff;",
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
              color: "rgba(255, 0, 0, 0.67);",
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
          <Button
            mr={4}
            width="50px"
            height="50px"
            bg="#F44336"
            sx={{
              borderRadius: "50%",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
            }}
            // onClick={() =>
            //   signInWithGoogle()
            //     .then((user) => {
            //       setIsLogin(true);
            //     })
            //     .catch((e) => console.log(e.message))
            // }
          >
            <FaGoogle size={36} />
          </Button>

          <Button
            width="50px"
            height="50px"
            mr={4}
            bg="#000"
            sx={{
              borderRadius: "50%",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
            }}
            // onClick={() =>
            //   signInWithGithub()
            //     .then((user) => {
            //       setIsLogin(true);
            //     })
            //     .catch((e) => console.log(e.message))
            // }
          >
            <FaGithub size={36} />
          </Button>

          <Button
            width="50px"
            height="50px"
            bg="#1877F2"
            sx={{
              borderRadius: "50%",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
            }}
            // onClick={() =>
            //   signInWithFacebook()
            //     .then((user) => {
            //       setIsLogin(true);
            //     })
            //     .catch((e) => console.log(e.message))
            // }
          >
            <FaFacebookF size={36} />
          </Button>
        </Flex>
      </Card>
    </Box>
  );
};

export default Login;
