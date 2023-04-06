import React, { useEffect, useState } from "react";
import { useLocation, Redirect, useHistory } from "react-router-dom";
import { Box, Heading, Text, Card, Flex, Link, Button, Image } from "rebass";
import { Label, Input, Select } from "@rebass/forms";
import { Modal, Typography } from "@mui/material";
import { useAuth } from "../contexts/AuthContext";
import { useToasts } from "react-toast-notifications";
import Header from "./Header";
import Mobileheader from "./Mobileheader";
import api from "../api";
import { AiOutlineStar, AiFillStar } from "react-icons/ai";

const Detail = () => {
  const { currentUser } = useAuth();
  const { addToast } = useToasts();
  const history = useHistory();
  const [quizdetail, setQuizdetail] = useState([]);
  const [quiztopic, setQuiztopic] = useState([]);
  const [loading, setLoading] = useState(true);
  const [favorite, setFavorite] = useState(false);
  const [opensave, setOpensave] = useState(false);
  const [loadquestion, setLoadquestion] = useState(0);
  const location = useLocation();
  const quizid = location.state.quizid;
  let favoriteQuestions =
    JSON.parse(window.localStorage.getItem("Favourite Question")) || [];
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
  const checkid = quiztopic.filter(
    (quiz) => quiz.username === currentUser.username
  );
  const selectquestion = (index) => {
    console.log("Select question ", index);
    setLoadquestion(index);
  };

  const deletequiz = () => {
    api
      .delete("/deletequiz/" + quizid)
      .then((response) => {
        addToast("Delete!!", {
          appearance: "success",
          autoDismiss: true,
        });
        history.push({
          pathname: `/`,
        });
      })
      .catch((error) => {
        console.log(error);
      });
  };
  const modalsaveClose = () => setOpensave(false);
  const modalsaveOpen = () => setOpensave(true);

  const editquiz = () => {
    window.localStorage.setItem("EditQuiz", JSON.stringify(quiztopic));
    window.localStorage.setItem("Edit id", JSON.stringify(quizid));
    window.localStorage.setItem("Question", JSON.stringify(quizdetail));
    history.push({
      pathname: `/createquiz`,
    });
  };

  const favoritequestion = (index, action) => {
    const question = {
      question_name: quizdetail[index].question_name,
      choice1: quizdetail[index].choice1,
      choice2: quizdetail[index].choice2,
      choice3: quizdetail[index].choice3,
      choice4: quizdetail[index].choice4,
      correct_choice: quizdetail[index].correct_choice,
    };

    let updatedQuestions = [...favoriteQuestions];
    const existingIndex = updatedQuestions.findIndex(
      (q) => q.question_name === quizdetail[index].question_name
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
      overflow="hidden"
      sx={{
        backgroundColor: "rgb(240, 242, 245);",
      }}
    >
      {isDesktop ? <Header /> : <Mobileheader />}
      <Modal open={opensave} onClose={modalsaveClose}>
        <Box
          sx={{
            backgroundColor: "#fff",
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            textAlign: "center",
            borderRadius: "20px",
            display: "inline-block",
            height: "20%",
          }}
          width={{ xs: "100%", sm: "75%", md: "50%" }}
          px={4}
          pt={4}
          pb={5}
        >
          <Text sx={{ fontSize: "20px" }}>ต้องการลบแบบทดสอบนี้?</Text>
          <Flex justifyContent="center" alignItems="center">
            <Button
              mx="auto"
              mr={4}
              mt={4}
              p={14}
              sx={{
                display: "flex",
                justifyContent: "center",
                border: "1px solid #D10000",
                borderRadius: "20px",
                cursor: "pointer",
              }}
              width={3 / 4}
              fontSize={2}
              backgroundColor="#fff"
              type="button"
              onClick={modalsaveClose}
            >
              <Text
                sx={{
                  color: " #000",
                  fontSize: "20px",
                }}
              >
                ยกเลิก
              </Text>
            </Button>
            <Button
              mx="auto"
              mr={4}
              mt={4}
              p={14}
              sx={{
                display: "flex",
                justifyContent: "center",
                border: "1px solid #D10000",
                borderRadius: "20px",
                cursor: "pointer",
              }}
              width={3 / 4}
              fontSize={2}
              backgroundColor="#D10000"
              type="button"
              onClick={deletequiz}
            >
              <Text
                sx={{
                  color: " #000",
                  fontSize: "20px",
                }}
              >
                ลบแบบทดสอบ
              </Text>
            </Button>
          </Flex>
        </Box>
      </Modal>

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
      <Flex mt={3} ml={[0, 4]} flexDirection={["column", "row"]}>
        <Box
          width={[1, 1, 1 / 5]}
          px={4}
          ml={[0, 1]}
          mb={3}
          sx={{
            backgroundColor: "rgba(255,255,255,0.75)",
            border: "1px solid #fff",
            borderBottom: "1px solid rgba(255,255,255,0.50)",
            borderRight: "1px solid rgba(255,255,255,0.50)",
            boxShadow: "0 25px 50px rgba(0,0,0,0.1)",
            height: ["140px", "700px"],
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
              background: "rgb(240, 242, 245)",
              borderRadius: "20px",
              border: "2px solid #F6F6F6",
            },
            "&::-webkit-scrollbar-thumb:hover": {
              background: "#A6C17F",
            },
          }}
        >
          <Text mx="auto" mt={4} mb={2} fontSize="20px">
            จำนวนข้อทั้งหมด: {quizdetail.length}
          </Text>
          {isDesktop ? (
            quizdetail.map((question, index) => {
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
            })
          ) : (
            <Select
              id="choice"
              name="choice"
              defaultValue="ทั้งหมด"
              onChange={(event) => selectquestion(event.target.selectedIndex)}
              backgroundColor="white"
            >
              {quizdetail.map((room, index) => (
                <option key={index}>ข้อที่ {index + 1}</option>
              ))}
            </Select>
          )}
        </Box>
        <Flex flexDirection="column" width="100%">
          <Box
            width={[1, 1]}
            ml={[0, 4]}
            mr={4}
            sx={{
              backgroundColor: "rgba(255,255,255,1)",
              borderBottom: "1px solid rgba(255,255,255,0.50)",
              height: checkid.length > 0 ? "600px" : "700px",
              borderRadius: "10px",
            }}
          >
            {quizdetail.map((question, index) => {
              const isFavorite =
                favoriteQuestions.findIndex(
                  (q) => q.question_name === question.question_name
                ) !== -1;

              if (index === loadquestion) {
                return (
                  <Box sx={{ ml: 4, mt: 3 }} key={index}>
                    <Text ml={4} my={4} fontSize="26px">
                      {question.question_name}
                    </Text>
                    <Text
                      ml={[0, 4]}
                      mb={4}
                      fontSize="22px"
                      color={question.correct_choice === 1 ? "green" : "black"}
                    >
                      1. {question.choice1}
                    </Text>
                    <Text
                      ml={[0, 4]}
                      mb={4}
                      fontSize="22px"
                      color={question.correct_choice === 2 ? "green" : "black"}
                    >
                      2. {question.choice2}
                    </Text>
                    <Text
                      ml={[0, 4]}
                      mb={4}
                      fontSize="22px"
                      color={question.correct_choice === 3 ? "green" : "black"}
                    >
                      3. {question.choice3}
                    </Text>
                    <Text
                      ml={[0, 4]}
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
                          color: "#ffcd3c",
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
                          color: "#ffcd3c",
                        }}
                        onClick={() => favoritequestion(index, "save")}
                      />
                    )}
                  </Box>
                );
              }
            })}
          </Box>
          {checkid.length > 0 ? (
            <Flex>
              <Button
                ml={[4, "auto"]}
                my={4}
                p={12}
                sx={{
                  display: "flex",
                  justifyContent: "center",
                  border: "1px solid #C1D7AE",
                  borderRadius: "20px",
                  cursor: "pointer",
                }}
                width={[2 / 4, 1 / 4]}
                fontSize={2}
                backgroundColor="#D10000"
                type="button"
                onClick={modalsaveOpen}
              >
                <Text
                  sx={{
                    color: " #000",
                    fontSize: "20px",
                  }}
                >
                  ลบแบบทดสอบ
                </Text>
              </Button>

              <Button
                ml={[4, 3]}
                mr={[4, 1]}
                my={4}
                p={12}
                sx={{
                  display: "flex",
                  borderRadius: "20px",
                  justifyContent: "center",
                  cursor: "pointer",
                }}
                width={[2 / 4, 1 / 4]}
                fontSize={2}
                backgroundColor="#ffcd3c"
                type="button"
                onClick={editquiz}
              >
                <Text
                  sx={{
                    color: " #000",
                    fontSize: "20px",
                  }}
                >
                  แก้ไขแบบทดสอบ
                </Text>
              </Button>
            </Flex>
          ) : (
            ""
          )}
        </Flex>
      </Flex>
    </Box>
  );
};

export default Detail;
