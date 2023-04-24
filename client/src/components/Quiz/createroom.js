import React, { useEffect, useState, useRef } from "react";
import { Redirect, useHistory } from "react-router-dom";
import { Box, Heading, Text, Card, Flex, Link, Button, Image } from "rebass";
import { Label, Input, Select, Textarea, Radio, Checkbox } from "@rebass/forms";
import { Scrollbars } from "react-custom-scrollbars";
import { Modal, Typography } from "@mui/material";
import { useAuth } from "../../contexts/AuthContext";
import { useToasts } from "react-toast-notifications";
import api from "../../api";
import Header from "../Header";
import Mobileheader from "../Mobileheader";

const Createroom = () => {
  const { currentUser, createroom } = useAuth();
  const history = useHistory();
  const { addToast } = useToasts();
  const [allcategory, setAllcategory] = useState([]);
  const [allquiz, setAllquiz] = useState([]);
  const [loading, setLoading] = useState(true);
  const [openmodal, setOpenmodal] = useState(false);
  const [name, setName] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [errorname, setErrorname] = useState(false);
  const [errorstartdate, setErrorstartdate] = useState(false);
  const [errorenddate, setErrorenddate] = useState(false);
  const [errorquiz, setErrorquiz] = useState(false);
  const [quizindex, setQuizindex] = useState(null);
  const [quizid, setQuizid] = useState(0);
  const [numRooms, setNumRooms] = useState(1);
  const [rooms, setRooms] = useState([]);
  const [isDesktop, setIsDesktop] = useState(window.innerWidth > 768);
  const [selecteQuiz, setSelectquiz] = useState(true);
  let favouriteQuiz =
    JSON.parse(window.localStorage.getItem("Favourite Quiz")) || [];
  let showallquiz = selecteQuiz ? allquiz : favouriteQuiz;
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
    const newRooms = [];
    for (let i = 0; i < numRooms; i++) {
      const randomString = generateRandomString(5);
      const roomId = `${randomString}`;
      newRooms.push(roomId);
    }
    setRooms(newRooms);
  }, [numRooms]);

  useEffect(() => {
    console.log("Showing my Quiz", allquiz);
    console.log("All category", allcategory);
    if (allquiz && allquiz.length > 0) {
      setQuizid(allquiz[0].group_id);
    }
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

  const handleStartDateChange = (e) => {
    setStartDate(e.target.value);
  };
  const handleEndDateChange = (e) => {
    setEndDate(e.target.value);
  };
  const handleRoomChange = (e) => {
    setName(e.target.value);
  };
  const modalsaveOpen = () => setOpenmodal(true);
  const modalsaveClose = () => setOpenmodal(false);

  function handleSessionChange(event) {
    setNumRooms(parseInt(event.target.value));
  }

  function generateRandomString(length) {
    const characters = "abcdefghijklmnopqrstuvwxyz0123456789";
    let result = "";
    for (let i = 0; i < length; i++) {
      result += characters.charAt(
        Math.floor(Math.random() * characters.length)
      );
    }
    return result;
  }

  const createandsave = () => {
    if (name === "") {
      addToast("กรุณากรอกชื่อห้อง", {
        appearance: "error",
        autoDismiss: true,
      });
      setErrorname(true);
      setOpenmodal(false);
    } else if (startDate === "") {
      addToast("กรุณาเลือกวันที่เริ่ม", {
        appearance: "error",
        autoDismiss: true,
      });
      setErrorstartdate(true);
      setOpenmodal(false);
    } else if (endDate === "") {
      addToast("กรุณาเลือกวันที่สิ้นสุด", {
        appearance: "error",
        autoDismiss: true,
      });
      setErrorenddate(true);
      setOpenmodal(false);
    } else if (quizindex === null) {
      addToast("กรุณาเลือกแบบทดสอบ", {
        appearance: "error",
        autoDismiss: true,
      });
      setErrorquiz(true);
      setOpenmodal(false);
    } else {
      setErrorname(false);
      setErrorstartdate(false);
      setErrorenddate(false);
      console.log(quizid);
      createroom(name, startDate, endDate, quizid, rooms).then(() => {
        history.push({
          pathname: `/`,
        });
      });
    }
  };

  if (!currentUser) {
    return <Redirect to="/login" />;
  }
  const usequiz = (index, quizidindex) => {
    setQuizindex(index);
    setQuizid(quizidindex);
  };

  return (
    <Box
      minHeight="100vh"
      sx={{
        backgroundColor: "rgb(240, 242, 245);",
      }}
    >
      {isDesktop ? <Header /> : <Mobileheader />}
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
          width={1 / 3}
          px={4}
          pt={4}
        >
          <Text sx={{ fontSize: "20px" }}>ยืนยันการบันทึก?</Text>

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
              width={3 / 4}
              fontSize={2}
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
              width={3 / 4}
              fontSize={2}
              backgroundColor="green"
              type="button"
              onClick={createandsave}
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

      <Flex mt={4} ml={[0, 4]} flexDirection={["column", "row"]}>
        <Box
          width={[1, 1 / 5]}
          ml={2}
          px={4}
          sx={{
            backgroundColor: "rgba(255,255,255,1)",
            borderBottom: "1px solid rgba(255,255,255,0.50)",
            height: ["100%", "800px"],
            borderRadius: "10px",
            overflowY: "scroll",
            overflowX: "hidden",
            overscrollBehaviorY: "contain",
            "&::-webkit-scrollbar": {
              width: "0px",
              background: "transparent",
            },
            msOverflowStyle: "none",
            scrollbarWidth: "none",
            WebkitOverflowScrolling: "touch",
          }}
        >
          <Flex flexDirection="column" height="100%">
            <Box flexGrow={1}>
              <Flex pt={4}>
                <Box width={1 / 4} mr={4}>
                  <Label htmlFor="name" fontSize="16px">
                    ชื่อห้อง
                    <span style={{ color: "red", fontSize: "18px" }}>*</span>
                  </Label>
                </Box>
                <Box width={3 / 4}>
                  <Input
                    id="name"
                    name="name"
                    height="30px"
                    pl={1}
                    value={name}
                    onChange={handleRoomChange}
                    onClick={() => setErrorname(false)}
                    sx={{
                      border: errorname ? "1px solid red" : "1px solid black",
                    }}
                  />
                </Box>
              </Flex>

              <Flex pt={4}>
                <Box width={1 / 4} mr={4}>
                  <Label htmlFor="name" fontSize="16px">
                    เริ่มสร้าง
                    <span style={{ color: "red", fontSize: "18px" }}>*</span>
                  </Label>
                </Box>
                <Box width={3 / 4}>
                  <Input
                    type="date"
                    value={startDate}
                    onChange={handleStartDateChange}
                    min={new Date().toISOString().split("T")[0]}
                    id="name"
                    name="name"
                    height="30px"
                    pl={1}
                    onClick={() => setErrorstartdate(false)}
                    sx={{
                      border: errorstartdate
                        ? "1px solid red"
                        : "1px solid black",
                    }}
                  />
                </Box>
              </Flex>

              <Flex pt={4}>
                <Box width={1 / 4} mr={4}>
                  <Label htmlFor="name" fontSize="16px">
                    สิ้นสุด
                    <span style={{ color: "red", fontSize: "18px" }}>*</span>
                  </Label>
                </Box>
                <Box width={3 / 4}>
                  <Input
                    type="date"
                    min={startDate}
                    value={endDate}
                    onChange={handleEndDateChange}
                    onClick={() => setErrorenddate(false)}
                    height="30px"
                    pl={1}
                    sx={{
                      border: errorenddate
                        ? "1px solid red"
                        : "1px solid black",
                    }}
                  />
                </Box>
              </Flex>

              <Button
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
                backgroundColor={selecteQuiz ? "green" : "white"}
                type="button"
                onClick={() => setSelectquiz(true)}
              >
                <Text
                  sx={{
                    color: " #000",
                    fontSize: "20px",
                  }}
                >
                  แบบทดสอบของฉัน
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
                width={1}
                fontSize={2}
                backgroundColor={selecteQuiz ? "white" : "green"}
                type="button"
                onClick={() => setSelectquiz(false)}
              >
                <Text
                  sx={{
                    color: " #000",
                    fontSize: "20px",
                  }}
                >
                  แบบทดสอบที่ชื่นชอบ
                </Text>
              </Button>

              <Flex>
                <Box width={1 / 2} mr={4} mt={4}>
                  <Label htmlFor="name" fontSize="16px">
                    จำนวนเซคชั่น
                  </Label>
                </Box>
                <Box width={1 / 2} px={2} mt={4}>
                  <Select
                    id="session"
                    name="session"
                    height="35px"
                    defaultValue={numRooms}
                    onChange={handleSessionChange}
                  >
                    <option value="1">1</option>
                    <option value="2">2</option>
                    <option value="3">3</option>
                    <option value="4">4</option>
                    <option value="5">5</option>
                  </Select>
                </Box>
              </Flex>
              {rooms.map((roomId, index) => (
                <Text fontSize="20px" my={4} key={roomId}>
                  Session {index + 1} : {roomId}
                </Text>
              ))}
              {allquiz.length === 0 ? (
                <Text fontSize="20px" color="red" my={3}>
                  <span style={{ fontSize: "18px" }}>*</span>
                  กรุณาเลือกสร้างแบบทดสอบก่อน
                </Text>
              ) : (
                ""
              )}
              {quizindex !== null ? (
                ""
              ) : (
                <Text fontSize="20px" color="red">
                  <span style={{ fontSize: "18px" }}>*</span>
                  กรุณาเลือกแบบทดสอบสำหรับการสร้างห้อง
                </Text>
              )}
            </Box>

            <Flex justifyContent="space-between">
              <Button
                mx="auto"
                mr={4}
                mb={4}
                p={12}
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
                mb={4}
                p={12}
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
                  บันทึก
                </Text>
              </Button>
            </Flex>
          </Flex>
        </Box>
        <Box
          width={[1, 1]}
          mx={4}
          sx={{
            // backgroundColor: "rgba(255,255,255,1)",
            borderBottom: "1px solid rgba(255,255,255,0.50)",
            height: "800px",
            borderRadius: "10px",
            display: "flex",
            flexDirection: "column",
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
          <Box
            width={[4 / 5, 1]}
            ml={[0, 4]}
            sx={{
              backgroundColor: "rgba(255,255,255,1)",
              borderBottom: "1px solid rgba(255,255,255,0.50)",
              height: "90px",
              borderRadius: "10px",
              display: "flex",
              alignItems: "center",
              paddingLeft: "20px",
              flexShrink: 0,
            }}
          >
            <Flex>
              <Text fontSize="20px" color={errorquiz ? "red" : "black"}>
                แบบทดสอบที่เลือก :{" "}
              </Text>
              {showallquiz.map((quiz, index) => {
                if (index === quizindex) {
                  return (
                    <Text fontSize="20px" key={index}>
                      {quiz.g_name}
                    </Text>
                  );
                }
              })}
            </Flex>
          </Box>
          <Flex
            mt={3}
            ml={[0, 3]}
            sx={{
              flexWrap: "wrap",
              justifyContent: "flex-start",
              "& > div": {
                width: ["40%", "30%"],
                margin: "1%",
              },
            }}
          >
            {showallquiz.map((quiz, index) => {
              const base64ImageData = Buffer.from(quiz.question_image).toString(
                "base64"
              );
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
                    borderRadius: "10px",
                    overflow: "hidden",
                    cursor: "pointer",
                    alignItems: "flex-start",
                    zIndex: 3,
                  }}
                  mx={4}
                  my={3}
                  onMouseDown={(e) => e.preventDefault()}
                  onClick={() => usequiz(index, quiz.group_id)}
                >
                  <Box
                    sx={{
                      position: "absolute",
                      top: 0,
                      left: 0,
                      width: "100%",
                      height: "100%",
                      backgroundColor:
                        quizindex === index ? "rgba(0, 240, 0, 0.5)" : "",
                      opacity: 1,
                      zIndex: 1,
                    }}
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
                          zIndex: 2,
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
                          zIndex: 2,
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
          </Flex>
        </Box>
      </Flex>
    </Box>
  );
};

export default Createroom;
