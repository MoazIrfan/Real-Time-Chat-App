import React, { useState, useEffect, useRef } from "react";
import { Box, Typography, Avatar } from "@mui/material";
import ChatInput from "./ChatInput";
import Logout from "./Logout";
import { v4 as uuidv4 } from "uuid";
import axios from "axios";
import { sendMessageRoute, recieveMessageRoute } from "../utils/APIRoutes";
import moment from "moment";

export default function ChatContainer({ currentChat, socket }) {
  const [messages, setMessages] = useState([]);
  const [isTyping, setIsTyping] = useState(false);
  const scrollRef = useRef();
  const [arrivalMessage, setArrivalMessage] = useState(null);

  useEffect(() => {
    const fetchMessages = async () => {
      const data = JSON.parse(localStorage.getItem(process.env.REACT_APP_LOCALHOST_KEY));
      const response = await axios.post(recieveMessageRoute, {
        from: data._id,
        to: currentChat._id,
      });
      setMessages(response.data);
    };

    if (currentChat) fetchMessages();

    if (socket.current) {
      socket.current.on("msg-recieve", (msg) => {
        const newMessage = { fromSelf: false, message: msg, createdAt: new Date() };
        setMessages((prevMessages) => [...prevMessages, newMessage]);
        scrollRef.current.scrollIntoView({ behavior: "smooth" });
      });

      socket.current.on("typing", () => {
        setIsTyping(true);
      });

      socket.current.on("stop-typing", () => {
        setIsTyping(false);
      });
    }

    return () => {
      if (socket.current) {
        socket.current.off("msg-recieve");
        socket.current.off("typing");
        socket.current.off("stop-typing");
      }
    };
  }, [currentChat, socket]);

  const handleSendMsg = async (msg) => {
    const data = JSON.parse(localStorage.getItem(process.env.REACT_APP_LOCALHOST_KEY));
    const newMessage = { fromSelf: true, message: msg, createdAt: new Date() };

    setMessages((prevMessages) => [...prevMessages, newMessage]);
    scrollRef.current.scrollIntoView({ behavior: "smooth" });

    socket.current.emit("send-msg", {
      to: currentChat._id,
      from: data._id,
      msg,
    });

    try {
      await axios.post(sendMessageRoute, {
        from: data._id,
        to: currentChat._id,
        message: msg,
      });
    } catch (error) {
      console.error("Error sending message:", error);
      // Handle errors if needed
    }
  };

  useEffect(() => {
    if (arrivalMessage) {
      setMessages((prevMessages) => [...prevMessages, arrivalMessage]);
      scrollRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [arrivalMessage]);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  return (
    <Box
      sx={{
        display: "grid",
        gridTemplateRows: { xs: "15% 70% 15%", sm: "10% 80% 10%" },
        gap: "0.1rem",
        overflow: "hidden",
      }}
    >
      <Box
        className="chat-header"
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          padding: "0 2rem",
        }}
      >
        <Box
          className="user-details"
          sx={{ display: "flex", alignItems: "center", gap: "1rem" }}
        >
          <Box className="avatar">
            <Avatar
              src={`data:image/svg+xml;base64,${currentChat.avatarImage}`}
              alt=""
              sx={{ height: "3rem", width: "3rem" }}
            />
          </Box>
          <Box className="username">
            <Typography variant="h6" color="white">
              {currentChat.username}
            </Typography>
          </Box>
        </Box>
        <Logout />
      </Box>
      <Box
        className="chat-messages"
        sx={{
          padding: "1rem 2rem",
          display: "flex",
          flexDirection: "column",
          gap: "1rem",
          overflow: "auto",
          "&::-webkit-scrollbar": {
            width: "0.2rem",
          },
          "&::-webkit-scrollbar-thumb": {
            backgroundColor: "#ffffff39",
            width: "0.1rem",
            borderRadius: "1rem",
          },
        }}
      >
        {messages.map((message, index) => (
          <Box
            ref={index === messages.length - 1 ? scrollRef : null}
            key={uuidv4()}
          >
            <Box
              className={`message ${
                message.fromSelf ? "sended" : "recieved"
              }`}
              sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: message.fromSelf
                  ? "flex-end"
                  : "flex-start",
              }}
            >
              <Box
                className="content"
                sx={{
                  maxWidth: { xs: "70%", sm: "40%" },
                  overflowWrap: "break-word",
                  padding: "1rem",
                  fontSize: "1.1rem",
                  borderRadius: "1rem",
                  color: "#d1d1d1",
                  backgroundColor: message.fromSelf
                    ? "#4f04ff21"
                    : "#9900ff20",
                }}
              >
                <Typography>{message.message}</Typography>
                <Typography variant="caption" className="timestamp">
                  {moment(message.createdAt).format("LT")}
                </Typography>
              </Box>
            </Box>
          </Box>
        ))}
        
      </Box>
       {isTyping && (
        <Box className="typing-indicator" sx={{ padding: "1rem 2rem" }}>
          <Typography variant="body2" color="white">
            Typing...
          </Typography>
        </Box>
      )}
      <ChatInput handleSendMsg={handleSendMsg} socket={socket} currentChat={currentChat} />
    </Box>
  );
}
