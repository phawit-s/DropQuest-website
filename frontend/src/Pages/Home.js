import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useLocation, useHistory } from "react-router-dom";
import { Box, Heading, Text, Card, Flex, Link, Button, Image } from "rebass";
import _ from "lodash";
import api from "../api/register";

const Home = () => {
  const [test, setTest] = useState([]);
  
    api
      .post("/database")
      .then((res) => {
        console.log(res.data);
      });


  return (
    <Box>
      <Flex px={2} color="white" bg="black" alignItems="center">
        <Text p={2} fontWeight="bold">
          Rebass
        </Text>
        <Box mx="auto" />
        <Link variant="nav" href="#!">
          Profile
        </Link>
      </Flex>
    </Box>
  );
};

export default Home;
