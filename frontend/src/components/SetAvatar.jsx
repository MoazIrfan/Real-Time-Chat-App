import React, { useEffect, useState } from "react";
import { Box, Button, CircularProgress, Container, Typography } from "@mui/material";
import axios from "axios";
import { Buffer } from "buffer";
import loader from "../assets/loader.gif";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useNavigate } from "react-router-dom";
import { setAvatarRoute } from "../utils/APIRoutes";

export default function SetAvatar() {
  const navigate = useNavigate();
  const [avatars, setAvatars] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedAvatar, setSelectedAvatar] = useState(undefined);
  const toastOptions = {
    position: "bottom-right",
    autoClose: 8000,
    pauseOnHover: true,
    draggable: true,
    theme: "dark",
  };

  useEffect(() => {
    (async () => {
      if (!localStorage.getItem(process.env.REACT_APP_LOCALHOST_KEY)) {
        navigate("/login");
      }
    })();
  }, []);

  const setProfilePicture = async () => {
    if (selectedAvatar === undefined) {
      toast.error("Please select an avatar", toastOptions);
    } else {
      const user = await JSON.parse(
        localStorage.getItem(process.env.REACT_APP_LOCALHOST_KEY)
      );

      const { data } = await axios.post(`${setAvatarRoute}/${user._id}`, {
        image: avatars[selectedAvatar],
      });

      if (data.isSet) {
        user.isAvatarImageSet = true;
        user.avatarImage = data.image;
        localStorage.setItem(
          process.env.REACT_APP_LOCALHOST_KEY,
          JSON.stringify(user)
        );
        navigate("/");
      } else {
        toast.error("Error setting avatar. Please try again.", toastOptions);
      }
    }
  };

  useEffect(() => {
    const fetchAvatars = async () => {
      const api = `https://api.multiavatar.com/4645646`; 
      const data = [];
      for (let i = 0; i < 4; i++) {
        const image = await axios.get(`${api}/${Math.round(Math.random() * 1000)}`);
        const buffer = Buffer.from(image.data);
        data.push(buffer.toString("base64"));
      }
      setAvatars(data);
      setIsLoading(false);
    };

    fetchAvatars();
  }, []);

  return (
   <Container 
    sx={{
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        gap: 3,
        bgcolor: "#131324",
        minHeight: "100vh",
        minWidth: "100vw",
        maxWidth: "100%", 
        paddingX: { xs: 2, md: 3 }, 
      }}
   >
      {isLoading ? (
        <CircularProgress sx={{ mt: 8 }} />
      ) : (
        <>
          <Typography variant="h4" sx={{ color: "white" }}>Pick an Avatar as your profile picture</Typography>
          <Box sx={{ display: "flex", gap: 2 }}>
            {avatars.map((avatar, index) => (
              <Box
                key={avatar}
                className={`avatar ${selectedAvatar === index ? "selected" : ""}`}
                sx={{ 
                  border: `0.4rem solid ${selectedAvatar === index ? "#4e0eff" : "transparent"}`,
                  padding: "0.4rem",
                  borderRadius: "5rem",
                  transition: "0.5s ease-in-out",
                  cursor: "pointer",
                }}
                onClick={() => setSelectedAvatar(index)}
              >
                <img src={`data:image/svg+xml;base64,${avatar}`} alt="avatar" style={{ height: "6rem", transition: "0.5s ease-in-out" }} />
              </Box>
            ))}
          </Box>
          <Button onClick={setProfilePicture} variant="contained" sx={{ bgcolor: "#4e0eff", color: "white", mt: 2, textTransform: "uppercase" }}>Set as Profile Picture</Button>
        </>
      )}
    </Container>
  );
}
