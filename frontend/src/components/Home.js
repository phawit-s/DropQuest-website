import React, { useEffect, useState, useContext } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useLocation, useHistory, Redirect } from "react-router-dom";
import { Box, Heading, Text, Card, Flex, Link, Button, Image } from "rebass";
import { useAuth } from "../contexts/AuthContext";
import { auth } from "../config/firebaseconfig";
import _ from "lodash";

const Home = () => {
  const { currentUser } = useAuth();
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
          Rebass
        </Text>
        <Box mx="auto" />
        <Text>{currentUser.displayName}</Text>
        <Image src={currentUser.photoURL}  />

        <Button ml={4} onClick={() => auth.signOut()} bg="red">
          Sign Out
        </Button>
      </Flex>
      <Text>test</Text>
    </Box>
  );
};

export default Home;
