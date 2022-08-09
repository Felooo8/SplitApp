import React, { useState, useEffect } from "react";
import Avatar from "@mui/material/Avatar";
import Constants from "../apis/Constants";

export default function DisplayAvatar(props) {
  const [avatarURL, setAvatarURL] = useState("");

  const getAvatar = (url) => {
    fetch("http://127.0.0.1:8000/api/" + url + props.user.id, {
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

  useEffect(() => {
    if (props.isGroup) {
      getAvatar("getGroupAvatar/");
    } else {
      getAvatar("getAvatar/");
    }
  }, []);

  return (
    <div>
      {avatarURL !== "" ? (
        <img
          src={"http://127.0.0.1:8000" + avatarURL}
          alt="avatar"
          style={{
            width: Constants.AVATAR_SIZE,
            height: Constants.AVATAR_SIZE,
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
