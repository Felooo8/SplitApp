import React, { useState, useEffect, useContext } from "react";
import Avatar from "@mui/material/Avatar";
import Constants from "../apis/Constants";

export default function DisplayAvatar(props) {
  const [avatarURL, setAvatarURL] = useState("");

  let size =
    props.size !== "large"
      ? Constants.AVATAR_SIZE
      : Constants.AVATAR_SIZE_LARGE;

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
  }, [props.reload]);

  return (
    <React.Fragment>
      {avatarURL !== "" ? (
        <img
          src={Constants.SERVER + avatarURL}
          alt="avatar"
          style={{
            width: size,
            height: size,
            borderRadius: size,
          }}
        />
      ) : (
        <Avatar
          sx={{
            width: size,
            height: size,
            fontSize: "2rem",
          }}
        >
          {props.user.username[0]}
        </Avatar>
      )}
    </React.Fragment>
  );
}
