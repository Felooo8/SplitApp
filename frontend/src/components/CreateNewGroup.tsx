import AddAPhotoIcon from "@mui/icons-material/AddAPhoto";
import CloseIcon from "@mui/icons-material/Close";
import PersonAddIcon from "@mui/icons-material/PersonAdd";
import { Box, Divider, IconButton, Typography } from "@mui/material";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import React, { useState } from "react";
import styled from "styled-components";

export default function CreateNewGroup(props: any) {
  const [open] = useState<boolean>(false);
  const [groupName, setGroupName] = useState<string>("");

  const handleInputChange = (event: {
    target: { value: React.SetStateAction<string> };
  }) => {
    setGroupName(event.target.value);
  };

  const handleClose = () => {
    props.toggleClose();
  };

  const handleSave = (groupName: string) => {
    props.toggleSave(groupName);
  };

  return (
    <div>
      <Row
        style={{
          padding: "10px 0 10px 0",
          boxShadow:
            "0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19)",
        }}
      >
        <IconButton
          style={{
            fontSize: "25px",
            margin: "auto 10px auto 10px",
          }}
          onClick={handleClose}
        >
          <CloseIcon />
        </IconButton>
        <Typography
          style={{ width: "100%", margin: "auto" }}
          variant="h5"
          gutterBottom
        >
          Create a group
        </Typography>
        <Button
          style={right}
          variant="text"
          color="success"
          onClick={() => handleSave(groupName)}
        >
          Save
        </Button>
      </Row>
      <Divider style={{ marginBottom: "20px" }} />
      <Row style={{ padding: "0 32px" }}>
        <Button variant="outlined">
          <AddAPhotoIcon />
        </Button>
        <TextField
          label="Group name"
          id="standard-size-normal"
          variant="standard"
          value={groupName}
          style={text}
          onChange={handleInputChange}
        />
      </Row>
      <Box style={{ marginTop: "1rem", padding: "0 32px" }}>
        <Typography variant="subtitle2" gutterBottom>
          Group members
        </Typography>
        <Row>
          <PersonAddIcon
            style={{
              fontSize: "38",
              margin: "auto",
              marginRight: "10px",
            }}
          />
          <Typography variant="body1" style={text} gutterBottom>
            You will be able to add group members after you save this new group.
          </Typography>
        </Row>
      </Box>
    </div>
  );
}

const text = {
  marginRight: "0",
  marginLeft: "20px",
  width: "100%",
};

const right = {
  marginRight: "0",
  marginLeft: "auto",
};

const Row = styled.div`
  flex-direction: row;
  display: flex;
  flex: 1 1 0%;
}
`;
