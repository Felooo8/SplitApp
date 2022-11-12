import AddAPhotoIcon from "@mui/icons-material/AddAPhoto";
import { Divider } from "@mui/material";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import React, { useState } from "react";
import styled from "styled-components";
import BottomAppBar from "../components/Appbar";

export default function Profile() {
  const [userName, setUserName] = useState<string>("");

  const handleInputChange = (event: {
    target: { value: React.SetStateAction<string> };
  }) => {
    setUserName(event.target.value);
  };

  // const handleSave = (userName: string) => {
  //   props.toggleSave(userName);
  // };
  return (
    <div>
      <BottomAppBar value="" />

      {/* <Row
        style={{
          padding: "10px 0 10px 0",
          boxShadow:
            "0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19)",
        }}
      > */}
      {/* <Button
          style={right}
          variant="text"
          color="success"
          onClick={() => handleSave(userName)}
        >
          Save
        </Button> */}
      {/* </Row> */}
      <Divider style={{ marginBottom: "20px" }} />
      <Row style={{ padding: "0 32px" }}>
        <Button variant="outlined">
          <AddAPhotoIcon />
        </Button>
        <TextField
          label="User name"
          id="user-name-input"
          variant="standard"
          value={userName}
          style={text}
          onChange={handleInputChange}
        />
      </Row>
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
