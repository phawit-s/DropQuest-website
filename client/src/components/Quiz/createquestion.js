import React, { useEffect, useState, useRef } from "react";
import { Redirect, useHistory } from "react-router-dom";
import { Box, Text, Flex, Button } from "rebass";
import { Label, Input, Select, Textarea } from "@rebass/forms";
import { Scrollbars } from "react-custom-scrollbars";
import { Modal } from "@mui/material";
import { useAuth } from "../../contexts/AuthContext";
import Header from "../Header";
import Mobileheader from "../Mobileheader";
import { useToasts } from "react-toast-notifications";
import { BsTrash } from "react-icons/bs";
import { FaTrash } from "react-icons/fa";
import { BiEdit } from "react-icons/bi";
import { AiOutlineClose } from "react-icons/ai";
import api from "../../api";

const CreateQuestion = () => {
  const { currentUser, logout } = useAuth();
  const { addToast } = useToasts();
  const history = useHistory();
  const [dataquestion, setDataQuestion] = useState([]);
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
  const [changequestion, setChangequestion] = useState("");
  const [favouritequestion, setFavouriteQuestion] = useState([]);
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
  const getQuestionstorage = window.localStorage.getItem("Question");
  const question = getQuestionstorage ? JSON.parse(getQuestionstorage) : [];
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
    // Update the state with the initial value from localStorage
    setFavouriteQuestion(
      JSON.parse(localStorage.getItem("Favourite Question"))
    );
  }, []);

  useEffect(() => {
    console.log("Loading", favouritequestion);
  }, [
    dataquestion,
    favouritequestion,
    datacheckquestion,
    samequestion,
    savenumber,
  ]);

  useEffect(() => {
    if (question) {
      setDataQuestion([...question]);
    }
  }, []);

  useEffect(() => {
    const handleBeforeUnload = (event) => {
      event.preventDefault();
      event.returnValue = "";
    };

    window.addEventListener("beforeunload", handleBeforeUnload);

    const handleKeyDown = (event) => {
      if ((event.metaKey || event.ctrlKey) && event.key === "r") {
        event.preventDefault();
        const confirmed = window.confirm(
          "Are you sure you want to reload the page? Any unsaved changes will be lost."
        );

        if (confirmed) {
          window.removeEventListener("beforeunload", handleBeforeUnload);
          window.location.reload();
        }
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
      window.removeEventListener("keydown", handleKeyDown);
    };
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
        if (!acc.some((q) => q.question_name === curr.question_name)) {
          acc.push(curr);
        }
        return acc;
      }, []);

      const hasQuestion = uniqueQuestions.find(
        (q) =>
          q.question_name.includes(refquestion.question_name) &&
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
        if (ref.current.innerText === question) {
          ref.current.innerText = question.question;
          refchoice1[refIndex].current.innerText = question.choice1;
          refchoice2[refIndex].current.innerText = question.choice2;
          refchoice3[refIndex].current.innerText = question.choice3;
          refchoice4[refIndex].current.innerText = question.choice4;
          dataquestion[refIndex].correct_choice = question.correct_choice;
        }
      });
    });
  };
  const editquestion = (index) => {
    setChangequestion(index);
    setOpen(true);
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
        (dq) => dq.question_name === samequestion[nextquestion]
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
            dataquestion[refIndex].correct_choice = question.correct_choice;
          }
        });
      });

      if (savenumber.includes(index) !== true) {
        setSavenumber((prevState) => [...prevState, index]);
      }
      if (page === "finish") {
        setOpensave(false);
        setNextquestion(0);
        setCheckmodal(true);
      }
    } else {
      const checkindex = dataquestion.findIndex(
        (dq) => dq.question_name === samequestion[nextquestion]
      );
      dataquestion.map((question) => {
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
            dataquestion[refIndex].correct_choice = question.correct_choice;
          }
        });
      });

      if (savenumber.includes(index) !== true) {
        setSavenumber((prevState) => [...prevState, index]);
      }
      if (page === "finish") {
        setOpensave(false);
        setNextquestion(0);
        setCheckmodal(true);
      }
    }
  };
  const deletefavquestion = (question, favindex) => {
    let updatedQuestions = [...favouritequestion];
    const newQuestion = updatedQuestions.filter(
      (obj) => JSON.stringify(obj) !== JSON.stringify(question)
    );

    window.localStorage.setItem(
      "Favourite Question",
      JSON.stringify(newQuestion)
    );
    setFavouriteQuestion(
      JSON.parse(localStorage.getItem("Favourite Question"))
    );
  };
  const usefavquestion = (favindex) => {
    const sent = {
      question_name: favouritequestion[favindex].question_name,
      choice1: favouritequestion[favindex].choice1,
      choice2: favouritequestion[favindex].choice2,
      choice3: favouritequestion[favindex].choice3,
      choice4: favouritequestion[favindex].choice4,
      correct_choice: favouritequestion[favindex].correct_choice,
    };
    const isQuestionSent = dataquestion.some(
      (item) => item.question_name === sent.question_name
    );

    if (!isQuestionSent) {
      setDataQuestion((dataquestion) => [...dataquestion, sent]);
    } else {
      addToast("คำถามถูกใช้แล้ว", {
        appearance: "error",
        autoDismiss: true,
      });
    }
    setOpenfavquestion(false);
  };
  const createnewquestion = (editindex, status) => {
    const sent = {
      question_name: questiontopic.current.value,
      choice1: questionchoice1.current.value,
      choice2: questionchoice2.current.value,
      choice3: questionchoice3.current.value,
      choice4: questionchoice4.current.value,
      correct_choice: correctchoice.current.value,
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
    // const questionToExclude = questiontopic.current.value;
    if (
      dataquestion.filter(
        (e, i) =>
          e.question_name === questiontopic.current.value && i !== editindex
      ).length > 0
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
      if (status) {
        setChangequestion("");
        setDataQuestion((dataquestion) => {
          const updatedQuestion = {
            question_name: questiontopic.current.value,
            choice1: questionchoice1.current.value,
            choice2: questionchoice2.current.value,
            choice3: questionchoice3.current.value,
            choice4: questionchoice4.current.value,
            correct_choice: correctchoice.current.value,
          };

          const newDataquestion = [...dataquestion];
          newDataquestion[editindex] = updatedQuestion;

          return newDataquestion;
        });
      } else {
        setDataQuestion((dataquestion) => [...dataquestion, sent]);
      }

      setOpen(false);
      setValidateQuestion(false);
      setErrorChoice1(false);
      setErrorChoice2(false);
      setErrorChoice3(false);
      setErrorChoice4(false);
    }
  };

  const deletequestion = async (deleteindex) => {
    const deleteeddata = dataquestion.filter(
      (_, index) => index !== deleteindex
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
        question_name: refquestion.current.innerText,
        choice1: refchoice1[index].current.innerText,
        choice2: refchoice2[index].current.innerText,
        choice3: refchoice3[index].current.innerText,
        choice4: refchoice4[index].current.innerText,
        correct_choice: dataquestion[index].correct_choice,
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
    (dq) => dq.question_name === samequestion[nextquestion]
  );
  return (
    <Box
      minHeight="100vh"
      sx={{
        backgroundColor: "rgb(240, 242, 245) ;",
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
                          dq.correct_choice === 1 || dq.correct_choice === "1"
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
                          dq.correct_choice === 2 || dq.correct_choice === "2"
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
                          dq.correct_choice === 3 || dq.correct_choice === "3"
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
                          dq.correct_choice === 4 || dq.correct_choice === "4"
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
            borderRadius: "10px",
          }}
          height="620px"
          width={2 / 3}
          px={4}
          pt={4}
        >
          <Box>
            {changequestion !== "" ? (
              <Text fontSize={20} mb={3}>
                แก้ไขคำถาม
              </Text>
            ) : (
              <Text fontSize={20} mb={3}>
                สร้างคำถาม
              </Text>
            )}
            <Flex mb={2}>
              <Text fontSize={20} width={2 / 3} mb={1}>
                รายละเอียดคำถาม
              </Text>
              <Box width={1 / 3}>
                <Label>เลือกข้อที่ถูก</Label>
                <Select
                  ref={correctchoice}
                  defaultValue={
                    changequestion !== ""
                      ? dataquestion[changequestion].correct_choice
                      : "1"
                  }
                >
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
              defaultValue={
                changequestion !== ""
                  ? dataquestion[changequestion].question_name
                  : ""
              }
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
                defaultValue={
                  changequestion !== ""
                    ? dataquestion[changequestion].choice1
                    : ""
                }
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
                defaultValue={
                  changequestion !== ""
                    ? dataquestion[changequestion].choice2
                    : ""
                }
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
                defaultValue={
                  changequestion !== ""
                    ? dataquestion[changequestion].choice3
                    : ""
                }
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
                defaultValue={
                  changequestion !== ""
                    ? dataquestion[changequestion].choice4
                    : ""
                }
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
                onClick={
                  changequestion !== ""
                    ? () => createnewquestion(changequestion, "change")
                    : createnewquestion
                }
              >
                <Text sx={{ color: "black" }}>
                  {" "}
                  {changequestion !== "" ? "แก้ไขคำถาม" : "สร้างคำถาม"}
                </Text>
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
            <AiOutlineClose />
          </Box>
          {favouritequestion
            ? favouritequestion.map((question, index) => {
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
                        คำถาม : {question.question_name}
                      </Text>
                      <Text
                        fontSize="20px"
                        ml={4}
                        mb={4}
                        mr={3}
                        mt={3}
                        color={
                          question.correct_choice === 1 ? "green" : "black"
                        }
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
                        color={
                          question.correct_choice === 2 ? "green" : "black"
                        }
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
                        color={
                          question.correct_choice === 3 ? "green" : "black"
                        }
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
                        color={
                          question.correct_choice === 4 ? "green" : "black"
                        }
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
                          <Text sx={{ color: "black" }}>ใช้คำถาม</Text>
                        </Button>
                      </Box>
                    </Box>
                  );
                }
              })
            : ""}
        </Box>
      </Modal>

      {isDesktop ? <Header /> : <Mobileheader />}

      <Flex mt={3} flexDirection={["column", "row"]}>
        <Box
          width={[1, 2 / 5]}
          ml={[1, 4]}
          mb={[4, 0]}
          px={4}
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
          {favouritequestion ? (
            <Scrollbars
              style={{ width: "100%", height: "100%", overflow: "hidden" }}
            >
              {favouritequestion.map((question, index) => {
                return (
                  <Box
                    mt={3}
                    p={4}
                    key={index}
                    sx={{
                      display: "flex", // Add display: flex to create a flexbox
                      justifyContent: "space-between", // Add justify-content to create space between the main box and the trash icon
                      backgroundColor: "rgba(255,255,255,1)",
                      border: "1px solid rgba(0,0,0,0.3)",
                      borderRadius: "5px",
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
                      {question.question_name}
                    </Text>
                    <Box
                      onClick={(e) => {
                        e.stopPropagation();
                        deletefavquestion(question, index);
                      }}
                      sx={{
                        position: "relative",
                        bottom: "0px",
                        right: "10px",
                        cursor: "pointer",
                      }}
                    >
                      <FaTrash />
                    </Box>
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
                  zIndex:10
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
          ml={[1, 4]}
          mb={[4, 0]}
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
                      {data.question_name}
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
                            data.correct_choice === "1" ||
                            data.correct_choice === 1
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
                            data.correct_choice === "2" ||
                            data.correct_choice === 2
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
                          borderRadius: "10px",
                          backgroundColor:
                            data.correct_choice === "3" ||
                            data.correct_choice === 3
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
                          borderRadius: "10px",
                          backgroundColor:
                            data.correct_choice === "4" ||
                            data.correct_choice === 4
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
                    <BiEdit
                      style={{
                        position: "absolute",
                        right: 60,
                        width: "25px",
                        height: "25px",
                        cursor: "pointer",
                      }}
                      onClick={() => editquestion(index)}
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
