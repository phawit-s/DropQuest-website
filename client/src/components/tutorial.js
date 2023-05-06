import React, { useEffect, useState } from "react";
import { Redirect } from "react-router-dom";
import { Box, Text, Flex } from "rebass";
import { useAuth } from "../contexts/AuthContext";
import Header from "./Header";
import Mobileheader from "./Mobileheader";
import ReactPlayer from "react-player";

const Tutorial = () => {
  const { currentUser } = useAuth();
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

  return (
    <Box
      overflow="hidden"
      minHeight="100vh"
      sx={{
        backgroundColor: "rgb(240, 242, 245)",
      }}
    >
      {isDesktop ? <Header /> : <Mobileheader />}
      <Box sx={{ width: "100%", alignItems: "flex-start" }}>
        <Text ml={4} fontSize="32px">
          วิธีการใช้งาน
        </Text>

        <Flex mb={4}>
          <Flex flexDirection="column" mr={4} ml={4}>
            <Text ml={4} my={4} fontSize="26px">
              การสมัครสมาชิก
            </Text>

            <Box ml={4}>
              <ReactPlayer url="https://youtu.be/ald4IglXQxw" controls={true} />
            </Box>
          </Flex>

          <Flex flexDirection="column" mr={4} ml={4} justifyContent="flex-end">
            <Text ml={4} my={4} fontSize="26px">
              การสร้างแบบทดสอบและการสร้างคำถาม
            </Text>

            <Box ml={4}>
              <ReactPlayer url="https://youtu.be/4vyXO7VcrSA" controls={true} />
            </Box>
          </Flex>
        </Flex>
        <Flex flexDirection="column" ml={4} mb={4}>
          <Text ml={4} my={4} fontSize="26px">
            การสร้างคำถาม
          </Text>
          <Box ml={4}>
            <ReactPlayer url="https://youtu.be/KStZa03PBoE" controls={true} />
          </Box>
        </Flex>
      </Box>
    </Box>
  );
};

export default Tutorial;
