import React, { useEffect } from "react";
import { Redirect } from "react-router-dom";
import { Box, Heading, Text, Card, Flex, Link, Button, Image } from "rebass";
import { useAuth } from "../contexts/AuthContext";


const Home = () => {
  const { currentUser, logout } = useAuth();
  console.log(currentUser);
  if (!currentUser) {
    return <Redirect to="/login" />;
  }


  return (
    <Box
      minHeight="1000px"
      sx={{
        backgroundImage:
          "conic-gradient(from 180deg at 50% 50%, rgba(255, 230, 0, 0.4) -50.63deg, #51DEFD 52.5deg, #51DEFD 180deg, rgba(255, 230, 0, 0.4) 309.38deg, #51DEFD 412.5deg);",
      }}
    >
      <Flex px={2} color="white" mx={4} pt={4} alignItems="center">
        <Text p={2} fontWeight="bold">
          Dropquest
        </Text>
        <Box mx="auto" />
        <Text>{currentUser.displayName}</Text>
        <Image
          ml={3}
          src={currentUser.photoURL}
          sx={{ borderRadius: "50%", width: "60px", height: "60px", objectFit: "fill" }}
        />

        <Button ml={4} onClick={(e) =>{e.preventDefault(); logout()}} bg="red">
          Sign Out
        </Button>
      </Flex>
    </Box>
  );
};

export default Home;
