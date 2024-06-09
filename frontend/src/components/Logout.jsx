import React from "react";
import { useNavigate } from "react-router-dom";
import { IconButton } from "@mui/material";
import ExitToAppIcon from '@mui/icons-material/ExitToApp';
import { styled } from '@mui/material/styles'
import axios from "axios";
import { logoutRoute } from "../utils/APIRoutes";

   const CustomIconButton = styled(IconButton)(({ theme }) => ({
    backgroundColor: theme.palette.primary.main,
    borderRadius: "0.5rem",
    '&:hover': {
      backgroundColor: theme.palette.primary.main,  
      opacity: 1,  
    },
  }));

export default function Logout() {
  const navigate = useNavigate();
  const handleClick = async () => {
    const id = await JSON.parse(
      localStorage.getItem(process.env.REACT_APP_LOCALHOST_KEY)
    )._id;
    const data = await axios.get(`${logoutRoute}/${id}`);
    if (data.status === 200) {
      localStorage.clear();
      navigate("/login");
    }
  };
  return (
    <IconButton onClick={handleClick} sx={{ bgcolor: "#9a86f3", borderRadius: "0.5rem" }}>
      <ExitToAppIcon />
    </IconButton>
  );
}
