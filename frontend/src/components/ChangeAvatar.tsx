import AddAPhotoIcon from "@mui/icons-material/AddAPhoto";
import { Divider } from "@mui/material";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import React, { useEffect, useState } from "react";
import styled from "styled-components";
import IconButton from "@mui/material/IconButton";
import { grey } from "@mui/material/colors";

import Constants from "../apis/Constants";
import BottomAppBar from "../components/Appbar";
import DisplayAvatar from "../components/DisplayAvatar";
import SkeletonItem from "../components/SkeletonItem";
import Error from "../components/Error";
import Fade from "@mui/material/Fade";
import LinearProgress from "@mui/material/LinearProgress";

type props = {
  id: number;
  username: string;
};

export default function ChangeAvatar(props: props) {
  return (
    <div style={{ minWidth: "auto", padding: "0", position: "relative" }}>
      <IconButton
        style={{
          position: "absolute",
          bottom: "-15px",
          right: "-15px",
          background: "#e2e2e2",
          margin: "auto",
        }}
        color="primary"
        aria-label="upload picture"
        component="label"
      >
        <input hidden accept="image/*" type="file" />
        <AddAPhotoIcon fontSize="large" style={{ color: grey[900] }} />
      </IconButton>
      <DisplayAvatar
        user={{ id: props.id, username: props.username }}
        size="large"
      />
    </div>
  );
}
