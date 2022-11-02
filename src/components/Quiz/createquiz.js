import React, { useEffect } from "react";
import { Redirect } from "react-router-dom";
import { Box, Heading, Text, Card, Flex, Link, Button, Image } from "rebass";
import { Label, Input, Select, Textarea, Radio, Checkbox } from "@rebass/forms";
import { useAuth } from "../../contexts/AuthContext";
import Header from "../Header";

const CreateQuiz = () => {
  const { currentUser, logout } = useAuth();
  console.log(currentUser);
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
      <Flex mt={3}>
        <Box
          width={1 / 5}
          px={4}
          sx={{
            backgroundColor: "white",
            height: "800px",
            borderRadius: "10px",
          }}
        >
          <Flex pt={4}>
            <Box ml={1} pr={4}>
              <Label htmlFor="name" fontSize="16px">
                ชื่อแบบทดสอบ
              </Label>
            </Box>
            <Box>
              <Input id="name" name="name" />
            </Box>
          </Flex>

          <Flex pt={4}>
            <Box ml={1} pr={4}>
              <Label htmlFor="category" fontSize="16px">
                หมวดหมู่
              </Label>
            </Box>
            <Box>
              <Select id="category" name="category" defaultValue="">
                <option>ภาษาไทย</option>
                <option>ภาษาอังกฤษ</option>
                <option>วิทยาศาสตร์</option>
                <option>สังคมศึกษา</option>
                <option>ประวัติศาสตร์</option>
                <option>สุขศึกษา</option>
                <option>ศิลปะ</option>
                <option>การงานอาชีพ</option>
                <option>ภาษาอังกฤษ</option>
              </Select>
            </Box>
          </Flex>
        </Box>

        <Box
          width={4 / 5}
          mx={4}
          sx={{
            backgroundColor: "white",
            height: "800px",
            borderRadius: "10px",
          }}
        ></Box>
      </Flex>
    </Box>
  );
};

export default CreateQuiz;
