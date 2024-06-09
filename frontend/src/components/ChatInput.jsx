import React, { useState, useEffect } from "react";
import MoodIcon from "@mui/icons-material/Mood";
import SendIcon from '@mui/icons-material/Send'; 
import {Box, IconButton, TextField, Button} from "@mui/material";
import Picker from "emoji-picker-react";

export default function ChatInput({ handleSendMsg, socket, currentChat }) {
  const [msg, setMsg] = useState("");
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  let typingTimeout;

  const handleEmojiPickerhideShow = () => {
    setShowEmojiPicker(!showEmojiPicker);
  };

  const handleEmojiClick = (event, emojiObject) => {
    let message = msg;
    message += emojiObject.emoji;
    setMsg(message);
  };

  const sendChat = (event) => {
    event.preventDefault();
    if (msg.length > 0) {
      handleSendMsg(msg);
      setMsg("");
      setIsTyping(false);
      socket.current.emit("stop-typing", currentChat._id);
    }
  };

  const handleInputChange = (e) => {
    setMsg(e.target.value);
    if (!isTyping) {
      setIsTyping(true);
      socket.current.emit("typing", currentChat._id);
    }
    clearTimeout(typingTimeout);
    typingTimeout = setTimeout(() => {
      setIsTyping(false);
      socket.current.emit("stop-typing", currentChat._id);
    }, 2000);
  };

  useEffect(() => {
    return () => {
      clearTimeout(typingTimeout);
    };
  }, []);

  return (
    <Box
      sx={{
        display: "grid",
        alignItems: "center",
        gridTemplateColumns: "5% 95%",
        backgroundColor: "#080420",
        padding: { xs: "0 1rem", md: "0 2rem" },
        gap: { xs: "1rem", md: "0" },
      }}
    >
      <Box
        className="button-container"
        sx={{
          display: "flex",
          alignItems: "center",
          color: "white",
          gap: "1rem",
        }}
      >
        <Box className="emoji" sx={{ position: "relative" }}>
          <IconButton onClick={handleEmojiPickerhideShow}>
            <MoodIcon sx={{ fontSize: "1.5rem", color: "#ffff00c8" }} />
          </IconButton>
          {showEmojiPicker && (
            <Box
              className="emoji-picker-react"
              sx={{
                position: "absolute",
                top: "-350px",
                backgroundColor: "#080420",
                boxShadow: "0 5px 10px #9a86f3",
                borderColor: "#9a86f3",
                "& .emoji-scroll-wrapper::-webkit-scrollbar": {
                  backgroundColor: "#080420",
                  width: "5px",
                  "&-thumb": {
                    backgroundColor: "#9a86f3",
                  },
                },
                "& .emoji-categories button": {
                  filter: "contrast(0)",
                },
                "& .emoji-search": {
                  backgroundColor: "transparent",
                  borderColor: "#9a86f3",
                },
                "& .emoji-group:before": {
                  backgroundColor: "#080420",
                },
              }}
            >
              <Picker onEmojiClick={handleEmojiClick} />
            </Box>
          )}
        </Box>
      </Box>
      <Box
        component="form"
        className="input-container"
        onSubmit={(event) => sendChat(event)}
        sx={{
          width: "100%",
          borderRadius: "2rem",
          display: "flex",
          alignItems: "center",
          gap: "2rem",
          backgroundColor: "#ffffff34",
        }}
      >
        <TextField
          type="text"
          placeholder="type message"
          onChange={handleInputChange}
          value={msg}
          variant="outlined"
          fullWidth
          InputProps={{
            sx: {
              backgroundColor: "transparent",
              color: "white",
              border: "none",
              paddingLeft: "1rem",
              fontSize: "1.2rem",
              "&::selection": {
                backgroundColor: "#9a86f3",
              },
              "&:focus": {
                outline: "none",
              },
            },
          }}
          sx={{
            width: "90%",
            height: "60%",
            "& .MuiOutlinedInput-root": {
              "& fieldset": {
                borderColor: "transparent",
              },
              "&:hover fieldset": {
                borderColor: "transparent",
              },
              "&.Mui-focused fieldset": {
                borderColor: "transparent",
              },
            },
          }}
        />
        <Button
          type="submit"
          sx={{
            padding: { xs: "0.3rem 1rem", md: "0.3rem 2rem" },
            color: "white",
            fontSize: { xs: "1rem", md: "3rem" },
          }}
        >
          <SendIcon />
        </Button>
      </Box>
    </Box>
  );
}
