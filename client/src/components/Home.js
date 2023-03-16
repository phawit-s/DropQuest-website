import React, { useEffect, useState } from "react";
import { useHistory, Redirect, useLocation } from "react-router-dom";
import { Box, Heading, Text, Card, Flex, Link, Button, Image } from "rebass";
import { Scrollbars } from "react-custom-scrollbars";
import { useAuth } from "../contexts/AuthContext";
import { useTheme } from "styled-components";
import Header from "./Header";
import api from "../api";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

const Home = () => {
  const { currentUser } = useAuth();
  const history = useHistory();
  const location = useLocation();
  const theme = useTheme();
  const [allquiz, setAllquiz] = useState([]);
  const [allcategory, setAllcategory] = useState([]);
  const [currentSlide, setCurrentSlide] = useState(0);

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
    if (location.pathname === "/") {
      api
        .get("/allquiz")
        .then((response) => {
          setAllquiz(response.data);
        })
        .catch((err) => {
          console.log(err);
        });
    }
  }, [location.pathname]);
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
  const gotodetail = (quizid) => {
    history.push({
      pathname: `/detail`,
      state: { quizid: quizid },
    });
  };
  if (!currentUser) {
    return <Redirect to="/login" />;
  }

  return (
    <Box
      minHeight="100vh"
      sx={{
        backgroundColor: "rgba(134, 248, 255, 0.13);",
      }}
    >
      <Header />
      <Box sx={{ width: "100%", alignItems: "flex-start" }}>
        {allcategory.map((category, index) => {
          const filteredQuizzes = allquiz.filter(
            (quiz) => quiz.category_name === category.category_name
          );
          return (
            <Box key={index}>
              <Text fontWeight="bold" ml={4} mt={4} mb={2}>
                {category.category_name}
              </Text>
              <Box
                sx={{
                  width: "100%",
                  overflowX: "auto",
                  scrollSnapType: "x mandatory",
                  display: "flex",
                  scrollbarWidth: "thin",
                  scrollbarColor: "gray #f5f5f5",
                  msOverflowStyle: "none",
                  "&::-webkit-scrollbar": {
                    width: "2px",
                    marginTop: "10px",
                  },
                  "&::-webkit-scrollbar-track": {
                    backgroundColor: "#f5f5f5",
                  },
                  "&::-webkit-scrollbar-thumb": {
                    backgroundColor: "gray",
                    borderRadius: "6px",
                    border: "4px solid #f5f5f5",
                    width: "2px",
                  },
                  "& > div": {
                    marginRight: "16px",
                    marginLeft: "16px",
                  },
                }}
              >
                {filteredQuizzes.map((quiz, index) => {
                  const base64ImageData = Buffer.from(
                    quiz.question_image
                  ).toString("base64");
                  const imageUrl = `data:image/png;base64,${base64ImageData}`;
                  return (
                    <Box
                      key={index}
                      sx={{
                        position: "relative",
                        height: "200px",
                        width: "300px",
                        backgroundImage: `url(${imageUrl})`,
                        backgroundSize: "cover",
                        backgroundPosition: "center",
                        borderRadius: "2px",
                        overflow: "hidden",
                        cursor: "pointer",
                        flexShrink: 0,
                      }}
                      mr={4}
                      onMouseDown={(e) => e.preventDefault()}
                      onClick={() => gotodetail(quiz.group_id)}
                    >
                      <Box
                        sx={{
                          position: "absolute",
                          bottom: 0,
                          left: 0,
                          width: "100%",
                          height: "40%",
                          backgroundColor: "white",
                          opacity: 0.7,
                          display: "flex",
                          flexDirection: "column",
                          alignItems: "flex-start",
                          justifyContent: "center",
                          p: 2,
                        }}
                      >
                        <Text
                          sx={{
                            display: "inline",
                            whiteSpace: "nowrap",
                            overflow: "hidden",
                            textOverflow: "ellipsis",
                            fontSize: "16px",
                            fontWeight: "bold",
                            color: "black",
                            textAlign: "left",
                          }}
                          ml={2}
                        >
                          {quiz.g_name}
                        </Text>
                        <Text
                          sx={{
                            display: "inline",
                            whiteSpace: "nowrap",
                            overflow: "hidden",
                            textOverflow: "ellipsis",
                            fontSize: "14px",
                            fontWeight: "bold",
                            color: "black",
                            textAlign: "left",
                          }}
                          ml={2}
                        >
                          created by {quiz.username}
                        </Text>
                      </Box>
                    </Box>
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
