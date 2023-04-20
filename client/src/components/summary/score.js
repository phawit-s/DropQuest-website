import React, { useEffect, useState } from "react";
import { useHistory, useLocation, Redirect } from "react-router-dom";
import { Box, Heading, Text, Card, Flex, Link, Button, Image } from "rebass";
import { Label, Input, Select } from "@rebass/forms";
import { useToasts } from "react-toast-notifications";
import { useAuth } from "../../contexts/AuthContext";
import Header from "../Header";
import Mobileheader from "../Mobileheader";
import Chart from "react-google-charts";
import api from "../../api";


const Score = () => {
  const { currentUser } = useAuth();
  const { addToast } = useToasts();
  const history = useHistory();
  const [data, setData] = useState([]);
  const [roominfo, setRoominfo] = useState([]);
  const [name, setName] = useState("");
  const [selectedsession, setSelectedsession] = useState(0);
  const [sessionname, setSessionname] = useState("");
  const [allsession, setAllsession] = useState([]);
  const [enddate, setEnddate] = useState("");
  const [timeLeft, setTimeLeft] = useState("");
  const [isDesktop, setIsDesktop] = useState(window.innerWidth > 768);
  const location = useLocation();
  const roomid = location.state.roomid;
  let filtersession = [];

  useEffect(() => {
    console.log("Loading Data", data);
    console.log("Loading All session", allsession);
    console.log("Loading room", roominfo);
    if (allsession && allsession.length > 0) {
      setSessionname(allsession[0].course_code);
    }
    if (roominfo && roominfo.length > 0) {
      setName(roominfo[0].name);
      setEnddate(roominfo[0].enddate);
    }
  }, [data, allsession, roominfo]);

  useEffect(() => {
    api
      .post("/allsession", { roomid: roomid })
      .then((response) => {
        setAllsession(response.data);
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
      });
  }, []);

  useEffect(() => {
    api
      .post("/roominfo", { roomid: roomid })
      .then((response) => {
        setRoominfo(response.data);
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
      });
  }, []);

  useEffect(() => {
    api
      .post("/sessioninfo", { roomid: roomid })
      .then((response) => {
        setData(response.data);
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
      });
  }, []);

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
  }, [enddate]);

  const selectcategory = (index, name) => {
    setSelectedsession(index);
    setSessionname(name);
  };
  filtersession = data.filter((session) => session.course_code === sessionname);

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

      <Flex px={4}>
        <Text as="span" ml={2} mb={2} fontSize={"32px"}>
          ห้องของฉัน ( {name} ) เวลาที่เหลือ : 
        </Text>
        <Text as="span" ml={2} mb={2} color={timeLeft == "หมดเวลา" ? "red" : "black"} fontSize={"32px"}>
          {timeLeft}
        </Text>
      </Flex>

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
            เซคชั่นทั้งหมด: {allsession.length} เซคชั่น
          </Text>
          {isDesktop ? (
            <Box
              width={1}
              ml={2}
              sx={{
                height: "800px",
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
              {allsession.map((session, index) => {
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
                        // border: "1px solid #C1D7AE",
                        borderRadius: "20px",
                        cursor: "pointer",
                      }}
                      width={1}
                      fontSize={2}
                      backgroundColor={
                        selectedsession === index
                          ? "#C1D7AE"
                          : "rgba(255,255,255,0)"
                      }
                      type="button"
                      onClick={() => selectcategory(index, session.course_code)}
                    >
                      <Text
                        sx={{
                          color: " #000",
                          fontSize: "20px",
                        }}
                      >
                        {session.course_code}
                      </Text>
                    </Button>
                  </Box>
                );
              })}
            </Box>
          ) : (
            <Box mx={4} mb={4} mt={3}>
              <Select
                id="session"
                name="session"
                defaultValue="ทั้งหมด"
                onChange={(event) =>
                  selectcategory(
                    event.target.selectedIndex + 1,
                    event.target.value
                  )
                }
                backgroundColor="white"
              >
                {allsession.map((session, index) => (
                  <option key={index}>{session.course_code}</option>
                ))}
              </Select>
            </Box>
          )}
        </Box>

        <Flex flexDirection="column" width="100%">
          <Box
            width={[1, 1]}
            ml={[0, 2]}
            mr={4}
            sx={{
              backgroundColor: "rgba(255,255,255,1)",
              borderBottom: "1px solid rgba(255,255,255,0.50)",
              height: "700px",
              borderRadius: "10px",
            }}
          >
            {filtersession.length === 0 ? <Text my={4} mx={4} fontSize="28px">ยังไม่มีคะแนนในระบบ</Text>:<Chart
              width="100%"
              height="100%"
              chartType="ColumnChart"
              loader={<div>Loading Chart</div>}
              data={[
                ["Student Name", "คะแนนรวม"],
                ...filtersession.map((d) => [d.student_name, d.score]),
              ]}
              options={{
                title: "",
                chartArea: { width: "50%" },
                hAxis: {
                  title: "ชื่อนักเรียน",
                  minValue: 0,
                },
                vAxis: {
                  title: "คะแนน",
                },
              }}
            />}
          </Box>
        </Flex>
      </Flex>
    </Box>
  );
};

export default Score;
