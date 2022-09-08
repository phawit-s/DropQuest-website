import React, { useContext, useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useLocation, useHistory, Redirect } from "react-router-dom";
import { motion, useTransform } from "framer-motion";
import { Box, Heading, Text, Card, Flex, Link, Button, Image } from "rebass";
import { Label, Input, Select, Textarea, Radio, Checkbox } from "@rebass/forms";
import { FaGoogle } from "react-icons/fa";
import _ from "lodash";
import { useAuth } from "../contexts/AuthContext";

const Login = () => {
  const history = useHistory();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { loginemail, signInWithGoogle, signInWithFacebook } = useAuth();
  const loginsubmit = async () => {
    try {
      const user = loginemail(email, password);
      if (user) {
        history.push({
          pathname: `/`,
        });
      }
    } catch (err) {
      console.log(err.message);
    }
  };

  const goback = () => {
    history.push({
      pathname: `/register`,
    });
  };

  const { currentUser } = useAuth();
  if (currentUser) {
    return <Redirect to="/" />;
  }

  return (
    <Box>
      <Box m={6} ml="auto" mr="auto" width={[4 / 5, 4 / 5, 2 / 5]}>
        <Card
          width={1}
          py={4}
          sx={{
            borderRadius: "16px",
            boxShadow: "0px 2px 20px 2px rgba(255, 0, 0, 0.25);",
          }}
          bg="#fff"
        >
          <Box m={3} mx={56}>
            <Text sx={{ textAlign: "center" }}>เข้าสู่ระบบ</Text>
            <Label mb={2} mt={1} htmlFor="email">
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

            <Label mb={2} mt={1} htmlFor="password">
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
            <Text mt={3} sx={{ textAlign: "right" }}>
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
              textAlign: "center",
            }}
            width={3 / 4}
            fontSize={2}
            backgroundColor="rgba(255, 0, 0, 0.24);"
            type="button"
            onClick={loginsubmit}
          >
            <Text
              sx={{
                display: "flex",
                color: " #fff",
                fontSize: "20px",
                textAlign: "center",
              }}
            >
              เข้าสู่ระบบ
            </Text>
          </Button>
          <Flex
            mr={60}
            mt={2}
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
              onClick={goback}
            >
              ลงทะเบียน
            </Text>
          </Flex>

          <Text mt="50px" sx={{ textAlign: "center" }}>
            เข้าสู่ระบบด้วย
          </Text>
          <Button
            variant="outline"
            isFullWidth
            colorScheme="red"
            leftIcon={<FaGoogle />}
            onClick={() =>
              signInWithGoogle()
                .then((user) => {
                  return <Redirect to="/" />;
                })
                .catch((e) => console.log(e.message))
            }
          >
            Sign in with Google
          </Button>

          <Button
            variant="outline"
            isFullWidth
            colorScheme="red"
            leftIcon={<FaGoogle />}
            onClick={() =>
              signInWithFacebook()
                .then((user) => {
                  return <Redirect to="/" />;
                })
                .catch((e) => console.log(e.message))
            }
          >
            Sign in with Facebook
          </Button>

        </Card>
      </Box>
    </Box>
  );
};

export default Login;
