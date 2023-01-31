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
const CreateQuestion = () => {
  const { currentUser, logout } = useAuth();
  const { addToast } = useToasts();
  const history = useHistory();
  const [dataquestion, setDataQuestion] = useState([]);
  const [open, setOpen] = useState(false);
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
  }, [dataquestion]);

  useEffect(() => {
    if (question) {
      setDataQuestion([...question]);
    }
  }, []);
  if (!currentUser) {
    return <Redirect to="/login" />;
  }
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);
  const createnewquestion = () => {
    const sent = {
      question: questiontopic.current.value,
      choice: {
        choice1: questionchoice1.current.value,
        choice2: questionchoice2.current.value,
        choice3: questionchoice3.current.value,
        choice4: questionchoice4.current.value,
      },
      correct: correctchoice.current.value,
    };

    const unique = Array.from(new Set(dataquestion));

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
    var question = {};
    const allquestion = [];
    refs.map((refquestion, index) => {
      question = {
        question: refquestion.current.innerText,
        choice: {
          choice1: refchoice1[index].current.innerText,
          choice2: refchoice2[index].current.innerText,
          choice3: refchoice3[index].current.innerText,
          choice4: refchoice4[index].current.innerText,
        },
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
                  backgroundColor: "#9BDEAC",
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
              backgroundColor="#9BDEAC"
              type="button"
              onClick={sentsub}
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
                    sx={{ borderRadius: "10px", border: "1px solid #0A2239" }}
                    pt={4}
                    pb={2}
                    px={4}
                    mb={2}
                  >
                    <Text mb={4} ref={refs[index]}>
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
                          border:
                            data.correct === "1"
                              ? "1px solid #59A96A"
                              : "1px solid #0A2239",
                          borderRadius: "10px",
                          backgroundColor:
                            data.correct === "1" ? "#59A96A" : "#fff",
                          color: "black",
                          textAlign: "left",
                        }}
                      >
                        <Text ref={refchoice1[index]}>
                          {data.choice.choice1}
                        </Text>
                      </Box>

                      <Box
                        width={2 / 4}
                        p={3}
                        mx={4}
                        my={2}
                        sx={{
                          border:
                            data.correct === "2"
                              ? "1px solid #59A96A"
                              : "1px solid #0A2239",
                          borderRadius: "10px",
                          backgroundColor:
                            data.correct === "2" ? "#59A96A" : "#fff",
                          color: "black",
                          textAlign: "left",
                        }}
                      >
                        <Text ref={refchoice2[index]}>
                          {data.choice.choice2}
                        </Text>
                      </Box>
                    </Flex>

                    <Flex>
                      <Box
                        width={2 / 4}
                        p={3}
                        mx={4}
                        my={2}
                        sx={{
                          border:
                            data.correct === "3"
                              ? "1px solid #59A96A"
                              : "1px solid #0A2239",
                          borderRadius: "10px",
                          backgroundColor:
                            data.correct === "3" ? "#59A96A" : "#fff",
                          color: "black",
                          textAlign: "left",
                        }}
                      >
                        <Text ref={refchoice3[index]}>
                          {data.choice.choice3}
                        </Text>
                      </Box>

                      <Box
                        width={2 / 4}
                        p={3}
                        mx={4}
                        my={2}
                        sx={{
                          border:
                            data.correct === "4"
                              ? "1px solid #59A96A"
                              : "1px solid #0A2239",
                          borderRadius: "10px",
                          backgroundColor:
                            data.correct === "4" ? "#59A96A" : "#fff",
                          color: "black",
                          textAlign: "left",
                        }}
                      >
                        <Text ref={refchoice4[index]}>
                          {data.choice.choice4}
                        </Text>
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
