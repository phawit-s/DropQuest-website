import React, { useState } from "react";
import { useHistory, Redirect } from "react-router-dom";
import { Box, Text, Card, Flex, Button, Image } from "rebass";
import { useToasts } from "react-toast-notifications";
import { Label, Input } from "@rebass/forms";
import { useAuth } from "../../contexts/AuthContext";

const Resetpassword = () => {
  const history = useHistory();
  const [email, setEmail] = useState("");
  const { resetpassword } = useAuth();
  const { addToast } = useToasts();

  const resetsubmit = async () => {
    try {
      await resetpassword(email)
        .then(() => {
          addToast("Email sent, please check your email", {
            appearance: "success",
            autoDismiss: true,
          });
        })
        .catch((error) => {
          addToast(error.message, {
            appearance: "error",
            autoDismiss: true,
          });
        });
    } catch (err) {
      alert(err);
    }
  };
  const goback = () => {
    history.push({
      pathname: `/login`,
    });
  };
  return (
    <Box>
      <Box m={6} ml="auto" mr="auto" width={[4 / 5, 4 / 5, 2 / 5]}>
        <Card
          width={1}
          py={4}
          sx={{
            borderRadius: "10px",
            fontWeight: "500",
            fontSize: "20px",
            boxShadow: "0px 2px 20px 2px rgba(255, 0, 0, 0.25);",
          }}
          bg="#fff"
        >
          <Box m={3} mx={56}>
            <Text sx={{ textAlign: "center", fontSize: "50px" }}>
              ลืมรหัสผ่าน
            </Text>
            <Label mb={2} mt={4} htmlFor="email">
              อีเมล
            </Label>
            <Input
              sx={{
                borderTop: "hidden",
                borderLeft: "hidden",
                borderRight: "hidden",
              }}
              id="email"
              name="email"
              onChange={(event) => {
                setEmail(event.target.value);
              }}
              placeholder="ใส่ชื่ออีเมล"
            />
          </Box>

          <Button
            mx="auto"
            mt={4}
            p={14}
            sx={{
              display: "flex",
              cursor: "pointer",
              justifyContent: "center",
            }}
            width={3 / 4}
            fontSize={2}
            backgroundColor="rgba(255, 0, 0, 0.24);"
            type="button"
            onClick={resetsubmit}
          >
            <Text
              sx={{
                color: " #fff",
                fontSize: "20px",
              }}
            >
              ยืนยัน
            </Text>
          </Button>

          <Text mt={4} sx={{ textAlign: "center", fontSize: "16px" }}>
            หรือ
          </Text>
          <Box
            mx="auto"
            sx={{
              width: "70%",
              height: "20px",
              borderBottom: "1px solid rgba(255, 0, 0, 0.24)",
              textAlign: "center",
            }}
          ></Box>
          <Text
            mt={3}
            sx={{ textAlign: "center", cursor: "pointer" }}
            onClick={goback}
          >
            เข้าสู่ระบบ
          </Text>
        </Card>
      </Box>
    </Box>
  );
};

export default Resetpassword;
