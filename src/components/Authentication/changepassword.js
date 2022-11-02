import React, { useState } from "react";
import { useHistory, Redirect, useLocation } from "react-router-dom";
import { Box, Text, Card, Flex, Button, Image } from "rebass";
import { useToasts } from "react-toast-notifications";
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
  const { addToast } = useToasts();
  const query = useQuery();
  console.log(query.get("mode"));
  console.log(query.get("oobCode"));
  console.log(query.get("continueUrl"));

  const resetsubmit = async () => {

      await changepassword(query.get("oobCode"), password).then((response) => {
        console.log(response);
        addToast("Password has been change!", {
          appearance: "success",
          autoDismiss: true,
        });
        history.push("/login")
      }).catch((error)=>{
        addToast(error.message, {
            appearance: "error",
            autoDismiss: true,
          });
      })

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
        </Card>
      </Box>
    </Box>
  );
};

export default ChangePassword;
