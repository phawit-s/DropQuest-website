import React, { useEffect, useState } from "react";
import { useLocation, Redirect } from "react-router-dom";
import { Box, Heading, Text, Card, Flex, Link, Button, Image } from "rebass";
import { Scrollbars } from "react-custom-scrollbars";
import { useAuth } from "../contexts/AuthContext";
import Header from "./Header";
import api from "../api";
import { AiOutlineStar, AiFillStar } from "react-icons/ai";

const Detail = () => {
  const { currentUser } = useAuth();
  const [quizdetail, setQuizdetail] = useState([]);
  const [quiztopic, setQuiztopic] = useState([]);
  const [loading, setLoading] = useState(true);
  const [favorite, setFavorite] = useState(false);
  const [loadquestion, setLoadquestion] = useState(0);
  const location = useLocation();
  const quizid = location.state.quizid;
  let favoriteQuestions =
    JSON.parse(window.localStorage.getItem("Favourite Question")) || [];

  useEffect(() => {
    console.log("Showing all Questions", quizdetail);
    console.log("Loading id", quizid);
    console.log("Showing Quiz Topic", quiztopic);
  }, [quizdetail, quizid, quiztopic]);

  useEffect(() => {
    api
      .post("/quizdetail", { quizid: quizid })
      .then((response) => {
        setQuizdetail(response.data);
        setLoading(false);
      })
      .catch((err) => {
        console.log(err);
        setLoading(false);
      });
  }, []);

  useEffect(() => {
    api
      .post("/quiztopic", { quizid: quizid })
      .then((response) => {
        setQuiztopic(response.data);
        setLoading(false);
      })
      .catch((err) => {
        console.log(err);
        setLoading(false);
      });
  }, []);

  
  if (!currentUser) {
    return <Redirect to="/login" />;
  }

  const selectquestion = (index) => {
    console.log("Select question ", index);
    setLoadquestion(index);
  };

  const favoritequestion = (index, action) => {
    const question = {
      question: quizdetail[index].question_name,
      choice1: quizdetail[index].choice1,
      choice2: quizdetail[index].choice2,
      choice3: quizdetail[index].choice3,
      choice4: quizdetail[index].choice4,
      correct_choice: quizdetail[index].correct_choice,
    };

    let updatedQuestions = [...favoriteQuestions];
    const existingIndex = updatedQuestions.findIndex(
      (q) => q.question === quizdetail[index].question_name
    );

    if (action === "save") {
      if (existingIndex === -1) {
        updatedQuestions.push(question);
        setFavorite(updatedQuestions.length - 1); // set favorite to index of newly added question
      }
    } else if (action === "remove") {
      if (existingIndex !== -1) {
        updatedQuestions.splice(existingIndex, 1);
        setFavorite(-1); // unset favorite state when removing question
      }
    }
    window.localStorage.setItem(
      "Favourite Question",
      JSON.stringify(updatedQuestions)
    );
  };
  return (
    <Box
    minHeight="100vh"
      sx={{
        backgroundColor: "rgba(134, 248, 255, 0.13);",
      }}
    >
      <Header />
      {quiztopic.map((topic, index) => {
        return (
          <Box px={4} key={index}>
            <Text as="span" fontSize={[2, 3]}>
              ชื่อแบบทดสอบ : {topic.g_name} โดย ({topic.username})
            </Text>

            <Text mt={3} fontSize={[2, 3]}>
              คำอธิบายแบบทดสอบ: {topic.question_description}
            </Text>
            <Flex>
              <Text mt={3} fontSize={[2, 3]} mr={4}>
                เวลาของแต่ละข้อ: {topic.question_time} วินาที
              </Text>
              <Text mt={3} fontSize={[2, 3]}>
                คะแนนของแต่ละข้อ: {topic.question_score} คะแนน
              </Text>
            </Flex>
          </Box>
        );
      })}
      <Flex mt={3}>
        <Box
          width={[1, 1, 1 / 5]}
          px={4}
          ml={4}
          mb={3}
          sx={{
            backgroundColor: "rgba(255,255,255,0.75)",
            // backdropFilter: "blur(15px)",
            border: "1px solid #fff",
            borderBottom: "1px solid rgba(255,255,255,0.50)",
            borderRight: "1px solid rgba(255,255,255,0.50)",
            boxShadow: "0 25px 50px rgba(0,0,0,0.1)",
            height: "700px",
            borderRadius: "10px",
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
          <Text mx="auto" mt={4} fontSize="20px">
            จำนวนข้อทั้งหมด: {quizdetail.length}
          </Text>
          {quizdetail.map((question, index) => {
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
                    border: "1px solid #C1D7AE",
                    borderRadius: "20px",
                    cursor: "pointer",
                  }}
                  width={1}
                  fontSize={2}
                  backgroundColor={loadquestion === index ? "green" : "white"}
                  type="button"
                  onClick={() => selectquestion(index)}
                >
                  <Text
                    sx={{
                      color: " #000",
                      fontSize: "20px",
                    }}
                  >
                    ข้อที่ {index + 1}
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
            backgroundColor: "rgba(255,255,255,1)",
            borderBottom: "1px solid rgba(255,255,255,0.50)",
            height: "700px",
            borderRadius: "10px",
          }}
        >

          {quizdetail.map((question, index) => {
            const isFavorite = favoriteQuestions.findIndex(
              (q) => q.question === question.question_name
            ) !== -1;
            console.log(isFavorite);
            if (index === loadquestion) {
              return (
                <Box sx={{ ml: 4, mt: 3 }} key={index}>
                  <Text ml={4} my={4} fontSize="26px">
                    {question.question_name}
                  </Text>
                  <Text
                    ml={4}
                    mb={4}
                    fontSize="22px"
                    color={question.correct_choice === 1 ? "green" : "black"}
                  >
                    1. {question.choice1}
                  </Text>
                  <Text
                    ml={4}
                    mb={4}
                    fontSize="22px"
                    color={question.correct_choice === 2 ? "green" : "black"}
                  >
                    2. {question.choice2}
                  </Text>
                  <Text
                    ml={4}
                    mb={4}
                    fontSize="22px"
                    color={question.correct_choice === 3 ? "green" : "black"}
                  >
                    3. {question.choice3}
                  </Text>
                  <Text
                    ml={4}
                    mb={4}
                    fontSize="22px"
                    color={question.correct_choice === 4 ? "green" : "black"}
                  >
                    4. {question.choice4}
                  </Text>
                  {isFavorite ? (
                    <AiFillStar
                      mt={4}
                      style={{
                        position: "absolute",
                        right: 60,
                        width: "50px",
                        height: "50px",
                        cursor: "pointer",
                        color: "#ffcd3c"
                      }}
                      onClick={() => favoritequestion(index, "remove")}
                    />
                  ) : (
                    <AiOutlineStar
                      mt={4}
                      style={{
                        position: "absolute",
                        right: 60,
                        width: "50px",
                        height: "50px",
                        cursor: "pointer",
                        color: "#ffcd3c"
                      }}
                      onClick={() => favoritequestion(index, "save")}
                    />
                  )}
                </Box>
              );
            }
          })}
        </Box>
      </Flex>
    </Box>
  );
};

export default Detail;
