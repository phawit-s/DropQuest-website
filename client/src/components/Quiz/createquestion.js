import React, { useEffect, useState, useRef } from "react";
import { Redirect, useHistory } from "react-router-dom";
import { Box, Heading, Text, Card, Flex, Link, Button, Image } from "rebass";
import { Label, Input, Select, Textarea, Radio, Checkbox } from "@rebass/forms";
import { Scrollbars } from "react-custom-scrollbars";
import { Modal, Typography } from "@mui/material";
import { useAuth } from "../../contexts/AuthContext";
import Header from "../Header";
import { useToasts } from "react-toast-notifications";
import { BsTrash } from "react-icons/bs";
import { BiEdit } from "react-icons/bi";
import {
  AiOutlineCaretDown,
  AiOutlineCaretUp,
  AiOutlineClose,
} from "react-icons/ai";
import api from "../../api";

const CreateQuestion = () => {
  const { currentUser, logout } = useAuth();
  const { addToast } = useToasts();
  const history = useHistory();
  const [dataquestion, setDataQuestion] = useState([]);
  const [favouritedataquestion, setFavouriteDataQuestion] = useState([]);
  const [samequestion, setSamequestion] = useState([]);
  const [checksamequestion, setChecksamequestion] = useState([]);
  const [datacheckquestion, setDataCheckquestion] = useState([]);
  const [favindex, setfavindex] = useState(0);
  const [savenumber, setSavenumber] = useState([]);
  const [open, setOpen] = useState(false);
  const [opensave, setOpensave] = useState(false);
  const [errorchoice1, setErrorChoice1] = useState(false);
  const [errorchoice2, setErrorChoice2] = useState(false);
  const [errorchoice3, setErrorChoice3] = useState(false);
  const [errorchoice4, setErrorChoice4] = useState(false);
  const [validatequestion, setValidateQuestion] = useState(false);
  const [openFavquestion, setOpenfavquestion] = useState(false);
  const [selectedText, setSelectedText] = useState("left");
  const [checkmodal, setCheckmodal] = useState(false);
  const [nextquestion, setNextquestion] = useState(0);
  const questiontopic = useRef();
  const questionchoice1 = useRef();
  const questionchoice2 = useRef();
  const questionchoice3 = useRef();
  const questionchoice4 = useRef();
  const correctchoice = useRef();
  const refs = [];
  const refchoice1 = [];
  const refchoice2 = [];
  const refchoice3 = [];
  const refchoice4 = [];
  const getproductstorage = window.localStorage.getItem("Question");
  const getfavourite = window.localStorage.getItem("Favourite Question");
  const question = getproductstorage ? JSON.parse(getproductstorage) : [];
  const favouritequestion = getfavourite ? JSON.parse(getfavourite) : [];

  useEffect(() => {
    console.log("Adding Question", dataquestion);
    console.log("Favourite Question", favouritequestion);
    console.log("Checking Question", datacheckquestion);
    console.log("Checking same Question", samequestion);
    console.log("Using Question", savenumber);
  }, [
    dataquestion,
    favouritedataquestion,
    datacheckquestion,
    samequestion,
    savenumber,
  ]);

  useEffect(() => {
    if (question) {
      setDataQuestion([...question]);
    }
    if (favouritequestion) {
      setFavouriteDataQuestion([...favouritequestion]);
    }
  }, []);

  useEffect(() => {
    api
      .get("/question")
      .then((response) => {
        setDataCheckquestion(response.data);
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);

  if (!currentUser) {
    return <Redirect to="/login" />;
  }
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);
  const handleTextClick = (text) => {
    setSelectedText(text);
  };

  const previouspage = () => {
    if (nextquestion > 0) {
      setNextquestion(nextquestion - 1);
    }
  };
  const modalsaveOpen = () => {
    setSamequestion([]);

    dataquestion.map((refquestion) => {
      const uniqueQuestions = datacheckquestion.reduce((acc, curr) => {
        // Check if `acc` already contains an element with the same `question` property as `curr`
        if (!acc.some((q) => q.question_name === curr.question_name)) {
          // If it doesn't, add `curr` to the `acc` array using `push()`
          acc.push(curr);
        }
        // Return the updated `acc` array for the next iteration of `reduce()`
        return acc;
      }, []);

      const hasQuestion = uniqueQuestions.find(
        (q) =>
          q.question_name.includes(refquestion.question) &&
          !q.choice1.includes(refquestion.choice1) &&
          !q.choice2.includes(refquestion.choice2) &&
          !q.choice3.includes(refquestion.choice3) &&
          !q.choice4.includes(refquestion.choice4)
      );
      if (hasQuestion) {
        setSamequestion((prevState) => [
          ...prevState,
          hasQuestion.question_name,
        ]);
        setChecksamequestion((prevState) => [...prevState, hasQuestion]);
      }
    });

    setOpensave(true);
  };
  const modalsaveClose = () => setOpensave(false);
  const modalfavClose = () => setOpenfavquestion(false);
  const cancelquestion = () => {
    setOpensave(false);
    dataquestion.map((question) => {
      refs.forEach((ref, refIndex) => {
        if (ref.current.innerText === question.question) {
          ref.current.innerText = question.question;
          refchoice1[refIndex].current.innerText = question.choice1;
          refchoice2[refIndex].current.innerText = question.choice2;
          refchoice3[refIndex].current.innerText = question.choice3;
          refchoice4[refIndex].current.innerText = question.choice4;
          dataquestion[refIndex].correct = question.correct;
        }
      });
    });
  };

  const usequestion = (index, savetype, page) => {
    if (page === "nextpage") {
      if (nextquestion < samequestion.length) {
        setNextquestion(nextquestion + 1);
      }
    }
    if (page === "previouspage") {
      if (nextquestion > 0) {
        setNextquestion(nextquestion - 1);
      }
    }

    if (savetype === "left") {
      const checkquestionnames = checksamequestion.map((question) => question);
      const checkindex = dataquestion.findIndex(
        (dq) => dq.question === samequestion[nextquestion]
      );
      checkquestionnames.forEach((question) => {
        refs.forEach((ref, refIndex) => {
          if (
            ref.current.innerText === question.question_name &&
            refIndex === checkindex
          ) {
            ref.current.innerText = question.question_name;
            refchoice1[refIndex].current.innerText = question.choice1;
            refchoice2[refIndex].current.innerText = question.choice2;
            refchoice3[refIndex].current.innerText = question.choice3;
            refchoice4[refIndex].current.innerText = question.choice4;
            dataquestion[refIndex].correct = question.correct_choice;
          }
        });
      });

      if (savenumber.includes(index) != true) {
        setSavenumber((prevState) => [...prevState, index]);
      }
      if (page === "finish") {
        setOpensave(false);
        setNextquestion(0);
        setCheckmodal(true);
      }
    } else {
      const checkindex = dataquestion.findIndex(
        (dq) => dq.question === samequestion[nextquestion]
      );
      dataquestion.map((question) => {
        refs.forEach((ref, refIndex) => {
          if (
            ref.current.innerText === question.question &&
            refIndex === checkindex
          ) {
            ref.current.innerText = question.question;
            refchoice1[refIndex].current.innerText = question.choice1;
            refchoice2[refIndex].current.innerText = question.choice2;
            refchoice3[refIndex].current.innerText = question.choice3;
            refchoice4[refIndex].current.innerText = question.choice4;
            dataquestion[refIndex].correct = question.correct;
          }
        });
      });

      if (savenumber.includes(index) != true) {
        setSavenumber((prevState) => [...prevState, index]);
      }
      if (page === "finish") {
        setOpensave(false);
        setNextquestion(0);
        setCheckmodal(true);
      }
    }
  };
  const usefavquestion = (favindex) => {
    const sent = {
      question: favouritedataquestion[favindex].question,
      choice1: favouritedataquestion[favindex].choice1,
      choice2: favouritedataquestion[favindex].choice2,
      choice3: favouritedataquestion[favindex].choice3,
      choice4: favouritedataquestion[favindex].choice4,
      correct: favouritedataquestion[favindex].correct_choice,
    };
    const isQuestionSent = dataquestion.some(
      (item) => item.question === sent.question
    );

    if (!isQuestionSent) {
      setDataQuestion((dataquestion) => [...dataquestion, sent]);
    } else {
      addToast("คำถามถูกใช้เรียบร้อย", {
        appearance: "warning",
        autoDismiss: true,
      });
    }
    setOpenfavquestion(false);
  };
  const createnewquestion = () => {
    const sent = {
      question: questiontopic.current.value,
      choice1: questionchoice1.current.value,
      choice2: questionchoice2.current.value,
      choice3: questionchoice3.current.value,
      choice4: questionchoice4.current.value,
      correct: correctchoice.current.value,
    };

    const arry = [
      questionchoice1.current.value,
      questionchoice2.current.value,
      questionchoice3.current.value,
      questionchoice4.current.value,
    ];

    const toFindDuplicates = (arry) =>
      arry.filter((item, index) => arry.indexOf(item) !== index);
    const duplicateElements = toFindDuplicates(arry);

    if (
      dataquestion.filter((e) => e.question === questiontopic.current.value)
        .length > 0
    ) {
      addToast("คำถามถูกใช้แล้ว", {
        appearance: "error",
        autoDismiss: true,
      });
      setValidateQuestion(true);
    } else if (questiontopic.current.value === "") {
      setValidateQuestion(true);
      addToast("คำถามยังไม่ถูกกรอก", {
        appearance: "error",
        autoDismiss: true,
      });
    } else if (duplicateElements.length !== 0) {
      addToast("ตัวเลือกซ้ำกัน", {
        appearance: "error",
        autoDismiss: true,
      });
      duplicateElements.map((value) => {
        if (value === questionchoice1.current.value) {
          setErrorChoice1(!errorchoice1);
        }
        if (value === questionchoice2.current.value) {
          setErrorChoice2(!errorchoice2);
        }
        if (value === questionchoice3.current.value) {
          setErrorChoice3(!errorchoice3);
        }
        if (value === questionchoice4.current.value) {
          setErrorChoice4(!errorchoice4);
        } else {
          setErrorChoice1(false);
          setErrorChoice2(false);
          setErrorChoice3(false);
          setErrorChoice4(false);
        }
      });
    } else {
      setDataQuestion((dataquestion) => [...dataquestion, sent]);
      setOpen(false);
      setValidateQuestion(false);
      setErrorChoice1(false);
      setErrorChoice2(false);
      setErrorChoice3(false);
      setErrorChoice4(false);
    }
  };

  const deletequestion = async (index) => {
    const deleteeddata = dataquestion.filter(
      (value) => value.question != dataquestion[index].question
    );
    setDataQuestion(deleteeddata);
    window.localStorage.setItem("Question", JSON.stringify(deleteeddata));
  };

  const openfavquestion = (index) => {
    setOpenfavquestion(true);
    setfavindex(index);
  };
  const sentsub = async () => {
    const allquestion = [];
    refs.map((refquestion, index) => {
      const question = {
        question: refquestion.current.innerText,
        choice1: refchoice1[index].current.innerText,
        choice2: refchoice2[index].current.innerText,
        choice3: refchoice3[index].current.innerText,
        choice4: refchoice4[index].current.innerText,
        correct: dataquestion[index].correct,
      };
      allquestion.push(question);
    });
    window.localStorage.setItem("Question", JSON.stringify(allquestion));
    addToast("บันทึกเรียบร้อย", {
      appearance: "success",
      autoDismiss: true,
    });
    history.push({
      pathname: `/createquiz`,
    });
  };
  let foundCat = false;
  const firstQuestion = datacheckquestion
    .map((question, index) => {
      if (question.question_name === samequestion[nextquestion] && !foundCat) {
        foundCat = true;
        return (
          <Box key={index}>
            <Text
              fontSize="18px"
              ml={3}
              mb={4}
              mr={3}
              mt={3}
              color={question.correct_choice === 1 ? "green" : "black"}
              textAlign="left"
            >
              ข้อที่ 1 : {question.choice1}
            </Text>
            <Text
              fontSize="18px"
              ml={3}
              mb={4}
              mr={3}
              mt={3}
              color={question.correct_choice === 2 ? "green" : "black"}
              textAlign="left"
            >
              ข้อที่ 2 : {question.choice2}
            </Text>
            <Text
              fontSize="18px"
              ml={3}
              mb={4}
              mr={3}
              mt={3}
              color={question.correct_choice === 3 ? "green" : "black"}
              textAlign="left"
            >
              ข้อที่ 3 : {question.choice3}
            </Text>
            <Text
              fontSize="18px"
              ml={3}
              mb={4}
              mr={3}
              mt={3}
              color={question.correct_choice === 4 ? "green" : "black"}
              textAlign="left"
            >
              ข้อที่ 4 : {question.choice4}
            </Text>
          </Box>
        );
      } else {
        return null;
      }
    })
    .filter((question) => question !== null)[0];

  const dq = dataquestion.find(
    (dq) => dq.question === samequestion[nextquestion]
  );

  return (
    <Box
      minHeight="969px"
      sx={{
        backgroundColor: "rgba(134, 248, 255, 0.13) ;",
      }}
    >
      <Modal open={opensave} onClose={modalsaveClose}>
        {samequestion.length > 0 && checkmodal === false ? (
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
              height: "65%",
            }}
            width={{ xs: "100%", sm: "75%", md: "50%" }}
            px={4}
            pt={4}
            pb={5}
          >
            <Text sx={{ fontSize: "26px", textAlign: "center" }}>
              มีคำถามที่ซ้ำกัน{" "}
              {"(" + (nextquestion + 1) + "/" + samequestion.length + ")"}
            </Text>

            <Text mr={3} fontSize="22px" textAlign="start" mt={4}>
              {samequestion[nextquestion]}
            </Text>
            <Text
              mb={2}
              mr={3}
              fontSize="22px"
              textAlign="center"
              sx={{ textDecoration: "underline" }}
              mt={4}
            >
              เลือกคำถาม
            </Text>
            <Flex
              flexDirection="row"
              justifyContent="space-between"
              height="100%"
            >
              <Box flex={1}>
                <Box
                  p={2}
                  m={1}
                  sx={{
                    cursor: "pointer",
                    border:
                      selectedText === "left"
                        ? "2px solid green"
                        : "1px solid rgba(0,0,0,0.5)",
                    backgroundColor:
                      selectedText === "left"
                        ? "#90EE90"
                        : "rgba(255,255,255,0.50)",
                    borderRadius: "10px",
                    color: selectedText === "left" ? "white" : "inherit",
                    boxShadow: "0 25px 50px rgba(0,0,0,0.1)",
                  }}
                  onClick={() => handleTextClick("left")}
                >
                  <Text
                    fontSize="20px"
                    mb={4}
                    mr={3}
                    color="black"
                    textAlign="center"
                  >
                    คำถามที่มีในฐานข้อมูล
                  </Text>
                  {firstQuestion}
                </Box>
              </Box>
              <Box flex={1}>
                <Box
                  p={2}
                  m={1}
                  sx={{
                    cursor: "pointer",
                    border:
                      selectedText === "right"
                        ? "2px solid green"
                        : "1px solid rgba(0,0,0,0.5)",
                    backgroundColor:
                      selectedText === "right"
                        ? "#90EE90"
                        : "rgba(255,255,255,0.50)",
                    borderRadius: "10px",
                    color: selectedText === "right" ? "white" : "inherit",
                    boxShadow: "0 25px 50px rgba(0,0,0,0.1)",
                  }}
                  onClick={() => handleTextClick("right")}
                >
                  <Text
                    fontSize="20px"
                    ml={3}
                    mb={4}
                    mr={3}
                    textAlign="center"
                    color="black"
                  >
                    คำถามที่ผู้ใช้สร้างขึ้น
                  </Text>

                  {dq ? (
                    <>
                      <Text
                        fontSize="18px"
                        ml={3}
                        mb={4}
                        mr={3}
                        mt={3}
                        color={
                          dq.correct === 1 || dq.correct === "1"
                            ? "green"
                            : "black"
                        }
                        textAlign="left"
                      >
                        ข้อที่ 1 : {dq.choice1}
                      </Text>
                      <Text
                        fontSize="18px"
                        ml={3}
                        mb={4}
                        mr={3}
                        mt={3}
                        color={
                          dq.correct === 2 || dq.correct === "2"
                            ? "green"
                            : "black"
                        }
                        textAlign="left"
                      >
                        ข้อที่ 2 : {dq.choice2}
                      </Text>
                      <Text
                        fontSize="18px"
                        ml={3}
                        mb={4}
                        mr={3}
                        mt={3}
                        color={
                          dq.correct === 3 || dq.correct === "3"
                            ? "green"
                            : "black"
                        }
                        textAlign="left"
                      >
                        ข้อที่ 3 : {dq.choice3}
                      </Text>
                      <Text
                        fontSize="18px"
                        ml={3}
                        mb={4}
                        mr={3}
                        mt={3}
                        color={
                          dq.correct === 4 || dq.correct === "4"
                            ? "green"
                            : "black"
                        }
                        textAlign="left"
                      >
                        ข้อที่ 4 : {dq.choice4}
                      </Text>
                    </>
                  ) : (
                    ""
                  )}
                </Box>
              </Box>
            </Flex>

            <Flex
              sx={{
                position: "absolute",
                bottom: -10,
                right: 10,
                justifyContent: "center",
              }}
              alignItems="flex-end"
            >
              {nextquestion === 0 ? (
                <Button
                  mx="auto"
                  mr={4}
                  mb={4}
                  p={14}
                  sx={{
                    display: "flex",
                    justifyContent: "center",
                    border: "1px solid ",
                    borderRadius: "20px",
                    cursor: "pointer",
                  }}
                  width={3 / 4}
                  fontSize={2}
                  backgroundColor="#A30000"
                  type="button"
                  onClick={cancelquestion}
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
              ) : (
                <Button
                  mx="auto"
                  mr={4}
                  mb={4}
                  p={14}
                  sx={{
                    display: "flex",
                    justifyContent: "center",
                    border: "1px solid ",
                    borderRadius: "20px",
                    cursor: "pointer",
                  }}
                  width={3 / 4}
                  fontSize="14px"
                  backgroundColor="yellow"
                  type="button"
                  onClick={previouspage}
                >
                  <Text
                    sx={{
                      color: " #000",
                      fontSize: "20px",
                      whiteSpace: "nowrap",
                    }}
                    mr={3}
                  >
                    ย้อนกลับ
                  </Text>
                </Button>
              )}

              {nextquestion + 1 === samequestion.length ? (
                <Button
                  mx="auto"
                  mr={4}
                  mb={4}
                  p={14}
                  sx={{
                    display: "flex",
                    justifyContent: "center",
                    border: "1px solid #C1D7AE",
                    borderRadius: "20px",
                    cursor: "pointer",
                  }}
                  width={3 / 4}
                  fontSize={2}
                  backgroundColor="green"
                  type="button"
                  onClick={() =>
                    usequestion(nextquestion, selectedText, "finish")
                  }
                >
                  <Text
                    sx={{
                      color: " #000",
                      fontSize: "20px",
                    }}
                  >
                    ยืนยัน
                  </Text>
                </Button>
              ) : (
                <Button
                  mx="auto"
                  mr={4}
                  mb={4}
                  p={14}
                  sx={{
                    display: "flex",
                    justifyContent: "center",
                    border: "1px solid #C1D7AE",
                    borderRadius: "20px",
                    cursor: "pointer",
                  }}
                  width={3 / 4}
                  fontSize={2}
                  backgroundColor="green"
                  type="button"
                  onClick={() =>
                    usequestion(nextquestion, selectedText, "nextpage")
                  }
                >
                  <Text
                    sx={{
                      color: " #000",
                      fontSize: "20px",
                    }}
                  >
                    ต่อไป
                  </Text>
                </Button>
              )}
            </Flex>
          </Box>
        ) : (
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
            <Text sx={{ fontSize: "20px" }}>ยืนยันการบันทึก?</Text>
            <Flex justifyContent="center" alignItems="center">
              <Button
                mx="auto"
                mr={4}
                mt={4}
                p={14}
                sx={{
                  display: "flex",
                  justifyContent: "center",
                  border: "1px solid #5E8C61",
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
                  ทำต่อ
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
                  border: "1px solid #C1D7AE",
                  borderRadius: "20px",
                  cursor: "pointer",
                }}
                width={3 / 4}
                fontSize={2}
                backgroundColor="green"
                type="button"
                onClick={sentsub}
              >
                <Text
                  sx={{
                    color: " #000",
                    fontSize: "20px",
                  }}
                >
                  บันทึก
                </Text>
              </Button>
            </Flex>
          </Box>
        )}
      </Modal>

      <Modal open={open} onClose={handleClose}>
        <Box
          sx={{
            backgroundColor: "#fff",
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            textAlign: "start",
            borderRadius: "20px",
          }}
          height="620px"
          width={2 / 3}
          px={4}
          pt={4}
        >
          <Box>
            <Text fontSize={20} mb={3}>
              สร้างคำถาม
            </Text>
            <Flex mb={2}>
              <Text fontSize={20} width={2 / 3} mb={1}>
                รายละเอียดคำถาม
              </Text>
              <Box width={1 / 3}>
                <Label>เลือกข้อที่ถูก</Label>
                <Select ref={correctchoice} defaultValue="1">
                  <option value="1">ข้อที่ 1</option>
                  <option value="2">ข้อที่ 2</option>
                  <option value="3">ข้อที่ 3</option>
                  <option value="4">ข้อที่ 4</option>
                </Select>
              </Box>
            </Flex>

            <Textarea
              height="200px"
              ref={questiontopic}
              fontSize={20}
              sx={{
                resize: "none",
                borderRadius: "10px",
                border: validatequestion
                  ? "1px solid red"
                  : "1px solid #0A2239",
              }}
              mb={3}
            />
            <Flex>
              <Text fontSize={20} mt={3}>
                1.{" "}
              </Text>
              <Input
                ref={questionchoice1}
                sx={{
                  borderRadius: "5px",
                  border: errorchoice1 ? "1px solid red" : "1px solid #0A2239",
                }}
                width={2 / 3}
                ml={2}
                my={2}
              />
            </Flex>
            <Flex>
              <Text fontSize={20} mt={3}>
                2.{" "}
              </Text>
              <Input
                ref={questionchoice2}
                sx={{
                  borderRadius: "5px",
                  border: errorchoice2 ? "1px solid red" : "1px solid #0A2239",
                }}
                width={2 / 3}
                ml={2}
                my={2}
              />
            </Flex>
            <Flex>
              <Text fontSize={20} mt={3}>
                3.{" "}
              </Text>
              <Input
                ref={questionchoice3}
                sx={{
                  borderRadius: "5px",
                  border: errorchoice3 ? "1px solid red" : "1px solid #0A2239",
                }}
                width={2 / 3}
                ml={2}
                my={2}
              />
            </Flex>
            <Flex>
              <Text fontSize={20} mt={3}>
                4.{" "}
              </Text>
              <Input
                ref={questionchoice4}
                sx={{
                  borderRadius: "5px",
                  border: errorchoice4 ? "1px solid red" : "1px solid #0A2239",
                }}
                width={2 / 3}
                ml={2}
                my={2}
              />
            </Flex>
            <Box sx={{ display: "flex", justifyContent: "flex-end" }}>
              <Button
                sx={{
                  border: "3px solid #fff",
                  borderRadius: "10px",
                  backgroundColor: "green",
                  cursor: "pointer",
                }}
                onClick={() => createnewquestion()}
              >
                <Text sx={{ color: "black" }}> สร้างคำถาม</Text>
              </Button>
            </Box>
          </Box>
        </Box>
      </Modal>

      <Modal open={openFavquestion} onClose={modalfavClose}>
        <Box
          sx={{
            backgroundColor: "#fff",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            textAlign: "start",
            borderRadius: "10px",
            position: "relative",
          }}
          height="500px"
          width={2 / 3}
          px={4}
          pt={4}
        >
          <Box
            sx={{ position: "absolute", top: 20, right: 20, cursor: "pointer" }}
            
            onClick={modalfavClose}
          >
            <AiOutlineClose  />
          </Box>
          {favouritedataquestion.map((question, index) => {
            if (favindex === index) {
              return (
                <Box key={index}>
                  <Text
                    fontSize="22px"
                    ml={4}
                    mb={4}
                    mr={3}
                    mt={4}
                    textAlign="left"
                  >
                    คำถาม : {question.question}
                  </Text>
                  <Text
                    fontSize="20px"
                    ml={4}
                    mb={4}
                    mr={3}
                    mt={3}
                    color={question.correct_choice === 1 ? "green" : "black"}
                    textAlign="left"
                  >
                    ข้อที่ 1 : {question.choice1}
                  </Text>
                  <Text
                    fontSize="20px"
                    ml={4}
                    mb={4}
                    mr={3}
                    mt={3}
                    color={question.correct_choice === 2 ? "green" : "black"}
                    textAlign="left"
                  >
                    ข้อที่ 2 : {question.choice2}
                  </Text>
                  <Text
                    fontSize="20px"
                    ml={4}
                    mb={4}
                    mr={3}
                    mt={3}
                    color={question.correct_choice === 3 ? "green" : "black"}
                    textAlign="left"
                  >
                    ข้อที่ 3 : {question.choice3}
                  </Text>
                  <Text
                    fontSize="20px"
                    ml={4}
                    mb={4}
                    mr={3}
                    mt={3}
                    color={question.correct_choice === 4 ? "green" : "black"}
                    textAlign="left"
                  >
                    ข้อที่ 4 : {question.choice4}
                  </Text>
                  <Box sx={{ display: "flex", justifyContent: "flex-end" }}>
                    <Button
                      mt={3}
                      sx={{
                        border: "3px solid #fff",
                        borderRadius: "10px",
                        backgroundColor: "green",
                        cursor: "pointer",
                      }}
                      onClick={() => usefavquestion(index)}
                    >
                      <Text sx={{ color: "black" }}> ใช้คำถาม</Text>
                    </Button>
                  </Box>
                </Box>
              );
            }
          })}
        </Box>
      </Modal>

      <Header />

      <Flex mt={3}>
        <Box
          width={[1, 2 / 5]}
          px={4}
          ml={4}
          sx={{
            backgroundColor: "rgba(255,255,255,0.75)",
            border: "1px solid #fff",
            borderBottom: "1px solid rgba(255,255,255,0.50)",
            borderRight: "1px solid rgba(255,255,255,0.50)",
            boxShadow: "0 25px 50px rgba(0,0,0,0.1)",
            gap: "30px",
            overflow: "hidden",
            height: "800px",
            borderRadius: "10px",
            display: "flex",
            flexDirection: "column",
          }}
        >
          {favouritedataquestion.length !== 0 ? (
            <Scrollbars
              style={{ width: "100%", height: "100%", overflow: "hidden" }}
            >
              {favouritedataquestion.map((question, index) => {
                return (
                  <Box
                    mt={3}
                    p={4}
                    key={index}
                    sx={{
                      backgroundColor: "rgba(255,255,255,1)",
                      border: "1px solid rgba(0,0,0,0.3)",
                      borderRadius: "10px",
                      marginBottom: "20px",
                      postition: "relative",
                      cursor: "pointer",
                    }}
                    onClick={() => openfavquestion(index)}
                  >
                    <Text
                      sx={{
                        textAlign: "left",
                        whiteSpace: "nowrap",
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                        fontSize: "18px",
                      }}
                    >
                      {question.question}
                    </Text>
                  </Box>
                );
              })}
            </Scrollbars>
          ) : (
            <Box>
              <Text
                sx={{
                  display: "flex",
                  justifyContent: "center",
                  fontSize: "20px",
                }}
                mt={4}
              >
                ยังไม่มีคำถามที่ชื่นชอบ
              </Text>
            </Box>
          )}
          <Flex sx={{ marginTop: "auto", marginBottom: "40px" }}>
            <Button
              mr={4}
              mt={4}
              p={14}
              sx={{
                display: "flex",
                justifyContent: "center",
                cursor: "pointer",
              }}
              width={[1, 2 / 5]}
              fontSize={2}
              backgroundColor="#53A2BE"
              type="button"
              onClick={handleOpen}
            >
              <Text
                sx={{
                  color: " #fff",
                  fontSize: "16px",
                }}
              >
                สร้างคำถามใหม่
              </Text>
            </Button>

            <Button
              ml={5}
              mt={4}
              p={14}
              sx={{
                display: "flex",
                justifyContent: "center",
                cursor: "pointer",
              }}
              width={[1, 2 / 5]}
              fontSize={2}
              backgroundColor="green"
              type="button"
              // onClick={sentsub}
              onClick={modalsaveOpen}
            >
              <Text
                sx={{
                  color: " #fff",
                  fontSize: "20px",
                }}
              >
                บันทึก
              </Text>
            </Button>
          </Flex>
        </Box>

        <Box
          width={[1, 4 / 5]}
          mx={4}
          sx={{
            overflow: "hidden",
            backgroundColor: "transparent",
            height: "800px",
            borderRadius: "10px",
          }}
        >
          <Scrollbars
            style={{ width: "100%", height: "100%", overflow: "hidden" }}
          >
            {dataquestion.map((data, index) => {
              refs.push(React.createRef());
              refchoice1.push(React.createRef());
              refchoice2.push(React.createRef());
              refchoice3.push(React.createRef());
              refchoice4.push(React.createRef());
              return (
                <Box
                  p={4}
                  key={index}
                  sx={{
                    backgroundColor: "rgba(255,255,255,0.50)",

                    border: "1px solid #fff",
                    borderBottom: "1px solid rgba(255,255,255,0.50)",
                    borderRight: "1px solid rgba(255,255,255,0.50)",
                    borderRadius: "10px",
                    marginBottom: "20px",
                    postition: "relative",
                  }}
                >
                  <Box
                    backgroundColor="white"
                    sx={{ borderRadius: "10px" }}
                    pt={4}
                    pb={3}
                    px={4}
                    mb={2}
                  >
                    <Text mb={3} ref={refs[index]} fontSize="20px">
                      {data.question}
                    </Text>
                  </Box>

                  <Box>
                    <Flex>
                      <Box
                        width={2 / 4}
                        p={3}
                        mx={4}
                        my={2}
                        sx={{
                          borderRadius: "10px",
                          backgroundColor:
                            data.correct === "1" || data.correct === 1
                              ? "#59A96A"
                              : "#fff",
                          color: "black",
                          textAlign: "left",
                        }}
                      >
                        <Text ref={refchoice1[index]}>{data.choice1}</Text>
                      </Box>

                      <Box
                        width={2 / 4}
                        p={3}
                        mx={4}
                        my={2}
                        sx={{
                          borderRadius: "10px",
                          backgroundColor:
                            data.correct === "2" || data.correct === 2
                              ? "#59A96A"
                              : "#fff",
                          color: "black",
                          textAlign: "left",
                        }}
                      >
                        <Text ref={refchoice2[index]}>{data.choice2}</Text>
                      </Box>
                    </Flex>

                    <Flex>
                      <Box
                        width={2 / 4}
                        p={3}
                        mx={4}
                        my={2}
                        sx={{
                          // border:
                          //   data.correct === "3"
                          //     ? "1px solid #59A96A"
                          //     : "1px solid #0A2239",
                          borderRadius: "10px",
                          backgroundColor:
                            data.correct === "3" || data.correct === 3
                              ? "#59A96A"
                              : "#fff",
                          color: "black",
                          textAlign: "left",
                        }}
                      >
                        <Text ref={refchoice3[index]}>{data.choice3}</Text>
                      </Box>

                      <Box
                        width={2 / 4}
                        p={3}
                        mx={4}
                        my={2}
                        sx={{
                          // border:
                          //   data.correct === "4"
                          //     ? "1px solid #59A96A"
                          //     : "1px solid #0A2239",
                          borderRadius: "10px",
                          backgroundColor:
                            data.correct === "4" || data.correct === 4
                              ? "#59A96A"
                              : "#fff",
                          color: "black",
                          textAlign: "left",
                        }}
                      >
                        <Text ref={refchoice4[index]}>{data.choice4}</Text>
                      </Box>
                    </Flex>
                    <BsTrash
                      style={{
                        position: "absolute",
                        right: 20,
                        width: "25px",
                        height: "25px",
                        cursor: "pointer",
                      }}
                      onClick={() => deletequestion(index)}
                    />
                  </Box>
                </Box>
              );
            })}
          </Scrollbars>
        </Box>
      </Flex>
    </Box>
  );
};

export default CreateQuestion;
