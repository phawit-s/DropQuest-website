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
  const { currentUser, logout } = useAuth();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isDesktop, setIsDesktop] = useState(window.innerWidth > 768);

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
  const goback = () => {
    history.push({
      pathname: `/login`,
    });
  };
  return (
    <Box
      minHeight="100vh"
      sx={{
        backgroundColor: "rgba(134, 248, 255, 0.13);",
      }}
    >
      {isDesktop ? <Header /> : <Mobileheader />}
      <Flex mt={4} sx={{ justifyContent: "center" }}>
        <Box width={3 / 4}>
          <Card
            width={1}
            py={4}
            sx={{
              borderRadius: "10px",
              fontWeight: "500",
              fontSize: "20px",
              boxShadow: "0px 2px 20px 2px #23aaff;",
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
                <Text pl={4}>ชื่อผู้ใช้ : {currentUser.displayName}</Text>
                <Text pl={4} pt={4}>
                  อีเมล : {currentUser.email}
                </Text>
                <Text pl={4} pt={4}>
                  รหัสผ่าน :{" "}
                </Text>
              </Box>

              <Image
                mr={4}
                src={imageUrl}
                referrerPolicy="no-referrer"
                sx={{
                  borderRadius: "50%",
                  width: "130px",
                  height: "130px",
                  objectFit: "cover",
                  alignItems: "center"
                }}
              />
            </Flex>
          </Card>
        </Box>
      </Flex>
      <Flex mt={4} sx={{ justifyContent: "center" }}>
        <Button
          sx={{
            cursor: "pointer",
            border: "3px solid #23aaff",
            borderRadius: "10px",
            backgroundColor: "#fff",
          }}
        >
          <Text sx={{ color: "black" }}> แก้ไขโปรไฟล์</Text>
        </Button>
      </Flex>
    </Box>
  );
};

export default Profile;
