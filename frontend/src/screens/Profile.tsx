import AddAPhotoIcon from "@mui/icons-material/AddAPhoto";
import { Divider } from "@mui/material";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import React, { useEffect, useState } from "react";
import styled from "styled-components";
import BottomAppBar from "../components/Appbar";
import Constants from "../apis/Constants";

type Profile = {
  id: number;
  username: string;
  email: string;
  firstName: string;
  lastName: string;
  avatarURL: string;
};

type Errors = {
  data: boolean;
};

export default function Profile() {
  const [userName, setUserName] = useState<string>("");
  const [profile, setProfile] = useState<any>(null);
  const [errors, setErrors] = useState<Errors>({
    data: false,
  });

  const getProfileData = () => {
    fetch(Constants.SERVER + "/api/profile", {
      headers: {
        Authorization: `Token ${localStorage.getItem("token")}`,
      },
    })
      .then((response) => {
        if (response.ok) {
          response.json().then((data) => {
            console.log(data);
            setProfile(data);
            setErrors((errors) => ({
              ...errors,
              user: false,
            }));
          });
        } else {
          throw Error("Something went wrong");
        }
      })
      .catch((error) => {
        console.log(error);
        setErrors((errors) => ({
          ...errors,
          user: true,
        }));
      });
  };

  const handleInputChange = (event: {
    target: { value: React.SetStateAction<string> };
  }) => {
    setUserName(event.target.value);
  };

  useEffect(() => {
    getProfileData();
  }, []);

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
