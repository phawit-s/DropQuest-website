import React, { useEffect, useState } from "react";
import { useHistory } from "react-router-dom";
import { Box, Text, Card, Flex, Button, Image } from "rebass";
import { useToasts } from "react-toast-notifications";
import { Label, Input } from "@rebass/forms";
import { useAuth } from "../../contexts/AuthContext";
import api from "../../api";
import validator from "validator";

export default function Register() {
  const history = useHistory();
  const [picture, setPicture] = useState(null);
  const [photo, setPhoto] = useState(null);
  const [isselected, setIsselected] = useState(false);
  const [username, setUsername] = useState("");
  const [alluser, setAlluser] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmpassword, setComfirmpassword] = useState("");
  const { addToast } = useToasts();
  const { registeremail } = useAuth();
  const [checkImageerror, setCheckimageerror] = useState(false);
  const [checkUsernameerror, setCheckusernameerror] = useState(false);
  const [checkEmailerror, setCheckemailerror] = useState(false);
  const [checkPassworderror, setCheckpassworderror] = useState("");
  const [checkConfirmerror, setCheckconfirmerror] = useState("");

  useEffect(() => {
    api
      .get("/users")
      .then((response) => {
        setAlluser(response.data);
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);
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
    setCheckpassworderror("");
    let checkelse = false;
    if (username) {
      alluser.map((user) => {
        if (user.username === username) {
          checkelse = true;
          setCheckusernameerror(true);
          addToast("ชื่อผู้ใช้ซ้ำ", {
            appearance: "error",
            autoDismiss: true,
          });
        }
        if (user.email === email) {
          setCheckemailerror(true);
          addToast("อีเมลซ้ำ", {
            appearance: "error",
            autoDismiss: true,
          });
        }
      });
    }
    if (!picture || !photo) {
      setCheckimageerror(true);
      checkelse = true;
      addToast("กรุณาเพิ่มรูปภาพ", {
        appearance: "error",
        autoDismiss: true,
      });
    }
    if (username === "") {
      setCheckusernameerror(true);
      checkelse = true;
      addToast("กรุณากรอกชื่อผู้ใช้", {
        appearance: "error",
        autoDismiss: true,
      });
    }
    if (email === "" || validator.isEmail(email, []) !== true) {
      setCheckemailerror(true);
      checkelse = true;
      addToast("กรุณากรอกอีเมลให้ถูกต้อง", {
        appearance: "error",
        autoDismiss: true,
      });
    }
    if (password === "") {
      checkelse = true;
      addToast("กรุณากรอกรหัสผ่าน", {
        appearance: "error",
        autoDismiss: true,
      });
    }
    if (password !== confirmpassword) {
      checkelse = true;
      setCheckconfirmerror(true);
      setCheckpassworderror(true);
      addToast("รหัสผ่านไม่ตรงกัน", {
        appearance: "error",
        autoDismiss: true,
      });
    }
    if (password.length < 8) {
      setCheckpassworderror(true);
      addToast("กรุณากรอกมากกว่า 8 ตัวอักษร", {
        appearance: "error",
        autoDismiss: true,
      });
    } else if (!checkelse) {
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
      <Box m={5} ml="auto" mr="auto" width={[4 / 5, 4 / 5, 1 / 4]}>
        <Card
          width={1}
          py={4}
          sx={{
            borderRadius: "16px",
            backgroundColor: "rgba(255,255,255,0.50)",
            border: "1px solid #ced4da",
            boxShadow: "0px 3px 10px 2px rgb(240, 242, 245);",
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
                    border: checkImageerror
                      ? "3px solid #9e1922"
                      : "3px solid #23aaff;",
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
                  onClick={() => {
                    setCheckimageerror(false);
                  }}
                  onChange={onImageChange}
                />
              </Box>
            )}

            <Label mb={2} mt={2} htmlFor="username">
              ชื่อผู้ใช้
            </Label>
            <Input
              sx={{
                border: "none",
                borderBottom: checkUsernameerror
                  ? "2px solid #9e1922"
                  : "2px solid #333",
                padding: "5px",
                fontSize: "18px",
                color: "#333",
                ":focus": {
                  outline: "none",
                  borderBottom: "2px solid #23aaff",
                },
              }}
              id="username"
              name="username"
              onClick={() => {
                setCheckusernameerror(false);
              }}
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
                border: "none",
                borderBottom: checkEmailerror
                  ? "2px solid #9e1922"
                  : "2px solid #333",
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
              onClick={() => {
                setCheckemailerror(false);
              }}
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
                border: "none",
                borderBottom: checkPassworderror
                  ? "2px solid #9e1922"
                  : "2px solid #333",
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
              onClick={() => {
                setCheckpassworderror(false);
              }}
              onChange={(event) => {
                setPassword(event.target.value);
              }}
              placeholder="กรอกรหัสผ่านอย่างน้อย 8 หลัก"
            />

            <Label mb={2} mt={3} htmlFor="confirmpassword">
              ยืนยันรหัสผ่าน
            </Label>
            <Input
              sx={{
                border: "none",
                borderBottom: checkConfirmerror
                  ? "2px solid #9e1922"
                  : "2px solid #333",
                padding: "5px",
                fontSize: "18px",
                color: "#333",
                ":focus": {
                  outline: "none",
                  borderBottom: "2px solid #23aaff",
                },
              }}
              id="confirmpassword"
              name="confirmpassword"
              type="password"
              onClick={() => {
                setCheckconfirmerror(false);
              }}
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
            backgroundColor="#23aaff;"
            type="button"
            onClick={register}
            onKeyDown={(event) => {
              if (event.keyCode === 13) {
                register();
              }
            }}
          >
            <Text
              sx={{
                color: " #fff",
                fontSize: "20px",
                cursor: "pointer",
              }}
            >
              ลงทะเบียน
            </Text>
          </Button>
          <Flex mt={3} mr={60} sx={{ justifyContent: "right" }}>
            <Text>มีสมาชิกอยู่แล้ว?</Text>
            <Text
              ml={2}
              sx={{
                color: "#23aaff;",
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
