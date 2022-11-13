import React, { useState, useEffect } from "react";
import Avatar from "@mui/material/Avatar";
import Constants from "../apis/Constants";

export default function DisplayAvatar(props) {
  const [avatarURL, setAvatarURL] = useState("");

  const getAvatar = (url) => {
    fetch(Constants.SERVER + url + props.user.id, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Token ${localStorage.getItem("token")}`,
      },
    }).then((response) => {
      if (response.ok) {
        if (response.status === 200) {
          response.json().then((data) => {
            console.log(data);
            setAvatarURL(data);
          });
        } else if (response.status === 204) {
          console.log("User " + props.user.username + " has no avatar");
        }
      } else {
        console.log("invalid data");
      }
    });
  };

  useEffect(() => {
    if (props.isGroup) {
      getAvatar("/api/getGroupAvatar/");
    } else {
      getAvatar("/api/getAvatar/");
    }
  }, []);

  return (
    <div>
      {avatarURL !== "" ? (
        <img
          src={Constants.SERVER + avatarURL}
          alt="avatar"
          style={{
            width: Constants.AVATAR_SIZE,
            height: Constants.AVATAR_SIZE,
            borderRadius: Constants.AVATAR_SIZE,
          }}
        />
      ) : (
        <Avatar
          sx={{
            width: Constants.AVATAR_SIZE,
            height: Constants.AVATAR_SIZE,
            fontSize: "2rem",
          }}
        >
          {props.user.username[0]}
        </Avatar>
      )}
    </div>
  );
}
