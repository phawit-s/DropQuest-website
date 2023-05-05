import React, { useEffect, useState, useRef } from "react";
import { Redirect, useHistory } from "react-router-dom";
import { Box, Text, Flex, Button } from "rebass";
import { Label, Input, Select, Textarea } from "@rebass/forms";
import { Scrollbars } from "react-custom-scrollbars";
import { Modal } from "@mui/material";
import { useAuth } from "../../contexts/AuthContext";
import { useToasts } from "react-toast-notifications";
import api from "../../api";
import Header from "../Header";
import Mobileheader from "../Mobileheader";

const CreateQuiz = () => {
  const { currentUser, editquiz, savequiz } = useAuth();
  const { addToast } = useToasts();
  const history = useHistory();
  const quizname = useRef();
  const category = useRef();
  const timer = useRef();
  const score = useRef();
  const description = useRef();
  const [photo, setPhoto] = useState(null);
  const [alltopic, setAlltopic] = useState([]);
  const [questiondata, setQuestiondata] = useState([]);
  const [quizdata, setQuizdata] = useState("");
  const [open, setOpen] = useState(false);
  const [openmodal, setOpenmodal] = useState(false);
  const [errorquizname, setErrorQuizname] = useState(false);
  const [errortime, setErrorTime] = useState(false);
  const [errorscore, setErrorScore] = useState(false);
  const [errordescription, setErrorDescription] = useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);
  const modalsaveOpen = () => setOpenmodal(true);
  const modalsaveClose = () => setOpenmodal(false);
  const getproductstorage = window.localStorage.getItem("Question");
  const question = getproductstorage ? JSON.parse(getproductstorage) : [];
  const getQuizdetail = window.localStorage.getItem("EditQuiz");
  const quizedit = getQuizdetail ? JSON.parse(getQuizdetail) : [];
  const todayDate = new Date().toISOString().slice(0, 10);
  const quizid = window.localStorage.getItem("Edit id");
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
    console.log("Loading");
  }, [questiondata, quizdata, alltopic]);

  useEffect(() => {
    if (question) {
      setQuestiondata([...question]);
    }
    if (quizedit) {
      setQuizdata(quizedit);
    }
  }, []);

  useEffect(() => {
    api
      .post("/allquiztopic")
      .then((response) => {
        setAlltopic(response.data);
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);

  if (!currentUser) {
    return <Redirect to="/login" />;
  }

  const onImageChange = (event) => {
    if (event.target.files && event.target.files[0]) {
      let img = event.target.files[0];
      setPhoto(img);
    }
  };

  const canceledit = () => {
    window.localStorage.removeItem("Question");
    window.localStorage.removeItem("EditQuiz");
    history.push({
      pathname: `/`,
    });
  };

  const updateandsave = () => {
    const updatedata = {
      groupname: quizname.current.value,
      category: category.current.value,
      releasedate: todayDate,
      score: score.current.value,
      timer: timer.current.value,
      description: description.current.value,
    };

    const result = alltopic.find(
      ({ g_name }) => g_name === quizname.current.value
    );
    const samename = quizdata.find(
      ({ g_name }) => g_name === quizname.current.value
    );
    if (quizname.current.value === "") {
      addToast("กรุณากรอกชื่อแบบทดสอบ", {
        appearance: "error",
        autoDismiss: true,
      });
      setErrorQuizname(!errorquizname);
      setOpenmodal(false);
    } else if (result.length !== undefined && samename === undefined) {
      addToast("ชื่อแบบทดสอบถูกใช้ไปแล้ว", {
        appearance: "error",
        autoDismiss: true,
      });
      setErrorQuizname(!errorquizname);
      setOpenmodal(false);
    } else if (score.current.value === "") {
      addToast("กรุณากรอกระยะเวลาของแต่ละข้อ", {
        appearance: "error",
        autoDismiss: true,
      });
      setErrorScore(!errorscore);
      setOpenmodal(false);
    } else if (timer.current.value === "") {
      addToast("กรุณากรอกคะแนนของแต่ละข้อ", {
        appearance: "error",
        autoDismiss: true,
      });
      setErrorTime(!errortime);
      setOpenmodal(false);
    } else if (description.current.value === "") {
      addToast("กรุณากรอกคำอธิบาย", {
        appearance: "error",
        autoDismiss: true,
      });
      setErrorDescription(!errordescription);
      setOpenmodal(false);
    } else if (questiondata.length === 0) {
      alert("คำถามยังไม่ถูกสร้าง");
      setOpenmodal(false);
    } else {
      setErrorQuizname(true);
      setErrorScore(true);
      setErrorTime(true);
      setErrorDescription(true);
      editquiz(updatedata, question, quizid).then(() => {
        history.push({
          pathname: `/`,
        });
      });
    }
  };

  const createandsave = () => {
    const quizdata = {
      groupname: quizname.current.value,
      category: category.current.value,
      releasedate: todayDate,
      score: score.current.value,
      timer: timer.current.value,
      description: description.current.value,
    };

    const result = alltopic.find(
      ({ g_name }) => g_name === quizname.current.value
    );
    if (quizname.current.value === "") {
      addToast("กรุณากรอกชื่อแบบทดสอบ", {
        appearance: "error",
        autoDismiss: true,
      });
      setErrorQuizname(!errorquizname);
      setOpenmodal(false);
    } else if (result !== undefined) {
      addToast("ชื่อแบบทดสอบถูกใช้ไปแล้ว", {
        appearance: "error",
        autoDismiss: true,
      });
      setErrorQuizname(!errorquizname);
      setOpenmodal(false);
    } else if (score.current.value === "") {
      addToast("กรุณากรอกระยะเวลาของแต่ละข้อ", {
        appearance: "error",
        autoDismiss: true,
      });
      setErrorScore(!errorscore);
      setOpenmodal(false);
    } else if (timer.current.value === "") {
      addToast("กรุณากรอกคะแนนของแต่ละข้อ", {
        appearance: "error",
        autoDismiss: true,
      });
      setErrorTime(!errortime);
      setOpenmodal(false);
    } else if (description.current.value === "") {
      addToast("กรุณากรอกคำอธิบาย", {
        appearance: "error",
        autoDismiss: true,
      });
      setErrorDescription(!errordescription);
      setOpenmodal(false);
    } else if (questiondata.length === 0) {
      alert("คำถามยังไม่ถูกสร้าง");
      setOpenmodal(false);
    } else {
      setErrorQuizname(true);
      setErrorScore(true);
      setErrorTime(true);
      setErrorDescription(true);
      savequiz(quizdata, question, photo).then(() => {
        history.push({
          pathname: `/`,
        });
        window.location.reload();
      });
    }
  };

  const cancelcreate = () => {
    window.localStorage.removeItem("Question");
    history.push({
      pathname: `/`,
    });
  };
  return (
    <Box
      minHeight="100vh"
      sx={{
        backgroundColor: "rgb(240, 242, 245);",
      }}
    >
      {isDesktop ? <Header /> : <Mobileheader />}
      <Modal open={open} onClose={handleClose}>
        <Box
          sx={{
            backgroundColor: "#daddd8",
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            textAlign: "start",
            borderRadius: "20px",
          }}
          height="200px"
          width={1 / 3}
          px={4}
          pt={4}
        >
          <Text sx={{ fontSize: "20px" }}>ยกเลิกการสร้าง?</Text>

          <Flex>
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
              backgroundColor="red"
              type="button"
              onClick={handleClose}
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
                border: "1px solid #C1D7AE",
                borderRadius: "20px",
                cursor: "pointer",
              }}
              width={3 / 4}
              fontSize={2}
              backgroundColor="#C1D7AE"
              type="button"
              onClick={quizdata.length !== 0 ? canceledit : cancelcreate}
            >
              <Text
                sx={{
                  color: " #000",
                  fontSize: "20px",
                }}
              >
                ตกลง
              </Text>
            </Button>
          </Flex>
        </Box>
      </Modal>

      <Modal open={openmodal} onClose={modalsaveClose}>
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
          height="200px"
          width={[2 / 3, 1 / 3]}
          px={4}
          pt={4}
        >
          <Text sx={{ fontSize: "20px" }}>
            {quizdata.length !== 0 ? "ยืนยันการอัพเดท?" : "ยืนยันการบันทึก?"}
          </Text>

          <Flex>
            <Button
              mx="auto"
              mr={4}
              mt={4}
              p={14}
              sx={{
                display: "flex",
                justifyContent: "center",
                border: "1px solid #daddd8",
                borderRadius: "20px",
                cursor: "pointer",
              }}
              width={[1, 3 / 4]}
              fontSize={[1, 2]}
              backgroundColor="#daddd8"
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
              width={[1, 3 / 4]}
              fontSize={[1, 2]}
              backgroundColor="green"
              type="button"
              onClick={quizdata.length !== 0 ? updateandsave : createandsave}
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
      </Modal>

      <Flex mt={3} flexDirection={["column", "column", "row"]}>
        <Box
          width={[1, 3 / 4, 1 / 5]}
          px={4}
          ml={[1, 4, 4]}
          mb={[4, 4, 0]}
          sx={{
            backgroundColor: "rgba(255,255,255,0.75)",
            // backdropFilter: "blur(15px)",
            border: "1px solid #fff",
            borderBottom: "1px solid rgba(255,255,255,0.50)",
            borderRight: "1px solid rgba(255,255,255,0.50)",
            boxShadow: "0 25px 50px rgba(0,0,0,0.1)",
            height: "800px",
            borderRadius: "10px",
          }}
        >
          <Flex pt={4}>
            <Box width={1 / 4} mr={4}>
              <Label htmlFor="name" fontSize="16px">
                ชื่อแบบทดสอบ
                <span style={{ color: "red", fontSize: "18px" }}>*</span>
              </Label>
            </Box>
            <Box width={3 / 4}>
              <Input
                defaultValue={quizdata.length !== 0 ? quizdata[0].g_name : ""}
                id="name"
                name="name"
                height="30px"
                pl={1}
                ref={quizname}
                sx={{
                  border: errorquizname ? "1px solid red" : "1px solid black",
                }}
              />
            </Box>
          </Flex>

          <Flex pt={4}>
            <Box width={1 / 4} mr={4}>
              <Label htmlFor="category" fontSize="16px">
                หมวดหมู่
                <span style={{ color: "red", fontSize: "18px" }}>*</span>
              </Label>
            </Box>
            <Box width={3 / 4}>
              <Select
                id="category"
                name="category"
                defaultValue={
                  quizdata.length !== 0
                    ? quizdata[0].category_id.toString()
                    : ""
                }
                height="40px"
                ref={category}
              >
                <option value="1">ภาษาไทย</option>
                <option value="2">คณิตศาสตร์</option>
                <option value="3">วิทยาศาสตร์</option>
                <option value="4">สังคมศึกษา</option>
                <option value="5">ประวัติศาสตร์</option>
                <option value="6">สุขศึกษา</option>
                <option value="7">ศิลปะ</option>
                <option value="8">การงานอาชีพ</option>
                <option value="9">ภาษาอังกฤษ</option>
              </Select>
            </Box>
          </Flex>

          <Flex pt={4}>
            <Box width={1 / 4} mr={4}>
              <Label htmlFor="timer" fontSize="16px">
                {"ระยะเวลา(วินาที)"}
                <span style={{ color: "red", fontSize: "18px" }}>*</span>
              </Label>
            </Box>
            <Box width={3 / 4}>
              <Input
                id="timer"
                defaultValue={
                  quizdata.length !== 0 ? quizdata[0].question_time : ""
                }
                name="timer"
                height="30px"
                pl={1}
                ref={timer}
                type="number"
                sx={{
                  border: errortime ? "1px solid red" : "1px solid black",
                }}
              />
            </Box>
          </Flex>

          <Flex pt={4}>
            <Box width={1 / 4} mr={4}>
              <Label htmlFor="score" fontSize="16px">
                คะแนนต่อข้อ
                <span style={{ color: "red", fontSize: "18px" }}>*</span>
              </Label>
            </Box>
            <Box width={3 / 4}>
              <Input
                id="score"
                defaultValue={
                  quizdata.length !== 0 ? quizdata[0].question_score : ""
                }
                name="score"
                height="30px"
                pl={1}
                ref={score}
                type="number"
                sx={{
                  border: errorscore ? "1px solid red" : "1px solid black",
                }}
              />
            </Box>
          </Flex>

          <Flex pt={4}>
            <Box width={1 / 4} mr={4}>
              <Label htmlFor="thumbnail" fontSize="16px">
                Thumbnail
                <span style={{ color: "red", fontSize: "18px" }}>*</span>
              </Label>
            </Box>
            <Box width={3 / 4}>
              <Input
                disabled={quizdata.length !== 0 ? "disabled" : ""}
                height="40px"
                type="file"
                id="thumbnail"
                name="thumbnail"
                accept="image/png, image/jpeg"
                onChange={onImageChange}
              />
            </Box>
          </Flex>

          <Flex pt={4}>
            <Box width={1 / 4} mr={4}>
              <Label htmlFor="description" fontSize="16px">
                คำอธิบาย
                <span style={{ color: "red", fontSize: "18px" }}>*</span>
              </Label>
            </Box>
            <Box width={3 / 4}>
              <Textarea
                defaultValue={
                  quizdata.length !== 0 ? quizdata[0].question_description : ""
                }
                height="250px"
                id="description"
                name="description"
                ref={description}
                sx={{
                  border: errordescription
                    ? "1px solid red"
                    : "1px solid black",
                  resize: "none",
                }}
              />
            </Box>
          </Flex>
          <Flex>
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
              backgroundColor="#D10000"
              type="button"
              onClick={handleOpen}
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
              mt={4}
              p={14}
              sx={{
                display: "flex",
                borderRadius: "20px",
                justifyContent: "center",
                cursor: "pointer",
              }}
              width={3 / 4}
              fontSize={2}
              backgroundColor="green"
              type="button"
              onClick={modalsaveOpen}
            >
              <Text
                sx={{
                  color: " #fff",
                  fontSize: "20px",
                }}
              >
                {quizdata.length !== 0 ? "อัพเดท" : "บันทึก"}
              </Text>
            </Button>
          </Flex>
        </Box>

        <Box
          width={[1, 3 / 4, 4 / 5]}
          ml={[1, 4]}
          mr={[0, 4]}
          mb={[4, 0]}
          sx={{
            backgroundColor: "rgba(255,255,255,0.75)",
            borderBottom: "1px solid rgba(255,255,255,0.75)",
            height: "800px",
            borderRadius: "10px",
          }}
        >
          <Flex sx={{ justifyContent: "space-between" }}>
            <Text sx={{ margin: "30px", fontSize: "20px" }}>
              {"จำนวนข้อปัจจุบัน : " + questiondata.length + " ข้อ"}
            </Text>
            <Button
              onClick={() =>
                history.push({
                  pathname: `/createquestion`,
                })
              }
              sx={{
                border: "1px solid #FFD600",
                borderRadius: "10px",
                color: "#000",
                height: "48px",
                margin: "20px",
                backgroundColor: "#FFD600",
                cursor: "pointer",
              }}
            >
              เพิ่ม/แก้ไขคำถาม
            </Button>
          </Flex>
          <Box
            style={{
              width: "100%",
              height: "85%",
              overflow: "hidden",
            }}
          >
            <Scrollbars
              style={{ width: "100%", height: "100%", overflow: "hidden" }}
            >
              {questiondata.map((data, index) => {
                return (
                  <Box
                    p={3}
                    my={3}
                    mx={3}
                    key={index}
                    sx={{
                      backgroundColor: "rgba(255,255,255,0.50)",
                      // backdropFilter: "blur(15px)",
                      border: "1px solid #fff",
                      borderBottom: "1px solid rgba(255,255,255,0.50)",
                      borderRight: "1px solid rgba(255,255,255,0.50)",
                      boxShadow: "0 25px 50px rgba(0,0,0,0.1)",
                      gap: "30px",
                      borderRadius: "20px",
                    }}
                  >
                    <Box sx={{ borderRadius: "10px" }} py={2} px={4} mb={2}>
                      <Text mb={4}>{data.question_name}</Text>
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
                              data.correct_choice === "1" ||
                              data.correct_choice === 1
                                ? "1px solid #59A96A"
                                : "1px solid #0A2239",
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
                          <Text>{data.choice1}</Text>
                        </Box>

                        <Box
                          width={2 / 4}
                          p={3}
                          mx={4}
                          my={2}
                          sx={{
                            border:
                              data.correct_choice === "2" ||
                              data.correct_choice === 2
                                ? "1px solid #59A96A"
                                : "1px solid #0A2239",
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
                          <Text>{data.choice2}</Text>
                        </Box>
                      </Flex>

                      <Flex>
                        <Box
                          width={2 / 4}
                          p={3}
                          mx={4}
                          my={2}
                          sx={{
                            cursor: "pointer",
                            border:
                              data.correct_choice === "3" ||
                              data.correct_choice === 3
                                ? "1px solid #59A96A"
                                : "1px solid #0A2239",
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
                          <Text>{data.choice3}</Text>
                        </Box>

                        <Box
                          width={2 / 4}
                          p={3}
                          mx={4}
                          my={2}
                          sx={{
                            cursor: "pointer",
                            border:
                              data.correct_choice === "4" ||
                              data.correct_choice === 4
                                ? "1px solid #59A96A"
                                : "1px solid #0A2239",
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
                          <Text>{data.choice4}</Text>
                        </Box>
                      </Flex>
                    </Box>
                  </Box>
                );
              })}
            </Scrollbars>
          </Box>
        </Box>
      </Flex>
    </Box>
  );
};

export default CreateQuiz;
