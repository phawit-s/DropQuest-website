import React, { useEffect, useState } from "react";
import { useHistory, Redirect, useLocation } from "react-router-dom";
import { Box, Text } from "rebass";
import { Label, Input } from "@rebass/forms";
import { useAuth } from "../contexts/AuthContext";
import Header from "./Header";
import Mobileheader from "./Mobileheader";
import api from "../api";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { gapi } from "gapi-script";
import { AiOutlineStar, AiFillStar } from "react-icons/ai";

const Home = () => {
  const { currentUser } = useAuth();
  const history = useHistory();
  const location = useLocation();
  const [allquiz, setAllquiz] = useState([]);
  const [favorite, setFavorite] = useState(false);
  const [allcategory, setAllcategory] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [isDesktop, setIsDesktop] = useState(window.innerWidth > 768);
  let favouriteQuiz =
    JSON.parse(window.localStorage.getItem("Favourite Quiz")) || [];
  const clientid =
    "104253971362-maefhqpjrko1rdmbcrjeng9r605j3qor.apps.googleusercontent.com";

  useEffect(() => {
    gapi.load("auth2", () => {
      // Initialize the auth2 library with your client ID
      gapi.auth2.init({ client_id: clientid }).then(() => {
        // Get the auth2 instance
        const auth2 = gapi.auth2.getAuthInstance();
        const check = auth2.isSignedIn.get();
        // Sign out the user
        if (check) {
          auth2.signOut().then(() => {
            console.log("User signed out.");
          });
        }
      });
    });
  }, []);

  useEffect(() => {
    const handleResize = () => {
      setIsDesktop(window.innerWidth >= 768);
    };
    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  useEffect(() => {
    console.log("Loading");
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

  const favourite = (id, name, image, username, action) => {
    const quiz = {
      group_id: id,
      g_name: name,
      question_image: image,
      username: username,
    };

    let updateQuiz = [...favouriteQuiz];
    const existingIndex = updateQuiz.findIndex((q) => q.g_name === name);

    if (action === "save") {
      if (existingIndex === -1) {
        updateQuiz.push(quiz);
        setFavorite(updateQuiz.length - 1);
        window.localStorage.setItem(
          "Favourite Quiz",
          JSON.stringify(updateQuiz)
        );
      }
    } else if (action === "remove") {
      if (existingIndex !== -1) {
        updateQuiz.splice(existingIndex, 1);
        setFavorite(-1);
        window.localStorage.setItem(
          "Favourite Quiz",
          JSON.stringify(updateQuiz)
        );
      }
    }
  };

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
        <Label htmlFor="search" ml="4" mb="3" fontSize="18px" fontWeight="700">
          ค้นหา
        </Label>
        <Input
          id="search"
          name="search"
          type="text"
          placeholder="ค้นหาแบบทดสอบ"
          value={searchQuery}
          onChange={(event) => setSearchQuery(event.target.value)}
          sx={{
            width: "50%",
            border: "2px solid gray",
            backgroundColor: "white",
            borderRadius: "4px",
            py: 2,
            px: 3,
            mb: 3,
            ml: 3,
            fontSize: 16,
            fontWeight: "bold",
            color: "black",
            "&:focus": {
              outline: "none",
              borderColor: "primary",
              boxShadow: "0px 0px 5px rgba(0, 0, 0, 0.2)",
            },
          }}
        />
        {allcategory.map((category, index) => {
          const filteredQuizzes = allquiz.filter(
            (quiz) =>
              quiz.category_name === category.category_name &&
              quiz.g_name.toLowerCase().includes(searchQuery.toLowerCase())
          );
          if (filteredQuizzes.length === 0) {
            return null; // skip rendering this category if there are no quizzes
          }
          return (
            <Box key={index}>
              <Text fontWeight="bold" ml={4} mt={4} mb={4}>
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
                  const isFavorite =
                    favouriteQuiz.findIndex((q) => q.g_name === quiz.g_name) !==
                    -1;

                  return (
                    <Box
                      key={index}
                      sx={{
                        position: "relative",
                        height: "180px",
                        width: "300px",
                        backgroundImage: `url(${imageUrl})`,
                        backgroundSize: "cover",
                        backgroundPosition: "center",
                        borderRadius: "12px",
                        overflow: "hidden",
                        cursor: "pointer",
                        flexShrink: 0,
                      }}
                      mx={4}
                      mb={3}
                      onMouseDown={(e) => e.preventDefault()}
                    >
                      {isFavorite ? (
                        <AiFillStar
                          style={{
                            position: "absolute",
                            top: 10,
                            right: 5,
                            width: "30px",
                            height: "30px",
                            cursor: "pointer",
                            color: "#ffcd3c",
                            zIndex: 2,
                          }}
                          onClick={(e) => {
                            favourite(
                              quiz.group_id,
                              quiz.g_name,
                              quiz.question_image,
                              quiz.username,
                              "remove"
                            );
                          }}
                        />
                      ) : (
                        <AiOutlineStar
                          style={{
                            position: "absolute",
                            top: 10,
                            right: 5,
                            width: "30px",
                            height: "30px",
                            cursor: "pointer",
                            color: "#ffcd3c",
                            zIndex: 2,
                          }}
                          onClick={(e) => {
                            favourite(
                              quiz.group_id,
                              quiz.g_name,
                              quiz.question_image,
                              quiz.username,
                              "save"
                            );
                          }}
                        />
                      )}
                      <Box
                        sx={{
                          height: "100%",
                        }}
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
