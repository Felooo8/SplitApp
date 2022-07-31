import PersonAddAltRoundedIcon from "@mui/icons-material/PersonAddAltRounded";
import PersonAddDisabledIcon from "@mui/icons-material/PersonAddDisabled";
import Avatar from "@mui/material/Avatar";
import Paper from "@mui/material/Paper";
import Slide from "@mui/material/Slide";
import React from "react";
import styled from "styled-components";
import "../App.css";
import ListItemButton from "@mui/material/ListItemButton";
import Constants from "../apis/Constants";

const acceptInvitationUrl = "acceptInvitation";
const declineInvitationUrl = "declineInvitation";

export default function InvitationItem(props) {
  console.log(props);
  const manageRequest = (url) => {
    fetch("http://127.0.0.1:8000/api/" + url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Token ${localStorage.getItem("token")}`,
      },
      body: JSON.stringify({ id: props.invitation.id }),
    }).then((res) => {
      if (res.ok) {
        props.toggle();
      } else {
        console.log("Failed");
      }
    });
  };

  return (
    <div style={summarizing}>
      <Slide
        direction="right"
        in={true}
        style={{
          transitionDelay: `${props.index * Constants.ANIMATION_DELAY}ms`,
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
                {props.invitation.sender_username[0]}
              </Avatar>
              <Text>{props.invitation.sender_username}</Text>
            </div>
            <RowStack
              style={{
                display: "block",
                width: "min-content",
                // marginRight: "4px",
                // color: isBorrowed(props.debt) ? "orange" : "green",
              }}
            >
              <div style={{ display: "flex" }}>
                <ListItemButton
                  onClick={() => manageRequest(acceptInvitationUrl)}
                >
                  <PersonAddAltRoundedIcon
                    sx={{
                      width: 56,
                      height: 56,
                      fontSize: "2rem",
                    }}
                  />
                </ListItemButton>
                <ListItemButton
                  onClick={() => manageRequest(declineInvitationUrl)}
                >
                  <PersonAddDisabledIcon
                    sx={{
                      width: 56,
                      height: 56,
                      fontSize: "2rem",
                    }}
                  />
                </ListItemButton>
              </div>
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