import AddAPhotoIcon from "@mui/icons-material/AddAPhoto";
import { Divider, Typography } from "@mui/material";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import React, { useEffect, useState } from "react";
import styled from "styled-components";

import Constants from "../apis/Constants";
import BottomAppBar from "../components/Appbar";
import DisplayAvatar from "../components/DisplayAvatar";
import SkeletonItem from "../components/SkeletonItem";
import ChangeAvatar from "../components/ChangeAvatar";
import Error from "../components/Error";
import Fade from "@mui/material/Fade";
import LinearProgress from "@mui/material/LinearProgress";

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
  const [loading, setLoading] = useState<boolean>(true);
  const [refreshing, setRefreshing] = useState<boolean>(false);
  const [profile, setProfile] = useState<any>(null);
  const [errors, setErrors] = useState<Errors>({
    data: false,
  });

  const timer = React.useRef<number>();

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
            setLoading(false);
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

  const toggleFetch = () => {
    setRefreshing(true);
    timer.current = window.setTimeout(() => {
      setRefreshing(false);
    }, Constants.PROGRESS_ANIMATION_TIME);
    getProfileData();
  };

  const handleInputChange = (
    keyName: string,
    event: {
      target: { value: React.SetStateAction<string> };
    },
    blockSpaces: boolean = false
  ) => {
    if (blockSpaces) {
    }
    event.target.value = (event.target as HTMLInputElement).value.replace(
      /\s/g,
      ""
    );
    profile[keyName] = event.target.value;
    setProfile({ ...profile });
  };

  useEffect(() => {
    setLoading(true);
    getProfileData();
  }, []);

  // const handleSave = (userName: string) => {
  //   props.toggleSave(userName);
  // };

  if (Object.values(errors).some((error) => error === true)) {
    return (
      <div>
        <Error toggle={toggleFetch} />
        <BottomAppBar />
      </div>
    );
  }

  return (
    <div>
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
      {loading ? (
        <SkeletonItem header={true} />
      ) : (
        <div>
          <Fade in={refreshing} unmountOnExit>
            <LinearProgress sx={{ height: "8px" }} />
          </Fade>
          <Row style={{ padding: "0 32px" }}>
            <ChangeAvatar id={profile.id} username={profile.username} />
            <Column>
              <TextField
                label="Username"
                id="user-name-input"
                variant="standard"
                value={profile.username}
                style={text}
                onChange={(e) => handleInputChange("username", e, true)}
              />
              <TextField
                label="Frist name"
                id="first-name-input"
                variant="standard"
                value={profile.firstName}
                style={text}
                onChange={(e) => handleInputChange("first_name", e)}
              />
              <TextField
                label="Last name"
                id="last-name-input"
                variant="standard"
                value={profile.lastName}
                style={text}
                onChange={(e) => handleInputChange("last_name", e)}
              />
            </Column>
          </Row>
          <TextField
            disabled
            fullWidth
            margin="normal"
            label="Email"
            id="last-name-input"
            variant="standard"
            value={profile.email}
            style={text}
            onChange={(e) => handleInputChange("last_name", e)}
          />
        </div>
      )}
      <BottomAppBar value="" />
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

const Column = styled.div`
  flex-direction: column;
  display: flex;
  flex: 1 1 0%;
}
`;
