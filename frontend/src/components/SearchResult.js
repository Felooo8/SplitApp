import PersonAddAltRoundedIcon from "@mui/icons-material/PersonAddAltRounded";
import PersonRemoveAlt1Icon from "@mui/icons-material/PersonRemoveAlt1";
import Avatar from "@mui/material/Avatar";
import Paper from "@mui/material/Paper";
import Slide from "@mui/material/Slide";
import React from "react";
import styled from "styled-components";
import "../App.css";
import ListItemButton from "@mui/material/ListItemButton";

export default function SearchResult(props) {
  console.log(props);

  const inviteFriend = () => {
    fetch("http://127.0.0.1:8000/api/inviteFriend", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Token ${localStorage.getItem("token")}`,
      },
      body: JSON.stringify({ id: props.user.id }),
    }).then((res) => {
      if (res.ok) {
        console.log("Good");
      } else {
        console.log("Failed");
      }
    });
  };

  const removeFriend = () => {
    fetch("http://127.0.0.1:8000/api/removeFriend", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Token ${localStorage.getItem("token")}`,
      },
      body: JSON.stringify({ id: props.user.id }),
    }).then((res) => {
      if (res.ok) {
        console.log("Good");
      } else {
        console.log("Failed");
      }
    });
  };

  const sendInvitation = () => {
    if (props.isFriend) {
      removeFriend();
    } else {
      inviteFriend();
    }
  };

  // const isFriend = (debt) => {
  //   return debt > 0;
  // };

  return (
    <div style={summarizing}>
      <Slide
        direction="right"
        in={true}
        style={{
          transitionDelay: `${props.index * 100}ms`,
          display: "inline-flex",
          width: "90%",
          padding: "16px",
        }}
      >
        <Paper
          elevation={5}
          style={{ minHeight: "100px", borderRadius: "10px" }}
        >
          {/* <Badge color="warning" badgeContent={"!"} invisible={!isPendning()}> */}
          {/* <Paper elevation={3}> */}

          <WholeStack>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                flexWrap: "wrap",
                marginRight: "auto",
              }}
            >
              <Avatar
                sx={{
                  width: 56,
                  height: 56,
                  fontSize: "2rem",
                }}
              >
                {props.user.username[0]}
              </Avatar>
              <Text>{props.user.username}</Text>
            </div>
            <RowStack
              style={{
                display: "table",
                width: "min-content",
                marginRight: "4px",
                // color: isBorrowed(props.debt) ? "orange" : "green",
              }}
            >
              <ListItemButton onClick={sendInvitation}>
                {props.isFriend ? (
                  <PersonRemoveAlt1Icon
                    sx={{
                      width: 56,
                      height: 56,
                      fontSize: "2rem",
                    }}
                  />
                ) : (
                  <PersonAddAltRoundedIcon
                    sx={{
                      width: 56,
                      height: 56,
                      fontSize: "2rem",
                    }}
                  />
                )}
              </ListItemButton>
            </RowStack>
          </WholeStack>
        </Paper>
      </Slide>
    </div>
  );
}

const summarizing = {
  maxWidth: "440px",
  width: "100%",
  marginLeft: "auto",
  marginRight: "auto",
  textAlign: "center",
};
const Text = styled.span`
  font-size: 17px;
  font-style: normal;
  font-weight: 400;
  color: #121212;
  position: relative;
  display: flex;
  text-align: left;
  margin-left: 5px;
`;

const RowStack = styled.div`
  width: -webkit-fill-available;
  display: table-row-group;
`;

const WholeStack = styled.div`
  flex-direction: row;
  display: flex;
  flex: 1 1 0%;
}
`;
