import React, { useEffect, useState } from "react";
import { useLocation, Redirect } from "react-router-dom";
import { Box, Text, Flex, Button } from "rebass";
import { useAuth } from "../../contexts/AuthContext";
import Header from "../Header";
import Mobileheader from "../Mobileheader";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ReferenceLine,
} from "recharts";
import api from "../../api";

const Score = () => {
  const { currentUser } = useAuth();
  const [data, setData] = useState([]);
  const [roominfo, setRoominfo] = useState([]);
  const [name, setName] = useState("");
  const [sessionname, setSessionname] = useState("");
  const [allsession, setAllsession] = useState([]);
  const [enddate, setEnddate] = useState("");
  const [timeLeft, setTimeLeft] = useState("");
  const [isDesktop, setIsDesktop] = useState(window.innerWidth > 768);
  const location = useLocation();
  const roomid = location.state.roomid;

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

  const exportToCSV = (data) => {
    const header = ["ชื่อ", "คะแนน", "เซคชั่น"].join(",");
    const csvData = data.map((row) =>
      [row.student_name, row.score, row.course_code].join(",")
    );
    const csv = "data:text/csv;charset=utf-8,\uFEFF" + [header, ...csvData].join("\n");
    const link = document.createElement("a");
    link.setAttribute("href", encodeURI(csv));
    link.setAttribute("download", `คะแนนของห้อง ${name}.csv`);
    document.body.appendChild(link);
    link.click();
  };
  const averageScore =
    data.reduce((total, currentValue) => total + currentValue.score, 0) /
    data.length;
  const minScore = Math.min(...data.map((d) => d.score));
  const maxScore = Math.max(...data.map((d) => d.score));
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
        <Text
          as="span"
          ml={2}
          mb={2}
          color={timeLeft == "หมดเวลา" ? "red" : "black"}
          fontSize={"32px"}
        >
          {timeLeft}
        </Text>
      </Flex>

      <Flex mt={4} ml={[0, 4]} flexDirection={["column", "column", "row"]}>
        <Box
          width={["100%", "80%", "30%"]}
          ml={[0, 4]}
          mt={4}
          sx={{
            backgroundColor: "rgba(255,255,255,1)",
            borderBottom: "1px solid rgba(255,255,255,0.50)",
            height: "600px",
            borderRadius: "10px",
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          {data.length === 0 ? (
            <Text my={4} ml={3} fontSize="28px">
              ยังไม่มีคะแนนในระบบ
            </Text>
          ) : (
            <>
              <Text mx={4} fontSize="20px">
                รายชื่อทั้งหมด
              </Text>
              <Box
                mt={4}
                mb={3}
                mx="auto"
                as="table"
                sx={{
                  borderCollapse: "collapse",
                  width: "80%",
                  border: "1px solid #ccc",
                  borderRadius: "4px",
                  overflow: "hidden",
                }}
              >
                <thead
                  sx={{
                    backgroundColor: "#f5f5f5",
                    borderBottom: "1px solid #ccc",
                    textTransform: "uppercase",
                    letterSpacing: "0.03em",
                    fontSize: "12px",
                    fontWeight: "bold",
                    color: "#444",
                  }}
                >
                  <Box as="tr">
                    <Text as="th" px={2} py={1}>
                      ชื่อนักเรียน{" "}
                    </Text>
                    <Text as="th" px={2} py={1}>
                      คะแนน
                    </Text>
                    <Text as="th" px={2} py={1}>
                      เซคชั่น
                    </Text>
                  </Box>
                </thead>
                <tbody>
                  {data.map((row, index) => (
                    <Box
                      as="tr"
                      key={index}
                      sx={{
                        backgroundColor: index % 2 === 0 ? "#fff" : "#f5f5f5",
                      }}
                    >
                      <Text as="td" px={2} py={1}>
                        {row.student_name}
                      </Text>
                      <Text as="td" px={2} py={1}>
                        {row.score}
                      </Text>
                      <Text as="td" px={2} py={1}>
                        {row.course_code}
                      </Text>
                    </Box>
                  ))}
                </tbody>
              </Box>
            </>
          )}
          {data.length === 0 ? (
            ""
          ) : (
            <Button
              backgroundColor="lightgreen"
              mt={3}
              mb={4}
              sx={{ cursor: "pointer" }}
              onClick={() => exportToCSV(data)}
            >
              Export to CSV
            </Button>
          )}
        </Box>

        <Box
          width={["100%", "80%", "65%"]}
          ml={[0, 4]}
          mt={4}
          sx={{
            backgroundColor: "rgba(255,255,255,1)",
            borderBottom: "1px solid rgba(255,255,255,0.50)",
            height: "600px",
            borderRadius: "10px",
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "left",
          }}
        >
          {data.length === 0 ? (
            <Text my={4} mx={4} fontSize="28px">
              ยังไม่มีคะแนนในระบบ
            </Text>
          ) : (
            <>
              <Text mt={2} fontSize="22px" ml={4}>
                คะแนนเฉลี่ย = {averageScore} คะแนน
              </Text>
              <Text mt={2} fontSize="22px" ml={4}>
                คะแนนสูงสุด = {maxScore} คะแนน
              </Text>
              <Text mt={2} fontSize="22px" ml={4} mb={4}>
                คะแนนต่อสุด = {minScore} คะแนน
              </Text>
              <BarChart width={600} height={400} data={data}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="student_name" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="score" fill="#8884d8" />
                <ReferenceLine
                  y={averageScore}
                  stroke="gray"
                  label="ค่าเฉลี่ย"
                />
                <ReferenceLine
                  y={minScore}
                  stroke="green"
                  label="คะแนนต่ำสุด"
                />
                <ReferenceLine
                  y={maxScore}
                  stroke="orange"
                  label="คะแนนสูงสุด"
                />
              </BarChart>
            </>
          )}
        </Box>
      </Flex>
    </Box>
  );
};

export default Score;
