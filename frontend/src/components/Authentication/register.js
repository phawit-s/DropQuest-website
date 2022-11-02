import React, { useState } from "react";
import { useHistory, Redirect } from "react-router-dom";
import { Box, Text, Card, Flex, Button, Image } from "rebass";
import { useToasts } from "react-toast-notifications";
import { Label, Input } from "@rebass/forms";
import { useAuth } from "../../contexts/AuthContext";

export default function Register() {
  const history = useHistory();
  const [picture, setPicture] = useState(null);
  const [photo, setPhoto] = useState(null);
  const [isselected, setIsselected] = useState(false);
  const [name, setName] = useState("");
  const [surname, setSurname] = useState("");
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmpassword, setComfirmpassword] = useState("");
  const [currentUser, setCurrentUser] = useState(null);
  const { registeremail, uploadphoto } = useAuth();
  const { addToast } = useToasts();

  const onImageChange = (event) => {
    if (event.target.files && event.target.files[0]) {
      setIsselected(true);
      let img = event.target.files[0];
      setPicture(URL.createObjectURL(img));
      setPhoto(img);
    }
  };
  const goback = () => {
    history.push({
      pathname: `/login`,
    });
  };
  const register = () => {
    if (!picture || !photo) {
      addToast("Please insert image", {
        appearance: "warning",
        autoDismiss: true,
      });
    }
    if (password !== confirmpassword) {
      addToast("รหัสผ่านไม่ตรงกัน", {
        appearance: "error",
        autoDismiss: true,
      });
    }
    if (email === "" || password === "") {
      addToast("Please fill all the box", {
        appearance: "warning",
        autoDismiss: true,
      });
    } else {
      const registersucess = registeremail(email, password, username, photo);
      try {
        if (registersucess) {
          history.push({
            pathname: `/login`,
          });
        }
      } catch (err) {
        alert(err);
      }
    }
  };

  return (
    <Box>
      <Box m={5} ml="auto" mr="auto" width={[4 / 5, 4 / 5, 2 / 5]}>
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
                    // border: "3px solid rgba(255, 0, 0, 0.13);",
                    overflow: "hidden",
                    cursor: "pointer",
                  }}
                  htmlFor="upload-button"
                >
                  <Image
                    src={picture}
                    sx={{
                      height: "200px",
                      width: "200px",
                      objectFit: "cover",
                      borderRadius: "50%",
                    }}
                  />
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
                    เลือกรูปภาพ
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

            {/* <Flex>
              <Box width={1} pr={1} mb={2}>
                <Label mb={2} mt={3} htmlFor="name">
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
                <Label mb={2} mt={3} htmlFor="surname">
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
            </Flex> */}

            <Label mb={2} mt={2} htmlFor="username">
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

            <Label mb={2} mt={3} htmlFor="email">
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

            <Label mb={2} mt={3} htmlFor="password">
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
              type="password"
              onChange={(event) => {
                setPassword(event.target.value);
              }}
              placeholder="ใส่รหัสผ่าน"
            />

            <Label mb={2} mt={3} htmlFor="confirmpassword">
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
              type="password"
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
              justifyContent: "center",
            }}
            width={3 / 4}
            fontSize={2}
            backgroundColor="rgba(255, 0, 0, 0.24);"
            type="button"
            onClick={register}
          >
            <Text
              sx={{
                color: " #fff",
                fontSize: "20px",
              }}
            >
              ลงทะเบียน
            </Text>
          </Button>
          <Flex mt={3} mr={60} sx={{ justifyContent: "center" }}>
            <Text>มีสมาชิกอยู่แล้ว?</Text>
            <Text
              ml={2}
              sx={{
                color: "rgba(255, 0, 0, 0.24);",
                textAlign: "center",
                cursor: "pointer",
                textDecoration: "underline",
              }}
              onClick={goback}
            >
              เข้าสู่ระบบ
            </Text>
          </Flex>
        </Card>
      </Box>
    </Box>
  );
}
