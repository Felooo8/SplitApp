import PersonAddAltRoundedIcon from "@mui/icons-material/PersonAddAltRounded";
import PersonRemoveAlt1Icon from "@mui/icons-material/PersonRemoveAlt1";
import CancelIcon from "@mui/icons-material/Cancel";
import PersonAddDisabledIcon from "@mui/icons-material/PersonAddDisabled";
import Avatar from "@mui/material/Avatar";
import Paper from "@mui/material/Paper";
import Slide from "@mui/material/Slide";
import React, { useState, useEffect } from "react";
import styled from "styled-components";
import "../App.css";
import ListItemButton from "@mui/material/ListItemButton";

const inviteFriendUrl = "inviteFriend";
const removeFriendUrl = "removeFriend";
const acceptInvitationUrl = "acceptInvitation/byUser";
const declineInvitationUrl = "declineInvitation/byUser";
const cancelInvitationUrl = "cancelInvitation/byUser";

export default function SearchResult(props) {
  const [avatarURL, setAvatarURL] = useState("");
  console.log(props);

  const getAvatar = () => {
    fetch("http://127.0.0.1:8000/api/getAvatar/" + props.user.id, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Token ${localStorage.getItem("token")}`,
      },
    }).then((response) => {
      if (response.ok) {
        response.json().then((data) => {
          console.log(data);
          setAvatarURL(data);
        });
      } else {
        console.log("invalid data");
      }
    });
  };
  getAvatar();
  const manageRequest = (url) => {
    fetch("http://127.0.0.1:8000/api/" + url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Token ${localStorage.getItem("token")}`,
      },
      body: JSON.stringify({ id: props.user.id }),
    }).then((res) => {
      if (res.ok) {
        props.toggle();
      } else {
        console.log("Failed");
      }
    });
  };

  const sendInvitation = () => {
    if (props.isFriend) {
      manageRequest(removeFriendUrl);
    } else if (props.isSent) {
      manageRequest(cancelInvitationUrl);
    } else {
      manageRequest(inviteFriendUrl);
    }
  };

  const showIcon = () => {
    if (props.isFriend) {
      return (
        <PersonRemoveAlt1Icon
          sx={{
            width: 56,
            height: 56,
            fontSize: "2rem",
          }}
        />
      );
    }
    if (props.isSent) {
      return (
        <CancelIcon
          sx={{
            width: 56,
            height: 56,
            fontSize: "2rem",
          }}
        />
      );
    }
    return (
      <PersonAddAltRoundedIcon
        sx={{
          width: 56,
          height: 56,
          fontSize: "2rem",
        }}
      />
    );
  };

  const displayAvatar = () => {
    if (avatarURL !== "") {
      console.log("http://127.0.0.1:8000" + avatarURL);
      return (
        <img
          src={"http://127.0.0.1:8000" + avatarURL}
          alt="avatar"
          style={{ width: "56px", height: "56px" }}
        />
      );
    }
    return (
      <Avatar
        sx={{
          width: 56,
          height: 56,
          fontSize: "2rem",
        }}
      >
        {props.user.username[0]}
      </Avatar>
    );
  };

  useEffect(() => {
    getAvatar();
  }, []);

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
              {displayAvatar()}

              <Text>{props.user.username}</Text>
            </div>
            <RowStack
              style={{
                display: "block",
                width: "min-content",
                // marginRight: "4px",
                // color: isBorrowed(props.debt) ? "orange" : "green",
              }}
            >
              {props.isPending ? (
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
              ) : (
                <ListItemButton onClick={sendInvitation}>
                  {showIcon()}
                </ListItemButton>
              )}
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
