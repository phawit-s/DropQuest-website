import React, { useEffect } from "react";
import { Redirect } from "react-router-dom";
import { Box, Heading, Text, Card, Flex, Link, Button, Image } from "rebass";
import { useAuth } from "../contexts/AuthContext";
import Header from "./Header";


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
       backgroundColor :"rgba(134, 248, 255, 0.13);"
      }}
    >
      <Header />
    </Box>
  );
};

export default Home;
