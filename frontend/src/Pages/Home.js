import React from "react";
import { Box, Heading, Text, Card, Flex, Link, Button, Image } from "rebass";
import _ from "lodash";

const Home = () => {
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
