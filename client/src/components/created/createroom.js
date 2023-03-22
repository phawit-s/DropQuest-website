import React, { useEffect, useState } from "react";
import { useLocation, Redirect, useHistory } from "react-router-dom";
import { Box, Heading, Text, Card, Flex, Link, Button, Image } from "rebass";
import { Label, Input, Select, Textarea, Radio, Checkbox } from "@rebass/forms";
import { Scrollbars } from "react-custom-scrollbars";
import { Modal, Typography } from "@mui/material";
import { useAuth } from "../../contexts/AuthContext";
import Header from "../Header";
import api from "../../api";
import { AiOutlineStar, AiFillStar } from "react-icons/ai";

const Createroom = () => {
  const { currentUser } = useAuth();
  const history = useHistory();
  const [selectedcategory, setSelectedcategory] = useState(0);
  const [allcategory, setAllcategory] = useState([]);
  const [category, setCategory] = useState("all");
  const [allquiz, setAllquiz] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [quizindex, setQuizindex] = useState(0);

  const handleStartDateChange = (e) => {
    setStartDate(e.target.value);
  };

  const handleEndDateChange = (e) => {
    setEndDate(e.target.value);
  };
  let filteredQuizzes = allquiz;

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
  const usequiz = (index) => {
    setQuizindex(index);
  };

  return (
    <Box
      minHeight="100vh"
      sx={{
        backgroundColor: "rgba(134, 248, 255, 0.13);",
      }}
    >
      <Header />

      <Flex mt={4} ml={[0, 4]} flexDirection={["column", "row"]}>
        <Box
          width={[1, 1 / 5]}
          ml={2}
          px={4}
          sx={{
            backgroundColor: "rgba(255,255,255,1)",
            borderBottom: "1px solid rgba(255,255,255,0.50)",
            height: "100%",
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
          <Flex pt={4}>
            <Box width={1 / 4} mr={4}>
              <Label htmlFor="name" fontSize="16px">
                ชื่อแบบทดสอบ
                <span style={{ color: "red", fontSize: "18px" }}>*</span>
              </Label>
            </Box>
            <Box width={3 / 4}>
              <Input
                id="name"
                name="name"
                height="30px"
                pl={1}
                // ref={quizname}
                sx={{
                  border: "1px solid black",
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
                // ref={quizname}
                sx={{
                  border: "1px solid black",
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
                height="30px"
                pl={1}
                // ref={quizname}
                sx={{
                  border: "1px solid black",
                }}
              />
            </Box>
          </Flex>

          <Flex>
            <Button
              mx="auto"
              mr={4}
              mt={4}
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
              mt={4}
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
              // onClick={modalsaveOpen}
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
          width={[1, 1]}
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
            }}
          >
            {filteredQuizzes.map((quiz, index) => {
              if (index === quizindex) {
                return (
                  <Text fontSize="20px">แบบทดสอบที่เลือก : {quiz.g_name}</Text>
                );
              }
            })}
          </Box>
          {filteredQuizzes.map((quiz, index) => {
            const base64ImageData = Buffer.from(quiz.question_image).toString(
              "base64"
            );
            const imageUrl = `data:image/png;base64,${base64ImageData}`;

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
                  borderRadius: "10px",
                  overflow: "hidden",
                  cursor: "pointer",
                  flexShrink: 0,
                  zIndex: 3,
                }}
                mx={4}
                onMouseDown={(e) => e.preventDefault()}
                onClick={() => usequiz(index)}
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
        </Box>
      </Flex>
    </Box>
  );
};

export default Createroom;
