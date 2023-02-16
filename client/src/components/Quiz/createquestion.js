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
import api from "../../api";
const CreateQuestion = () => {
  const { currentUser, logout } = useAuth();
  const { addToast } = useToasts();
  const history = useHistory();
  const [dataquestion, setDataQuestion] = useState([]);
  const [samequestion, setSamequestion] = useState([]);
  const [datacheckquestion, setDataCheckquestion] = useState([]);
  const [savequestion, setSavequestion] = useState(false);
  const [savenumber, setSavenumber] = useState([]);
  const [open, setOpen] = useState(false);
  const [opensave, setOpensave] = useState(false);
  const [errorchoice1, setErrorChoice1] = useState(false);
  const [errorchoice2, setErrorChoice2] = useState(false);
  const [errorchoice3, setErrorChoice3] = useState(false);
  const [errorchoice4, setErrorChoice4] = useState(false);
  const [validatequestion, setValidateQuestion] = useState(false);
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
  const question = getproductstorage ? JSON.parse(getproductstorage) : [];

  useEffect(() => {
    console.log("Adding Question", dataquestion);
    console.log("Checking Question", datacheckquestion);
    console.log("Checking same Question", samequestion);
    console.log("Using Question", savenumber);
  }, [dataquestion, datacheckquestion, samequestion, savenumber]);

  useEffect(() => {
    if (question) {
      setDataQuestion([...question]);
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
  const modalsaveOpen = () => {
    setSamequestion([]);
    refs.map((refquestion) => {
      const allquestion = [];
      const hasQuestion = datacheckquestion.find((q) =>
        q.question_name.includes(refquestion.current.innerText)
      );
      if (hasQuestion) {
        allquestion.push(hasQuestion.question_name);
        setSamequestion((prevState) => [
          ...prevState,
          hasQuestion.question_name,
        ]);
      }
    });

    setOpensave(true);
  };
  const modalsaveClose = () => setOpensave(false);

  const usequestion = (index, savetype) => {
    if (savetype === "old") {
      datacheckquestion.map((sqlquestion) => {
        refs.map((question, refindex) => {
          if (question.current.innerText === sqlquestion.question_name && refindex === index) {
            question.current.innerText = sqlquestion.question_name;
            refchoice1[refindex].current.innerText = sqlquestion.choice1;
            refchoice2[refindex].current.innerText = sqlquestion.choice2;
            refchoice3[refindex].current.innerText = sqlquestion.choice3;
            refchoice4[refindex].current.innerText = sqlquestion.choice4;
            dataquestion[refindex].correct = sqlquestion.correct_choice;
          }
        });
      });
      setSavequestion(true);
      if (savenumber.includes(index) != true) {
        setSavenumber((prevState) => [...prevState, index]);
      }
    } else {
      setSavequestion(true);
      if (savenumber.includes(index) != true) {
        setSavenumber((prevState) => [...prevState, index]);
      }
    }
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

  return (
    <Box
      minHeight="969px"
      sx={{
        backgroundColor: "#F1E4F3;",
      }}
    >
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
            height: "400px",
            // overflow: "auto",
          }}
          width={2 / 4}
          px={4}
          pt={4}
          pb={5}
        >
          {samequestion.length > 0 ? (
            <>
              <Text sx={{ fontSize: "26px", textAlign: "center" }}>
                มีคำถามที่ซ้ำกัน
              </Text>
              <Scrollbars
                style={{
                  width: "100%",
                  height: "70%",
                  overflow: "hidden",
                }}
              >
                {samequestion.map((question, index) => (
                  <Flex key={index}>
                    <Text
                      mb={3}
                      mr={3}
                      fontSize="20px"
                      sx={{
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                        whiteSpace: "nowrap",
                        width: "500px",
                      }}
                      textAlign="start"
                      color={
                        savequestion === true &&
                        savenumber.includes(index) === true
                          ? "green"
                          : "#cccc00"
                      }
                      mt={4}
                    >
                      {question}
                    </Text>
                    {savequestion === true &&
                    savenumber.includes(index) === true ? (
                      ""
                    ) : (
                      <>
                        <Button
                          mx="auto"
                          mr={2}
                          mt={4}
                          p={2}
                          sx={{
                            display: "flex",
                            justifyContent: "center",
                            border: "1px solid #e6e600",
                            borderRadius: "20px",
                            cursor: "pointer",
                          }}
                          width={1 / 4}
                          fontSize={2}
                          backgroundColor="#e6e600"
                          type="button"
                          onClick={() => usequestion(index, "old")}
                        >
                          <Text
                            sx={{
                              color: " #000",
                              fontSize: "18px",
                            }}
                          >
                            ใช้คำถามที่มีอยู่แล้ว
                          </Text>
                        </Button>

                        <Button
                          mx="auto"
                          mr={2}
                          mt={4}
                          p={2}
                          sx={{
                            display: "flex",
                            justifyContent: "center",
                            border: "1px solid #5E8C61",
                            borderRadius: "20px",
                            cursor: "pointer",
                          }}
                          width={1 / 4}
                          fontSize={2}
                          backgroundColor="green"
                          type="button"
                          onClick={() => usequestion(index, "new")}
                        >
                          <Text
                            sx={{
                              color: " #000",
                              fontSize: "18px",
                            }}
                          >
                            ใช้คำถามของตน
                          </Text>
                        </Button>
                      </>
                    )}
                  </Flex>
                ))}
              </Scrollbars>
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
                  disabled={
                    samequestion.length === savenumber.length ? "" : "disabled"
                  }
                  width={3 / 4}
                  fontSize={2}
                  backgroundColor={
                    samequestion.length === savenumber.length ? "green" : "gray"
                  }
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
            </>
          ) : (
            <Box>
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
        </Box>
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

      <Header />

      <Flex mt={3}>
        <Box
          width={[1, 2 / 5]}
          px={4}
          ml={4}
          sx={{
            backgroundColor: "white",
            overflow: "hidden",
            height: "800px",
            borderRadius: "10px",
            display: "flex",
            flexDirection: "column",
          }}
        >
          <Text
            sx={{ display: "flex", justifyContent: "center", fontSize: "20px" }}
            mt={4}
          >
            ยังไม่มีคำถามที่ชื่นชอบ
          </Text>
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
                  backgroundColor="white"
                  sx={{
                    borderRadius: "10px",
                    marginBottom: "20px",
                    postition: "relative",
                  }}
                >
                  <Box
                    backgroundColor="white"
                    sx={{ borderRadius: "10px" }}
                    py={2}
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
                          // border:
                          //   data.correct === "1"
                          //     ? "1px solid #59A96A"
                          //     : "1px solid #0A2239",
                          borderRadius: "10px",
                          backgroundColor:
                            data.correct === "1" ? "#59A96A" : "#fff",
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
                          // border:
                          //   data.correct === "2"
                          //     ? "1px solid #59A96A"
                          //     : "1px solid #0A2239",
                          borderRadius: "10px",
                          backgroundColor:
                            data.correct === "2" ? "#59A96A" : "#fff",
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
                            data.correct === "3" ? "#59A96A" : "#fff",
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
                            data.correct === "4" ? "#59A96A" : "#fff",
                          color: "black",
                          textAlign: "left",
                        }}
                      >
                        <Text ref={refchoice4[index]}>{data.choice4}</Text>
                      </Box>
                    </Flex>
                    {/* <BiEdit
                      style={{
                        position: "absolute",
                        marginTop: "5px",
                        right: 50,
                        width: "25px",
                        height: "25px",
                        cursor: "pointer",
                      }}
                    /> */}
                    <BsTrash
                      style={{
                        position: "absolute",
                        marginTop: "5px",
                        right: 10,
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
