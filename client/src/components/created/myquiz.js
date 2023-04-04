import React, { useEffect, useState } from "react";
import { useHistory, useLocation, Redirect } from "react-router-dom";
import { Box, Heading, Text, Card, Flex, Link, Button, Image } from "rebass";
import { Label, Input } from "@rebass/forms";
import { Scrollbars } from "react-custom-scrollbars";
import { useAuth } from "../../contexts/AuthContext";
import Header from "../Header";
import Mobileheader from "../Mobileheader";
import api from "../../api";
import { AiOutlineStar, AiFillStar } from "react-icons/ai";

const Myquiz = () => {
  const { currentUser } = useAuth();
  const history = useHistory();
  const [selectedcategory, setSelectedcategory] = useState(0);
  const [allcategory, setAllcategory] = useState([]);
  const [category, setCategory] = useState("all");
  const [allquiz, setAllquiz] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  let filteredQuizzes = allquiz;
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

  useEffect(() => {
    console.log("Showing my Quiz", allquiz);
    console.log("All category", allcategory);
  }, [allquiz, allcategory]);

  useEffect(() => {
    api
      .get("/allcategory")
      .then((response) => {
        setAllcategory(response.data);
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);

  useEffect(() => {
    api
      .post("/allmyquiz", { userid: currentUser.user_id })
      .then((response) => {
        setAllquiz(response.data);
        setLoading(false);
      })
      .catch((err) => {
        console.log(err);
        setLoading(false);
      });
  }, []);

  if (category !== "all") {
    filteredQuizzes = allquiz.filter((quiz) => quiz.category_name === category);
  }
  if (searchQuery) {
    filteredQuizzes = filteredQuizzes.filter((quiz) =>
      quiz.g_name.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }

  if (!currentUser) {
    return <Redirect to="/login" />;
  }
  const selectcategory = (index, categoryname) => {
    setSelectedcategory(index);
    setCategory(categoryname);
  };
  const gotodetail = (quizid) => {
    history.push({
      pathname: `/detail`,
      state: { quizid: quizid },
    });
  };

  return (
    <Box
      minHeight="100vh"
      sx={{
        backgroundColor: "rgba(134, 248, 255, 0.13);",
      }}
    >
      {isDesktop ? <Header /> : <Mobileheader />}
      <Input
        id="search"
        name="search"
        type="text"
        placeholder="ค้นหาแบบทดสอบ"
        value={searchQuery}
        onChange={(event) => setSearchQuery(event.target.value)}
        sx={{
          width: "55%",
          border: "2px solid gray",
          backgroundColor: "white",
          borderRadius: "4px",
          py: 2,
          px: 3,
          mb: 3,
          // ml: 3,
          mx: "auto",
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
      <Flex mt={4}>
        <Box
          width={[1, 1, 1 / 5]}
          ml={2}
          sx={{
            height: "800px",
            borderRadius: "10px",
            overflowY: "scroll",
            overflowX: "hidden",
            overscrollBehaviorY: "contain",
            "&::-webkit-scrollbar": {
              width: "0px",
              background: "transparent",
            },
            "-ms-overflow-style": "none",
            "scrollbar-width": "none",
            "-webkit-overflow-scrolling": "touch",
          }}
        >
          <Button
            mx="auto"
            mr={4}
            mt={4}
            mb={2}
            p={14}
            sx={{
              display: "flex",
              justifyContent: "center",
              // border: "1px solid #C1D7AE",
              borderRadius: "10px",
              cursor: "pointer",
            }}
            width={1}
            fontSize={2}
            backgroundColor={
              selectedcategory === 0 ? "#C1D7AE" : "rgba(255,255,255,0)"
            }
            type="button"
            onClick={() => selectcategory(0, "all")}
          >
            <Text
              sx={{
                color: " #000",
                fontSize: "20px",
              }}
            >
              ทั้งหมด
            </Text>
          </Button>
          {allcategory.map((category, index) => {
            return (
              <Box key={index}>
                <Button
                  key={index}
                  mx="auto"
                  mr={4}
                  mt={4}
                  mb={2}
                  p={14}
                  sx={{
                    display: "flex",
                    justifyContent: "center",
                    // border: "1px solid #C1D7AE",
                    borderRadius: "20px",
                    cursor: "pointer",
                  }}
                  width={1}
                  fontSize={2}
                  backgroundColor={
                    selectedcategory === index + 1
                      ? "#C1D7AE"
                      : "rgba(255,255,255,0)"
                  }
                  type="button"
                  onClick={() =>
                    selectcategory(index + 1, category.category_name)
                  }
                >
                  <Text
                    sx={{
                      color: " #000",
                      fontSize: "20px",
                    }}
                  >
                    {category.category_name}
                  </Text>
                </Button>
              </Box>
            );
          })}
        </Box>
        <Box
          width={[1, 4 / 5]}
          mx={4}
          sx={{
            // backgroundColor: "rgba(255,255,255,1)",
            borderBottom: "1px solid rgba(255,255,255,0.50)",
            height: "800px",
            borderRadius: "10px",
            display: "flex",
            flexWrap: "wrap",
            overflowY: "scroll",
            overflowX: "hidden",
            overscrollBehaviorY: "contain",
            "&::-webkit-scrollbar": {
              width: "8px",
            },
            "&::-webkit-scrollbar-track": {
              background: "#F6F6F6",
              borderRadius: "10px",
            },
            "&::-webkit-scrollbar-thumb": {
              background: "rgba(134, 248, 255, 0.13)",
              borderRadius: "20px",
              border: "2px solid #F6F6F6",
            },
            "&::-webkit-scrollbar-thumb:hover": {
              background: "#A6C17F",
            },
          }}
        >
          {filteredQuizzes.length === 0 ? (
            <Text
              sx={{
                display: "inline",
                whiteSpace: "nowrap",
                overflow: "hidden",
                textOverflow: "ellipsis",
                fontSize: "20px",
                fontWeight: "bold",
                color: "black",
                textAlign: "left",
              }}
              ml={4}
              mt={4}
            >
              ไม่มีคำถามในหมวดนี้
            </Text>
          ) : (
            filteredQuizzes.map((quiz, index) => {
              const base64ImageData = Buffer.from(quiz.question_image).toString(
                "base64"
              );
              const imageUrl = `data:image/png;base64,${base64ImageData}`;
              return (
                <Box
                  key={index}
                  sx={{
                    position: "relative",
                    height: "150px",
                    width: "300px",
                    backgroundImage: `url(${imageUrl})`,
                    backgroundSize: "cover",
                    backgroundPosition: "center",
                    borderRadius: "10px",
                    overflow: "hidden",
                    cursor: "pointer",
                    flexShrink: 0,
                    mb: 4,
                  }}
                  mx={4}
                  onMouseDown={(e) => e.preventDefault()}
                  onClick={() => gotodetail(quiz.group_id)}
                >
                  <Box
                    sx={{
                      position: "absolute",
                      bottom: 0,
                      left: 0,
                      width: "100%",
                      height: "45%",
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
            })
          )}
        </Box>
      </Flex>
    </Box>
  );
};

export default Myquiz;
