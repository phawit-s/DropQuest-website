import React, { useEffect, useState } from "react";
import { useLocation, Redirect } from "react-router-dom";
import { Box, Heading, Text, Card, Flex, Link, Button, Image } from "rebass";
import { Scrollbars } from "react-custom-scrollbars";
import { useAuth } from "../../contexts/AuthContext";
import Header from "../Header";
import api from "../../api";
import { AiOutlineStar, AiFillStar } from "react-icons/ai";

const Myroom = () => {
  const { currentUser } = useAuth();
  const [quizdetail, setQuizdetail] = useState([]);
  const [quiztopic, setQuiztopic] = useState([]);
  const [loading, setLoading] = useState(true);
  const [favorite, setFavorite] = useState(false);
  const [loadquestion, setLoadquestion] = useState(0);
  const location = useLocation();
  const quizid = location.state.quizid;
  let favoriteQuestions =
    JSON.parse(window.localStorage.getItem("Favourite Question")) || [];

  useEffect(() => {
    console.log("Showing all Questions", quizdetail);
    console.log("Loading id", quizid);
    console.log("Showing Quiz Topic", quiztopic);
  }, [quizdetail, quizid, quiztopic]);

  useEffect(() => {
    api
      .post("/quizdetail", { quizid: quizid })
      .then((response) => {
        setQuizdetail(response.data);
        setLoading(false);
      })
      .catch((err) => {
        console.log(err);
        setLoading(false);
      });
  }, []);

  useEffect(() => {
    api
      .post("/quiztopic", { quizid: quizid })
      .then((response) => {
        setQuiztopic(response.data);
        setLoading(false);
      })
      .catch((err) => {
        console.log(err);
        setLoading(false);
      });
  }, []);

  
  if (!currentUser) {
    return <Redirect to="/login" />;
  }


  return (
    <Box
      minHeight="1000px"
      sx={{
        backgroundColor: "rgba(134, 248, 255, 0.13);",
      }}
    >
      <Header />
    </Box>
  );
};

export default Myroom;
