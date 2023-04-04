import React, { useEffect, useState } from "react";
import { useHistory, Redirect } from "react-router-dom";
import { Box, Heading, Text, Card, Flex, Link, Button, Image } from "rebass";
import { useAuth } from "../../contexts/AuthContext";
import Hamburger from "hamburger-react";
import { AnimatePresence, motion } from "framer-motion";

const Mobileheader = () => {
  const [isOpen, setOpen] = useState(false);
  const history = useHistory();
  const { currentUser, logout } = useAuth();
  const getproductstorage = window.localStorage.getItem("Question");
  const question = getproductstorage ? JSON.parse(getproductstorage) : [];

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
    <>
      <Flex justifyContent="right" mr={3} mt={2}>
        <Hamburger toggled={isOpen} toggle={setOpen} direction="right" />
      </Flex>
      <nav
        className={`menu ${isOpen ? "open" : ""}`}
        style={{
          position: "fixed",
          top: 60,
          left: 0,
          width: "100%",
          zIndex: 1,
        }}
      >
        <AnimatePresence>
          {isOpen ? (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.3, ease: "easeInOut" }}
            >
              <Box
                pl={4}
                mb={3}
                mx={2}
                py={3}
                backgroundColor="white"
                sx={{ borderRadius: "10px" }}
                fontSize="20px"
              >
                <Text
                  fontSize="20px"
                  mr={3}
                  sx={{ cursor: "pointer" }}
                  mb={2}
                  mt={1}
                  onClick={gotohome}
                >
                  หน้าหลัก
                </Text>
                <Text
                  fontSize="20px"
                  mr={3}
                  sx={{ cursor: "pointer" }}
                  mb={2}
                  onClick={gotocreatequiz}
                >
                  สร้างแบบทดสอบ
                </Text>
                <Text
                  sx={{ cursor: "pointer" }}
                  onClick={gotocreateroom}
                  mb={2}
                >
                  สร้างห้อง
                </Text>
                <Text
                  fontSize="20px"
                  mr={3}
                  sx={{ cursor: "pointer" }}
                  mb={2}
                  onClick={gotomyquiz}
                >
                  แบบทดสอบของฉัน
                </Text>
                <Text
                  sx={{ cursor: "pointer" }}
                  onClick={gotomyroom}
                  mb={2}
                >
                  ห้องของฉัน
                </Text>
                <Text
                  fontSize="20px"
                  mr={3}
                  sx={{ cursor: "pointer" }}
                  mb={2}
                  onClick={gotoprofile}
                >
                  โปรไฟล์
                </Text>
                <Text
                  fontSize="20px"
                  mr={3}
                  sx={{ cursor: "pointer", color: "red" }}
                  mb={2}
                  onClick={(e) => {
                    e.preventDefault();
                    logout();
                  }}
                >
                  ออกจากระบบ
                </Text>
              </Box>
            </motion.div>
          ) : (
            ""
          )}
        </AnimatePresence>
      </nav>
    </>
  );
};

export default Mobileheader;
