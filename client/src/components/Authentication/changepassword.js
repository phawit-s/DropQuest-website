import React, { useState } from "react";
import { useHistory, useParams, Redirect, useLocation } from "react-router-dom";
import { Box, Text, Card, Flex, Button, Image } from "rebass";
import { Label, Input } from "@rebass/forms";
import { useAuth } from "../../contexts/AuthContext";

function useQuery() {
  const location = useLocation();
  return new URLSearchParams(location.search);
}

const ChangePassword = () => {
  const history = useHistory();
  const [password, setPassword] = useState("");
  const { changepassword } = useAuth();
  const { token } = useParams();

  const resetsubmit = async () => {
    const change = changepassword(token, password);
    try {
      if (change) {
        window.location.replace("/login");
      }
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
            boxShadow: "0px 2px 20px 2px #23aaff;",
          }}
          bg="#fff"
        >
          <Box m={3} mx={56}>
            <Text sx={{ textAlign: "center", fontSize: "50px" }}>
              เปลี่ยนรหัสผ่าน
            </Text>
            <Label mb={2} mt={4} htmlFor="password">
              รหัสผ่าน
            </Label>
            <Input
              sx={{
                borderTop: "hidden",
                borderLeft: "hidden",
                borderRight: "hidden",
              }}
              id="password"
              name="password"
              onChange={(event) => {
                setPassword(event.target.value);
              }}
              placeholder="รหัสผ่าน"
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
            backgroundColor="#23aaff"
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
          <Box
            mx="auto"
            sx={{
              width: "70%",
              height: "20px",
              borderBottom: "1px solid #23aaff",
              textAlign: "center",
            }}
          />
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

export default ChangePassword;
