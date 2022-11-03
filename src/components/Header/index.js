import React, { useEffect, useState } from "react";
import { useHistory, Redirect } from "react-router-dom";
import { Box, Heading, Text, Card, Flex, Link, Button, Image } from "rebass";
import { useAuth } from "../../contexts/AuthContext";
import { motion } from "framer-motion";
import { AiOutlineCaretDown, AiOutlineCaretUp } from "react-icons/ai";

const Header = () => {
  const history = useHistory();
  const { currentUser, logout } = useAuth();
  const [toggleRoom, setToggleRoom] = useState(false);
  const [toggleQuiz, setToggleQuiz] = useState(false);
  const [toggleProfile, setToggleProfile] = useState(false);
  const [color, setColor] = useState("");
  const [profilecolor, setProfileColor] = useState("");
  const toggleroom = () => {
    setToggleRoom(!toggleRoom);
  };
  const togglequiz = () => {
    setToggleQuiz(!toggleQuiz);
  };
  const toggleprofile = () => {
    setToggleProfile(!toggleProfile);
  };


  const imageUrl = currentUser.photoURL;
  if (!currentUser) {
    return <Redirect to="/login" />;
  }

  const subMenuAnimate = {
    enter: {
      opacity: 1,
      rotateX: 0,
      transition: {
        staggerChildren: 0.2,
        staggerDirection: -1,
        duration: 0.3,
      },
      display: "block",
    },
    exit: {
      opacity: 0,
      rotateX: -15,
      transition: {
        duration: 0.3,
        delay: 0.1,
        staggerChildren: 0.2,
        staggerDirection: 1,
      },
      transitionEnd: {
        display: "none",
      },
    },
  };
  return (
    <Flex mx={4} pt={4} justifyContent="right">
      <Text
        fontSize="20px"
        mr={3}
        sx={{ cursor: "pointer" }}
        onClick={() =>
          history.push({
            pathname: `/`,
          })
        }
      >
        หน้าหลัก
      </Text>

      <Box mr={2}>
        <motion.div className="menu-item" onMouseDown={toggleroom}>
          <Flex sx={{ cursor: "pointer" }}>
            <Text fontSize="20px" width="100px" mb={2}>
              ห้องของฉัน
            </Text>
            <Box mt={2}>
              {toggleRoom ? <AiOutlineCaretUp /> : <AiOutlineCaretDown />}
            </Box>
          </Flex>

          <motion.div
            className="sub-menu"
            initial="exit"
            animate={toggleRoom ? "enter" : "exit"}
            variants={subMenuAnimate}
          >
            <Box
              width="100px"
              sx={{
                backgroundColor: "white",
                p: 2,
                borderRadius: "10px",
                position: "absolute",
              }}
            >
              <Text color="black">สร้างห้อง</Text>
              <Text color="black">ห้องของฉัน</Text>
              <Text color="black">สรุปผล</Text>
            </Box>
          </motion.div>
        </motion.div>
      </Box>

      <Box mr={1}>
        <motion.div className="menu-item" onMouseDown={togglequiz}>
          <Flex width="150px" sx={{ cursor: "pointer" }}>
            <Text fontSize="20px" mb={2}>
              แบบทดสอบ
            </Text>
            <Box mt={2} ml={2}>
              {toggleQuiz ? <AiOutlineCaretUp /> : <AiOutlineCaretDown />}
            </Box>
          </Flex>
          <motion.div
            className="sub-menu"
            initial="exit"
            animate={toggleQuiz ? "enter" : "exit"}
            variants={subMenuAnimate}
          >
            <Box
              width="150px"
              sx={{
                backgroundColor: "white",
                p: 2,
                borderRadius: "10px",
                position: "absolute",
              }}
            >
              <Text
                onMouseEnter={() => setColor("#364AFF")}
                onMouseLeave={() => setColor("")}
                sx={{ cursor: "pointer", color: color }}
                onClick={() =>
                  history.push({
                    pathname: `/createquiz`,
                  })
                }
              >
                สร้างแบบทดสอบ
              </Text>
              <Text color="black">แบบทดสอบของฉัน</Text>
            </Box>
          </motion.div>
        </motion.div>
      </Box>

      <Box mr={2}>
        <motion.div className="menu-item" onMouseDown={toggleprofile}>
          <Flex width="120px" sx={{ cursor: "pointer" }}>
            <Text
              fontSize="20px"
              mb={2}
              sx={{
                overflow: "hidden",
                textOverflow: "ellipsis",
                whiteSpace: "nowrap",
              }}
            >
              {currentUser.displayName}
            </Text>
            <Box mt={2} ml={2}>
              {toggleProfile ? <AiOutlineCaretUp /> : <AiOutlineCaretDown />}
            </Box>
          </Flex>
          <motion.div
            className="sub-menu"
            initial="exit"
            animate={toggleProfile ? "enter" : "exit"}
            variants={subMenuAnimate}
          >
            <Box
              width="120px"
              sx={{
                backgroundColor: "white",
                p: 2,
                borderRadius: "10px",
                position: "absolute",
              }}
            >
              <Text
                onMouseEnter={() => setProfileColor("#364AFF")}
                onMouseLeave={() => setProfileColor("")}
                sx={{ cursor: "pointer", color: profilecolor }}
                onClick={() =>
                  history.push({
                    pathname: `/profile`,
                  })
                }
                fontSize="16px"
              >
                โปรไฟล์
              </Text>
              <Text
                sx={{
                  cursor: "pointer",
                }}
                fontSize="16px"
                color="red"
                onClick={(e) => {
                  e.preventDefault();
                  logout();
                }}
              >
                ออกจากระบบ
              </Text>
            </Box>
          </motion.div>
        </motion.div>
      </Box>
      <Image
        ml={3}
        src={imageUrl}
        referrerPolicy="no-referrer"
        sx={{
          borderRadius: "50%",
          width: "60px",
          height: "60px",
          objectFit: "cover",
        }}
      />
    </Flex>
    //</Flex>
  );
};

export default Header;
