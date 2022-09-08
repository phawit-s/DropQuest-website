import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useLocation, useHistory, Redirect } from "react-router-dom";
import { motion, useTransform } from "framer-motion";
import { Box, Heading, Text, Card, Flex, Link, Button, Image } from "rebass";
import { Label, Input, Select, Textarea, Radio, Checkbox } from "@rebass/forms";
import { updateProfile } from "firebase/auth";
import _ from "lodash";
import { useAuth } from "../contexts/AuthContext";

export default function Register() {
  const history = useHistory();
  const [picture, setPicture] = useState("");
  const [isselected, setIsselected] = useState(false);
  const [name, setName] = useState("");
  const [surname, setSurname] = useState("");
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmpassword, setComfirmpassword] = useState("");
  const [currentUser, setCurrentUser] = useState(null);
  const { registeremail } = useAuth();

  const onImageChange = (event) => {
    if (event.target.files && event.target.files[0]) {
      setIsselected(true);
      let img = event.target.files[0];
      setPicture(URL.createObjectURL(img));
    }
  };

  const register = () => {
    if (email === "" || password === "") {
      alert("please input");
    } else {
      try {
        registeremail(email, password, username);
        setCurrentUser(true)
      } catch (err) {
        console.log(err.message);
      }
    }
  };
  if (currentUser) {
    return <Redirect to="/login" />;
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
            {isselected ? (
              <Image
                ml="auto"
                mr="auto"
                mb={5}
                src={picture}
                sx={{
                  display: "block",
                  width: "200px",
                  height: "200px",
                  border: "3px solid rgba(255, 0, 0, 0.13);",
                  objectFit: "cover",
                  borderRadius: "50%",
                }}
              />
            ) : (
              <Box>
                <Label
                  ml="auto"
                  mr="auto"
                  sx={{
                    height: "200px",
                    width: "200px",
                    borderRadius: " 100px",
                    position: "relative",
                    display: "flex",
                    border: "3px solid rgba(255, 0, 0, 0.13);",
                    overflow: "hidden",
                    cursor: "pointer",
                  }}
                  htmlFor="upload-button"
                >
                  <Text m="auto" sx={{ color: " #000", fontSize: "20px" }}>
                    Pick an Image
                  </Text>
                </Label>
                <Input
                  id="upload-button"
                  type="file"
                  sx={{
                    outline: "none",
                    opacity: "0",
                  }}
                  name="myImage"
                  accept="image/*"
                  onChange={onImageChange}
                />
              </Box>
            )}

            <Flex>
              <Box width={1} pr={1} mb={2}>
                <Label mb={2} mt={1} htmlFor="name">
                  ชื่อจริง
                </Label>
                <Input
                  sx={{
                    borderTop: "hidden",
                    borderLeft: "hidden",
                    borderRight: "hidden",
                  }}
                  id="name"
                  name="name"
                  onChange={(event) => {
                    setName(event.target.value);
                  }}
                  placeholder="ใส่ชื่อจริง"
                />
              </Box>
              <Box width={1} pl={1} mb={2}>
                <Label mb={2} mt={1} htmlFor="surname">
                  นามสกุล
                </Label>
                <Input
                  sx={{
                    borderTop: "hidden",
                    borderLeft: "hidden",
                    borderRight: "hidden",
                  }}
                  id="surname"
                  name="surname"
                  onChange={(event) => {
                    setSurname(event.target.value);
                  }}
                  placeholder="ใส่นามสกุล"
                />
              </Box>
            </Flex>

            <Label mb={2} mt={1} htmlFor="username">
              ชื่อผู้ใช้
            </Label>
            <Input
              sx={{
                borderTop: "hidden",
                borderLeft: "hidden",
                borderRight: "hidden",
              }}
              id="username"
              name="username"
              onChange={(event) => {
                setUsername(event.target.value);
              }}
              placeholder="ใส่ชื่อผู้ใช้"
            />

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
              required
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

            <Label mb={2} mt={1} htmlFor="confirmpassword">
              ยืนยันรหัสผ่าน
            </Label>
            <Input
              sx={{
                borderTop: "hidden",
                borderLeft: "hidden",
                borderRight: "hidden",
              }}
              id="confirmpassword"
              name="confirmpassword"
              onChange={(event) => {
                setComfirmpassword(event.target.value);
              }}
              placeholder="ยืนยันรหัสผ่าน"
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
            onClick={register}
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
}
