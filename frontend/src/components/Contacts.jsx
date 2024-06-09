import React, { useState, useEffect } from "react";
import {Grid, Typography, useMediaQuery} from "@mui/material";
import { useTheme } from "@mui/system";

export default function Contacts({ contacts, changeChat }) {
  const [currentUserName, setCurrentUserName] = useState(undefined);
  const [currentUserImage, setCurrentUserImage] = useState(undefined);
  const [currentSelected, setCurrentSelected] = useState(undefined);

  const theme = useTheme();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down("sm"));

  useEffect(() => {
    const fetchData = async () => {
      const data = await JSON.parse(
        localStorage.getItem(process.env.REACT_APP_LOCALHOST_KEY)
      );
      setCurrentUserName(data.username);
      setCurrentUserImage(data.avatarImage);
    };

    fetchData();
  }, []);

  const changeCurrentChat = (index, contact) => {
    setCurrentSelected(index);
    changeChat(contact);
  };

  return (
     <>
      {currentUserImage && currentUserImage && (
        <Grid container direction="column" justifyContent="space-between" alignItems="center" style={{ overflow: "hidden", backgroundColor: "#080420", minHeight: "100vh" }}>
          <Grid item container direction="column" alignItems="center" justifyContent="center" className="contacts" style={{ overflow: "auto", gap: "0.8rem", width: "100%" }}>
            {contacts.map((contact, index) => (
              <Grid
                key={contact._id}
                item
                className={`contact ${index === currentSelected ? "selected" : ""}`}
                onClick={() => changeCurrentChat(index, contact)}
                sx={{ backgroundColor: "#ffffff34", borderRadius: "0.2rem", padding: "1rem", cursor: "pointer", transition: "0.5s ease-in-out", width: "100%", height: "5rem" }}
              >
                <Grid container alignItems="center" gap={1}>
                  {!isSmallScreen && (
                    <Grid item className="avatar">
                      <img src={`data:image/svg+xml;base64,${contact.avatarImage}`} alt="" style={{ height: "3rem" }} />
                    </Grid>
                  )}
                  <Grid item className="username">
                    <Typography variant="body1" style={{ color: "white" }}>{contact.username}</Typography>
                  </Grid>
                </Grid>
              </Grid>
            ))}
          </Grid>
          <Grid item container justifyContent="center" alignItems="center" className="current-user" style={{ backgroundColor: "#0d0d30", padding: '1rem', gap: "1rem", width: "100%" }}>
            <Grid item className="avatar">
              <img src={`data:image/svg+xml;base64,${currentUserImage}`} alt="avatar" style={{ height: "4rem", maxInlineSize: "100%" }} />
            </Grid>
            <Grid item className="username">
              <Typography variant="h5" style={{ color: "white" }}>{currentUserName}</Typography>
            </Grid>
          </Grid>
        </Grid>
      )}
    </>
  );
}