import React, { useContext, useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useLocation, useHistory, Redirect } from "react-router-dom";
import { motion, useTransform } from "framer-motion";
import { Box, Heading, Text, Card, Flex, Link, Button, Image } from "rebass";
import { Label, Input, Select, Textarea, Radio, Checkbox } from "@rebass/forms";
import {
  createUserWithEmailAndPassword,
  onAuthStateChanged,
  signInWithEmailAndPassword,
} from "firebase/auth";
import { auth } from "../api/config";
import _ from "lodash";
import { AuthContext } from "../api/Auth";

const Login = () => {
  const history = useHistory();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const loginsubmit = async () => {
    try {
      const user = await signInWithEmailAndPassword(auth, email, password);
      if (user) {
        history.push({
          pathname: `/`,
        });
      }
    } catch (err) {
      console.log(err.message);
    }
  };

  const { currentUser } = useContext(AuthContext);
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
          <Box m={3} mx={36}>
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
          </Box>

          <Button
            mx="auto"
            mt={4}
            p={14}
            sx={{
              display: "flex",
            }}
            width={3 / 4}
            fontSize={2}
            backgroundColor="rgba(255, 0, 0, 0.24);"
            type="button"
            onClick={loginsubmit}
          >
            <Text
              sx={{ display: "flex", color: " #fff", fontSize: "20px" }}
            ></Text>
            ล็อคอิน
          </Button>
        </Card>
      </Box>
    </Box>
  );
};

export default Login;
