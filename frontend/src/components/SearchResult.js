import "../App.css";

import CancelIcon from "@mui/icons-material/Cancel";
import PersonAddAltRoundedIcon from "@mui/icons-material/PersonAddAltRounded";
import PersonAddDisabledIcon from "@mui/icons-material/PersonAddDisabled";
import PersonRemoveAlt1Icon from "@mui/icons-material/PersonRemoveAlt1";
import ListItemButton from "@mui/material/ListItemButton";
import Paper from "@mui/material/Paper";
import Slide from "@mui/material/Slide";
import React from "react";
import styled from "styled-components";

import Constants from "../apis/Constants";
import DisplayAvatar from "../components/DisplayAvatar";

const inviteFriendUrl = "/api/inviteFriend";
const removeFriendUrl = "/api/removeFriend";
const acceptInvitationUrl = "/api/acceptInvitation/byUser";
const declineInvitationUrl = "/api/declineInvitation/byUser";
const cancelInvitationUrl = "/api/cancelInvitation/byUser";

export default function SearchResult(props) {
  // console.log(props);

  const manageRequest = (url) => {
    fetch(Constants.SERVER + url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Token ${localStorage.getItem("token")}`,
      },
      body: JSON.stringify({ id: props.user.id }),
    })
      .then((response) => {
        if (response.ok) {
          props.toggle(url.substring(5, 8));
        } else {
          throw Error("Something went wrong");
        }
      })
      .catch((error) => {
        console.log(error);
        props.errorToggle();
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
                width: "-webkit-fill-available",
              }}
            >
              <DisplayAvatar user={props.user} />
              <Text>{props.user.username}</Text>
            </div>
            <RowStack
              style={{
                display: "block",
                width: "min-content",
                // marginRight: "4px",
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
