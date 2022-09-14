import React, { useEffect, useState } from "react";
import { useHistory, Redirect } from "react-router-dom";
import { Box, Text, Card, Flex, Button, Image } from "rebass";
import { Label, Input } from "@rebass/forms";
import { FaGoogle, FaFacebookF } from "react-icons/fa";
import { useToasts } from "react-toast-notifications";
import { useAuth } from "../contexts/AuthContext";

const Login = () => {
  const history = useHistory();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLogin, setIsLogin] = useState(false);
  const { loginemail, signInWithGoogle, signInWithFacebook } = useAuth();
  const { addToast } = useToasts();


  const loginsubmit = async () => {
    loginemail(email, password).then(()=>{
      setIsLogin(true)
    })

  };

  const gotoregister = () => {
    history.push({
      pathname: `/register`,
    });
  };

  const forget = () => {
    history.push({
      pathname: `/forgotpassword`,
    });
  };

  const { currentUser } = useAuth();
  if (currentUser && isLogin) {
    return <Redirect to="/" />;
  }

  return (
    <Box>
      <Box m={6} ml="auto" mr="auto" width={[4 / 5, 4 / 5, 2 / 5]}>
        <Card
          width={1}
          py={4}
          sx={{
            borderRadius: "10px",
            fontWeight: "500",
            fontSize: "20px",
            boxShadow: "0px 2px 20px 2px rgba(255, 0, 0, 0.25);",
          }}
          bg="#fff"
        >
          <Box m={3} mx={56}>
            <Text sx={{ textAlign: "center", fontSize: "50px" }}>
              เข้าสู่ระบบ
            </Text>
            <Label mb={2} mt={4} htmlFor="email">
              อีเมล
            </Label>
            <Input
              sx={{
                borderTop: "hidden",
                borderLeft: "hidden",
                borderRight: "hidden",
              }}
              id="email"
              name="email"
              onChange={(event) => {
                setEmail(event.target.value);
              }}
              placeholder="ใส่ชื่ออีเมล"
            />

            <Label mb={2} mt={4} htmlFor="password">
              รหัสผ่าน
            </Label>
            <Input
              sx={{
                borderTop: "hidden",
                borderLeft: "hidden",
                borderRight: "hidden",
              }}
              id="password"
              name="password"
              onChange={(event) => {
                setPassword(event.target.value);
              }}
              placeholder="ใส่รหัสผ่าน"
            />
            <Text mt={3} sx={{ textAlign: "right", cursor: "pointer" }} onClick={forget}>
              ลืมรหัสผ่าน
            </Text>
          </Box>

          <Button
            mx="auto"
            mt={4}
            p={14}
            sx={{
              display: "flex",
              cursor: "pointer",
              justifyContent: "center",
            }}
            width={3 / 4}
            fontSize={2}
            backgroundColor="rgba(255, 0, 0, 0.24);"
            type="button"
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
            sx={{ justifyContent: "right", display: "flex" }}
          >
            <Text>หากยังไม่มีบัญชี </Text>

            <Text
              ml={1}
              sx={{
                color: "rgba(255, 0, 0, 0.67);",
                textDecoration: "underline",
                cursor: "pointer",
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
              onClick={() =>
                signInWithGoogle()
                  .then((user) => {
                    return <Redirect to="/" />;
                  })
                  .catch((e) => console.log(e.message))
              }
            >
              <FaGoogle size={36} />
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
              onClick={() =>
                signInWithFacebook()
                  .then((user) => {
                    return <Redirect to="/" />;
                  })
                  .catch((e) => console.log(e.message))
              }
            >
              <FaFacebookF size={36} />
            </Button>
          </Flex>
        </Card>
      </Box>
    </Box>
  );
};

export default Login;
