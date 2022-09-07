import React, { useEffect, useState, useContext } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useLocation, useHistory, Redirect } from "react-router-dom";
import { Box, Heading, Text, Card, Flex, Link, Button, Image } from "rebass";
import { AuthContext } from "../api/Auth";
import { auth } from "../api/config";
import _ from "lodash";


const Home = () => {
  const { currentUser } = useContext(AuthContext)
  console.log(currentUser);
  if(!currentUser){
    return <Redirect to="/login" />
  }


  return (
    <Box>
      <Flex px={2} color="white" bg="gray" alignItems="center">
        <Text p={2} fontWeight="bold">
          Rebass
        </Text>
        <Box mx="auto" />
        <Link variant="nav" href="#!">
          Profileadwawd
        </Link>
        <Button onClick={()=>auth.signOut()} bg="red">Sign Out</Button>
      </Flex>
    </Box>
  );
};

export default Home;
