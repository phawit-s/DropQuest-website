import React, { useState, useEffect } from "react";
import { useHistory, Redirect } from "react-router-dom";
import { Box, Text, Card, Flex, Button, Image } from "rebass";
import Header from "../Header";
import Mobileheader from "../Mobileheader";
import { useToasts } from "react-toast-notifications";
import { Label, Input } from "@rebass/forms";
import { useAuth } from "../../contexts/AuthContext";

const Profile = () => {
  const history = useHistory();
  const { currentUser, editprofile } = useAuth();
  const [picture, setPicture] = useState(null);
  const [username, setUsername] = useState(currentUser.username);
  const [photo, setPhoto] = useState(null);
  const [checkImageerror, setCheckimageerror] = useState(false);
  const [isselected, setIsselected] = useState(false);
  const [profile, setEditprofile] = useState(false);
  const [isDesktop, setIsDesktop] = useState(window.innerWidth > 768);
  const { addToast } = useToasts();

  useEffect(() => {
    const handleResize = () => {
      setIsDesktop(window.innerWidth >= 768);
    };
    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  if (!currentUser) {
    return <Redirect to="/login" />;
  }

  const base64Image = new Buffer(currentUser.image, "binary").toString(
    "base64"
  );
  const imageUrl = `data:image/jpeg;base64,${base64Image}`;
  const onImageChange = (event) => {
    if (event.target.files && event.target.files[0]) {
      setIsselected(true);
      let img = event.target.files[0];
      setPicture(URL.createObjectURL(img));
      setPhoto(img);
    }
  };

  const register = () => {
    let checkelse = false;
    if (!picture || !photo) {
      setCheckimageerror(true);
      checkelse = true;
      addToast("กรุณาเพิ่มรูปภาพ", {
        appearance: "error",
        autoDismiss: true,
      });
    } else if (!checkelse) {
      const editsuccess = editprofile(username, photo);
      try {
        if (editsuccess) {
          history.push({
            pathname: `/`,
          });
        }
      } catch (err) {
        alert(err);
      }
    }
  };

  return (
    <Box
      minHeight="100vh"
      sx={{
        backgroundColor: "rgb(240, 242, 245);",
      }}
    >
      {isDesktop ? <Header /> : <Mobileheader />}
      <Flex mt={4} sx={{ justifyContent: "center" }}>
        <Flex width={3 / 4} justifyContent="center">
          <Card
            width={[1, 1 / 2]}
            py={4}
            pr={4}
            sx={{
              borderRadius: "10px",
              fontWeight: "500",
              fontSize: "20px",
              boxShadow: "0px 2px 20px 2px #23aaff;",
              justifyContent: "center",
            }}
            bg="#fff"
          >
            <Flex
              sx={{
                justifyContent: "space-between",
              }}
              flexDirection={["column", "row"]}
            >
              <Box>
                <Flex pl={4}>
                  <Text>ชื่อผู้ใช้ : </Text>
                  {profile ? (
                    <Input
                      sx={{
                        border: "none",
                        padding: "5px",
                        fontSize: "18px",
                        color: "#333",
                        borderBottom: "2px solid #333",
                        ":focus": {
                          outline: "none",
                          borderBottom: "2px solid #23aaff",
                        },
                      }}
                      id="username"
                      name="username"
                      onChange={(event) => {
                        setUsername(event.target.value);
                      }}
                      defaultValue={currentUser.username}
                    />
                  ) : (
                    <Text pl={2}>{currentUser.username}</Text>
                  )}
                </Flex>
                <Text pl={4} pt={4} mb={4} mr={3}>
                  อีเมล : {currentUser.email}
                </Text>
              </Box>

              {profile ? (
                isselected ? (
                  <Box>
                    <Label
                      ml="auto"
                      sx={{
                        height: "150px",
                        width: "150px",
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
                          height: "150px",
                          width: "150px",
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
                      // mr="auto"
                      sx={{
                        height: "150px",
                        width: "150px",
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
                )
              ) : (
                <Image
                  mr={[0, 4]}
                  mx={[4, 0]}
                  src={imageUrl}
                  referrerPolicy="no-referrer"
                  sx={{
                    borderRadius: "50%",
                    width: "160px",
                    height: "160px",
                    objectFit: "cover",
                    alignItems: "right",
                  }}
                />
              )}
            </Flex>
          </Card>
        </Flex>
      </Flex>
      <Flex mt={4} sx={{ justifyContent: "center" }}>
        {profile ? (
          <>
            <Button
              sx={{
                cursor: "pointer",
                border: "3px solid red",
                borderRadius: "10px",
                backgroundColor: "red",
                mx: 4,
              }}
            >
              <Text
                sx={{ color: "black" }}
                onClick={() => setEditprofile(false)}
              >
                {" "}
                ยกเลิก
              </Text>
            </Button>
            <Button
              sx={{
                cursor: "pointer",
                border: "3px solid green",
                borderRadius: "10px",
                backgroundColor: "green",
              }}
            >
              <Text sx={{ color: "black" }} onClick={register}>
                {" "}
                บันทึก
              </Text>
            </Button>
          </>
        ) : (
          <Button
            sx={{
              cursor: "pointer",
              border: "3px solid #23aaff",
              borderRadius: "10px",
              backgroundColor: "#fff",
            }}
          >
            <Text sx={{ color: "black" }} onClick={() => setEditprofile(true)}>
              {" "}
              แก้ไขโปรไฟล์
            </Text>
          </Button>
        )}
      </Flex>
    </Box>
  );
};

export default Profile;
