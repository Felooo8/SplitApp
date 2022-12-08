import AddAPhotoIcon from "@mui/icons-material/AddAPhoto";
import { grey } from "@mui/material/colors";
import IconButton from "@mui/material/IconButton";
import React, { useState, ChangeEvent } from "react";
import Constants from "../apis/Constants";

import DisplayAvatar from "../components/DisplayAvatar";

type props = {
  id: number;
  username: string;
};

export default function ChangeAvatar(props: props) {
  const [avatar, setAvatar] = useState<File>();
  console.log(avatar);

  const changeHandler = (event: ChangeEvent<HTMLInputElement>) => {
    const fileList = event.target.files;

    if (!fileList) return;

    setAvatar(fileList[0]);
    handleUploadAvatar();
  };

  const handleUploadAvatar = () => {
    if (!avatar) return;
    const formData = new FormData();
    formData.append("image", avatar, avatar.name);

    fetch(Constants.SERVER + "/api/setAvatar", {
      method: "POST",
      headers: {
        Accept: "application/json",
        "content-type": "multipart/form-data",
        Authorization: `Token ${localStorage.getItem("token")}`,
      },
      body: formData,
    })
      .then((response) => {
        console.log(response);
        if (response.ok) {
          console.log("CHANGED");
        } else {
          throw Error("Something went wrong");
        }
      })
      .catch((error) => {
        console.log(error);
      });
  };

  return (
    <div style={{ minWidth: "auto", padding: "0", position: "relative" }}>
      <IconButton
        style={{
          position: "absolute",
          bottom: "-10px",
          right: "-10px",
          background: "#e2e2e2",
          margin: "auto",
        }}
        color="primary"
        aria-label="upload picture"
        component="label"
      >
        <input hidden accept="image/*" type="file" onChange={changeHandler} />
        <AddAPhotoIcon fontSize="large" style={{ color: grey[900] }} />
      </IconButton>
      <DisplayAvatar
        user={{ id: props.id, username: props.username }}
        size="large"
      />
    </div>
  );
}
