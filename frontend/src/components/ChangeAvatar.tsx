import AddAPhotoIcon from "@mui/icons-material/AddAPhoto";
import { Divider } from "@mui/material";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import React, { useEffect, useState } from "react";
import styled from "styled-components";
import IconButton from "@mui/material/IconButton";

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
    <Button variant="text" sx={{ minWidth: "auto", padding: "0" }}>
      <IconButton
        style={{
          position: "absolute",
          bottom: "-15px",
          right: "-15px",
          background: "#e2e2e2",
        }}
        color="primary"
        aria-label="upload picture"
        component="label"
      >
        <input hidden accept="image/*" type="file" />
        <AddAPhotoIcon fontSize="large" />
      </IconButton>
      <DisplayAvatar
        user={{ id: props.id, username: props.username }}
        size="large"
      />
    </Button>
  );
}
