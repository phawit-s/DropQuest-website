import React, { useEffect, useState } from "react";
import { Redirect } from "react-router-dom";
import { Box, Heading, Text, Card, Flex, Link, Button, Image } from "rebass";
import { useAuth } from "../contexts/AuthContext";
import Header from "./Header";
import api from "../api";

const Home = () => {
  const { currentUser } = useAuth();
  const [allquiz, setAllquiz] = useState([]);
  const [allcategory, setAllcategory] = useState([]);

  useEffect(() => {
    console.log("Showing all Quiz", allquiz);
    console.log("Showing all Category", allcategory);
  }, [allquiz, allcategory]);

  useEffect(() => {
    api
      .get("/allquiz")
      .then((response) => {
        setAllquiz(response.data);
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);

  useEffect(() => {
    api
      .get("/category")
      .then((response) => {
        setAllcategory(response.data);
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);

  if (!currentUser) {
    return <Redirect to="/login" />;
  }

  return (
    <Box
      minHeight="1000px"
      sx={{
        backgroundColor: "rgba(134, 248, 255, 0.13);",
      }}
    >
      <Header />
      <Box sx={{ width: "100%", overflowX: "scroll" }}>
        {allcategory.map((category, index) => {
          return (
            <Box key={index}>
              <Text fontWeight="bold" ml={4} mt={4} mb={2}>{category.category_name}</Text>
              <Box style={{ display: "flex", flexDirection: "row" }}>
                {allquiz
                  .filter(
                    (quiz) => quiz.category_name === category.category_name
                  )
                  .map((quiz, index) => {
                    return (
                      <Text key={index} ml={4} style={{ display: "inline", whiteSpace: 'nowrap' }}>
                        {quiz.g_name}
                      </Text>
                    );
                  })}
              </Box>
            </Box>
          );
        })}
      </Box>
    </Box>
  );
};

export default Home;
