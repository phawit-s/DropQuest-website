import React, { useEffect, useState } from "react";
import { useHistory, useLocation, Redirect } from "react-router-dom";
import { Box, Heading, Text, Card, Flex, Link, Button, Image } from "rebass";
import { Label, Input, Select } from "@rebass/forms";
import { Scrollbars } from "react-custom-scrollbars";
import { Modal, Typography } from "@mui/material";
import { useToasts } from "react-toast-notifications";
import { useAuth } from "../../contexts/AuthContext";
import Header from "../Header";
import Mobileheader from "../Mobileheader";
import api from "../../api";
import { AiOutlineStar, AiFillStar } from "react-icons/ai";

const Myroom = () => {
  const { currentUser } = useAuth();
  const { addToast } = useToasts();
  const history = useHistory();
  const [roomdetail, setRoomdetail] = useState([]);
  const [allroom, setAllroom] = useState([]);
  const [loading, setLoading] = useState(true);
  const [favorite, setFavorite] = useState(false);
  const [opensave, setOpensave] = useState(false);
  const [loadroom, setLoadRoom] = useState(0);
  const [loadindex, setLoadindex] = useState(0);
  const [enddate, setEnddate] = useState("");
  const [timeLeft, setTimeLeft] = useState("");
  const location = useLocation();
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
  let favoriteQuestions =
    JSON.parse(window.localStorage.getItem("Favourite Question")) || [];

  useEffect(() => {
    console.log("Showing all Room", allroom);
    console.log("All detail", roomdetail);
    if (allroom && allroom.length > 0) {
      setEnddate(allroom[0].enddate);
    }
    if (roomdetail && roomdetail.length > 0) {
      setLoadRoom(roomdetail[0].room_room_id);
    }
  }, [allroom, roomdetail]);

  useEffect(() => {
    api
      .post("/myroom", { userid: currentUser.user_id })
      .then((response) => {
        setAllroom(response.data);
        setLoading(false);
      })
      .catch((err) => {
        console.log(err);
        setLoading(false);
      });
  }, []);

  useEffect(() => {
    api
      .post("/roomdetail", { userid: currentUser.user_id })
      .then((response) => {
        setRoomdetail(response.data);
        setLoading(false);
      })
      .catch((err) => {
        console.log(err);
        setLoading(false);
      });
  }, []);

  const modalsaveClose = () => setOpensave(false);
  const modalsaveOpen = () => setOpensave(true);
  const selectroom = (index, checkindex) => {
    console.log(index, checkindex);
    console.log("Select Room ", index);
    setLoadRoom(index);
    setLoadindex(checkindex);
    setEnddate(allroom[checkindex].enddate);
  };
  useEffect(() => {
    function calculateTimeLeft() {
      const difference = new Date(enddate) - new Date();
      if (difference <= 0) {
        return "หมดเวลา";
      }
      const days = Math.floor(difference / (1000 * 60 * 60 * 24));
      const hours = Math.floor((difference / (1000 * 60 * 60)) % 24);
      const minutes = Math.floor((difference / (1000 * 60)) % 60);
      if (days === 0) {
        return `${hours} ชั่วโมง ${minutes} นาที`;
      }
      return `${days} วัน ${hours} ชั่วโมง ${minutes} นาที`;
    }

    const intervalId = setInterval(() => {
      const timeLeft = calculateTimeLeft();
      setTimeLeft(timeLeft);
    }, 1000);

    return () => clearInterval(intervalId);
  }, [loadroom, enddate]);
  if (!currentUser) {
    return <Redirect to="/login" />;
  }
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
              //   onClick={deletequiz}
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

      <Box px={4}>
        <Text as="span" ml={2} mb={4} fontSize={"32px"}>
          ห้องของฉัน
        </Text>
      </Box>

      <Flex mt={4} ml={[0, 4]} flexDirection={["column", "row"]}>
        <Box
          width={[1, 1, 1 / 5]}
          px={4}
          ml={[0, 1]}
          mb={3}
          sx={{
            backgroundColor: "rgba(255,255,255,0.75)",
            // backdropFilter: "blur(15px)",
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
          <Text mx="auto" mt={4} fontSize="20px">
            จำนวนห้องทั้งหมด: {allroom.length} ห้อง
          </Text>

          {isDesktop ? (
            allroom.map((room, index) => {
              return (
                <Box key={index}>
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
                    backgroundColor={
                      timeLeft === "หมดเวลา" && loadindex === index
                        ? "red"
                        : loadindex === index
                        ? "green"
                        : "white"
                    }
                    type="button"
                    onClick={() => selectroom(room.room_id, index)}
                  >
                    <Text
                      sx={{
                        color: " #000",
                        fontSize: "20px",
                      }}
                    >
                      ห้องที่ {index + 1}
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
              onChange={(event) =>
                selectroom(
                  parseInt(event.target.value),
                  event.target.selectedIndex
                )
              }
              backgroundColor="white"
            >
              {allroom.map((room, index) => (
                <option key={index} value={room.room_id}>
                  ห้องที่ {index + 1}
                </option>
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
              height: "700px",
              borderRadius: "10px",
            }}
          >
            {allroom.map((room, index) => {
              if (room.room_id === loadroom) {
                return (
                  <Box key={index}>
                    <Text ml={4} my={4} fontSize="26px">
                      ชื่อห้อง : {room.name}
                    </Text>
                    <Text ml={4} my={4} fontSize="26px">
                      แบบทดสอบที่ใช้ : {room.g_name}
                    </Text>
                    <Text
                      ml={4}
                      my={4}
                      fontSize="26px"
                      sx={{
                        color: timeLeft == "หมดเวลา" ? "red" : "black",
                      }}
                    >
                      เวลาที่เหลือ : {timeLeft}
                    </Text>
                  </Box>
                );
              }
            })}
            <Text ml={4} my={4} fontSize="26px">
              เซคชั่นทั้งหมด
            </Text>
            {roomdetail.map((room, index) => {
              if (room.room_room_id === loadroom) {
                return (
                  <Box sx={{ ml: 4, mt: 3 }} key={index}>
                    <Text ml={[0, 4]} mb={4} fontSize="22px">
                      Code : {room.course_code}
                    </Text>
                  </Box>
                );
              }
            })}
          </Box>
        </Flex>
      </Flex>
    </Box>
  );
};

export default Myroom;
