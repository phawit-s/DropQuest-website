import React, { useState } from "react";
import { useHistory, Redirect } from "react-router-dom";
import { Box, Text, Card, Flex, Button, Image } from "rebass";
import Header from "../Header";
import { useToasts } from "react-toast-notifications";
import { Label, Input } from "@rebass/forms";
import { useAuth } from "../../contexts/AuthContext";

const Profile = () => {
  const history = useHistory();
  const { currentUser, logout } = useAuth();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  console.log(currentUser);

  const base64Image = new Buffer(currentUser.image, "binary").toString("base64");
  const imageUrl = `data:image/jpeg;base64,${base64Image}`;
  const goback = () => {
    history.push({
      pathname: `/login`,
    });
  };
  return (
    <Box
      minHeight="1000px"

      sx={{
        backgroundColor: "rgba(134, 248, 255, 0.13);",
      }}
    >
      <Header />
      <Flex mt={4} sx={{ justifyContent: "center" }}>
        <Box width={3 / 4}>
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
            <Flex
              sx={{
                justifyContent: "space-between",
              }}
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
                }}
              />
            </Flex>
          </Card>
        </Box>
      </Flex>
      <Flex mt={4} sx={{justifyContent: "center"}}>
        <Button
          sx={{
            cursor: "pointer",
            border: "3px solid #FFA8A8",
            borderRadius: "10px",
            backgroundColor: "#fff",
          }}
        >
          <Text sx={{color: "black"}}> แก้ไขโปรไฟล์</Text>
        </Button>
      </Flex>
    </Box>
  );
};

export default Profile;
