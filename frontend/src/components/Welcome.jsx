import React, { useState, useEffect } from "react";
import { Box, Typography } from "@mui/material";
import { styled } from '@mui/material/styles'

const StyledBox = styled(Box)(({ theme }) => ({
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  color: "white",
  flexDirection: "column",
  img: {
    height: "20rem",
  },
  span: {
    color: "#4e0eff",
  },
}));

export default function Welcome() {
  const [userName, setUserName] = useState("");
  
   useEffect(() => {
    const fetchUserName = async () => {
      const user = await JSON.parse(
        localStorage.getItem(process.env.REACT_APP_LOCALHOST_KEY)
      );
      setUserName(user.username);
    };

    fetchUserName();
  }, []);
  
  return (
    <StyledBox>
      <Typography variant="h4" component="h1" sx={{ fontWeight: 'bold' }}>
        Welcome, <span>{userName}!</span>
      </Typography>
      <Typography variant="h6" component="h3">
        Please select a chat to start messaging.
      </Typography>
    </StyledBox>
  );
}
