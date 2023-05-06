import React, { useState } from "react";
import { useHistory, Redirect } from "react-router-dom";
import { Box, Text, Flex, Image } from "rebass";
import { useAuth } from "../../contexts/AuthContext";
import { motion } from "framer-motion";
import {
  AiOutlineCaretDown,
  AiOutlineCaretUp,
  AiOutlineBook,
} from "react-icons/ai";

const Header = () => {
  const history = useHistory();
  const { currentUser, logout } = useAuth();
  const [toggleRoom, setToggleRoom] = useState(false);
  const [toggleQuiz, setToggleQuiz] = useState(false);
  const [toggleProfile, setToggleProfile] = useState(false);
  const [color, setColor] = useState("");
  const [colortwo, setColortwo] = useState("");
  const [profilecolor, setProfileColor] = useState("");
  const [createroomcolor, setCreateroomcolor] = useState("");
  const [myroomcolor, setMyroomcolor] = useState("");
  const getproductstorage = window.localStorage.getItem("Question");
  const question = getproductstorage ? JSON.parse(getproductstorage) : [];
  const toggleroom = () => {
    setToggleRoom(!toggleRoom);
  };
  const togglequiz = () => {
    setToggleQuiz(!toggleQuiz);
  };
  const toggleprofile = () => {
    setToggleProfile(!toggleProfile);
  };
  const gotohome = () => {
    if (question.length === 0) {
      history.push({
        pathname: `/`,
      });
    } else {
      const confirmed = window.confirm(
        "Are you sure you want to change the page? Any unsaved changes will be lost."
      );

      if (confirmed) {
        window.localStorage.removeItem("Question");
        window.localStorage.removeItem("EditQuiz");
        history.push({
          pathname: `/`,
        });
      }
    }
  };
  const gotomyquiz = () => {
    if (question.length === 0) {
      history.push({
        pathname: `/myquiz`,
      });
    } else {
      const confirmed = window.confirm(
        "Are you sure you want to change the page? Any unsaved changes will be lost."
      );

      if (confirmed) {
        window.localStorage.removeItem("Question");
        window.localStorage.removeItem("EditQuiz");
        history.push({
          pathname: `/myquiz`,
        });
      }
    }
  };

  const gotocreatequiz = () => {
    if (question.length === 0) {
      history.push({
        pathname: `/createquiz`,
      });
    } else {
      const confirmed = window.confirm(
        "Are you sure you want to change the page? Any unsaved changes will be lost."
      );

      if (confirmed) {
        window.localStorage.removeItem("Question");
        window.localStorage.removeItem("EditQuiz");
        history.push({
          pathname: `/createquiz`,
        });
      }
    }
  };

  const gototutorial = () => {
    if (question.length === 0) {
      history.push({
        pathname: `/tutorial`,
      });
    } else {
      const confirmed = window.confirm(
        "Are you sure you want to change the page? Any unsaved changes will be lost."
      );

      if (confirmed) {
        window.localStorage.removeItem("Question");
        window.localStorage.removeItem("EditQuiz");
        history.push({
          pathname: `/tutorial`,
        });
      }
    }
  };

  const gotocreateroom = () => {
    if (question.length === 0) {
      history.push({
        pathname: `/createroom`,
      });
    } else {
      const confirmed = window.confirm(
        "Are you sure you want to change the page? Any unsaved changes will be lost."
      );

      if (confirmed) {
        window.localStorage.removeItem("Question");
        window.localStorage.removeItem("EditQuiz");
        history.push({
          pathname: `/createroom`,
        });
      }
    }
  };

  const gotomyroom = () => {
    if (question.length === 0) {
      history.push({
        pathname: `/myroom`,
      });
    } else {
      const confirmed = window.confirm(
        "Are you sure you want to change the page? Any unsaved changes will be lost."
      );

      if (confirmed) {
        window.localStorage.removeItem("Question");
        window.localStorage.removeItem("EditQuiz");
        history.push({
          pathname: `/myroom`,
        });
      }
    }
  };

  const gotoprofile = () => {
    if (question.length === 0) {
      history.push({
        pathname: `/profile`,
      });
    } else {
      const confirmed = window.confirm(
        "Are you sure you want to change the page? Any unsaved changes will be lost."
      );

      if (confirmed) {
        window.localStorage.removeItem("Question");
        window.localStorage.removeItem("EditQuiz");
        history.push({
          pathname: `/profile`,
        });
      }
    }
  };

  const base64Image = new Buffer(currentUser.image, "binary").toString(
    "base64"
  );
  const imageUrl = `data:image/jpeg;base64,${base64Image}`;
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
    <Flex
      mx={4}
      pt={4}
      justifyContent="right"
      sx={{
        "@media (max-width: 768px)": {
          flexDirection: "column",
          alignItems: "center",
        },
      }}
    >
      <Box
        mr={3}
        sx={{ cursor: "pointer" }}
        onClick={gototutorial}
      >
        <AiOutlineBook style={{ width: "25px", height: "25px" }} />
      </Box>
      <Text
        fontSize="20px"
        mr={3}
        sx={{ cursor: "pointer" }}
        onClick={gotohome}
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
              <Text
                onMouseEnter={() => setCreateroomcolor("#364AFF")}
                onMouseLeave={() => setCreateroomcolor("")}
                sx={{ cursor: "pointer", color: createroomcolor }}
                onClick={gotocreateroom}
              >
                สร้างห้อง
              </Text>
              <Text
                onMouseEnter={() => setMyroomcolor("#364AFF")}
                onMouseLeave={() => setMyroomcolor("")}
                sx={{ cursor: "pointer", color: myroomcolor }}
                onClick={gotomyroom}
              >
                ห้องของฉัน
              </Text>
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
                onClick={gotocreatequiz}
              >
                สร้างแบบทดสอบ
              </Text>
              <Text
                onMouseEnter={() => setColortwo("#364AFF")}
                onMouseLeave={() => setColortwo("")}
                sx={{ cursor: "pointer", color: colortwo }}
                onClick={gotomyquiz}
              >
                แบบทดสอบของฉัน
              </Text>
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
              {currentUser.username}
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
                onClick={gotoprofile}
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
          width: "90px",
          height: "90px",
          objectFit: "cover",
        }}
      />
    </Flex>
  );
};

export default Header;
