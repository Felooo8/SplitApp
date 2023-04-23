import { Alert, Box, Slide, SlideProps, Snackbar } from "@mui/material";
import Button from "@mui/material/Button";
import Fade from "@mui/material/Fade";
import LinearProgress from "@mui/material/LinearProgress";
import TextField from "@mui/material/TextField";
import React, { SyntheticEvent, useEffect, useState } from "react";
import styled from "styled-components";

import Constants from "../apis/Constants";
import BottomAppBar from "../components/Appbar";
import ChangeAvatar from "../components/ChangeAvatar";
import Error from "../components/Error";
import SkeletonItem from "../components/SkeletonItem";

function SlideTransition(props: JSX.IntrinsicAttributes & SlideProps) {
  return <Slide {...props} direction="left" />;
}

type ProfileType = {
  id: number;
  username: string;
  email: string;
  first_name: string;
  last_name: string;
  avatarURL: string;
};

type Errors = {
  data: boolean;
};

const defaultProfile = {
  id: 1,
  username: "username",
  email: "email",
  first_name: "First name",
  last_name: "Second name",
  avatarURL: "avatar",
};

export default function Profile() {
  const [loading, setLoading] = useState<boolean>(true);
  const [refreshing, setRefreshing] = useState<boolean>(false);
  const [profile, setProfile] = useState<ProfileType>(defaultProfile);
  const [openSnackBar, setOpenSnackBar] = useState<boolean>(false);
  const timerAlert = React.useRef<number>();
  const [alertText, setAlertText] = useState<string>("");
  const [alertType, setAlertType] = useState<any>(undefined);
  const [errors, setErrors] = useState<Errors>({
    data: false,
  });

  const timer = React.useRef<number>();

  function validateForm() {
    return (
      profile.username.length > 0 &&
      profile.first_name.length > 0 &&
      profile.last_name.length > 0
    );
  }

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

  const setProfileData = (e: {
    preventDefault: () => void;
    currentTarget: HTMLFormElement | undefined;
  }) => {
    e.preventDefault();
    const data = new FormData(e.currentTarget);
    let set_data = {
      userName: data.get("user_name"),
      firstName: data.get("first_name"),
      lastName: data.get("last_name"),
    };
    fetch(Constants.SERVER + "/api/profile", {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        Authorization: `Token ${localStorage.getItem("token")}`,
      },
      body: JSON.stringify(set_data),
    })
      .then((response) => {
        console.log(response);
        if (response.ok) {
          toggleFetch();
          timerAlert.current = window.setTimeout(() => {
            setAlertText("Changes saved.");
            setAlertType("success");
            setOpenSnackBar(true);
          }, Constants.ALERTUPDATE);
        } else {
          throw Error("Something went wrong");
        }
      })
      .catch((error) => {
        console.log(error);
        timerAlert.current = window.setTimeout(() => {
          setAlertText("Something went wrong. Changes not saved.");
          setAlertType("error");
          setOpenSnackBar(true);
        }, Constants.ALERTUPDATE);
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
    (profile as any)[keyName] = event.target.value;
    setProfile({ ...profile });
  };

  useEffect(() => {
    setLoading(true);
    getProfileData();
  }, []);

  const handleCloseSnackBar = (
    event: Event | SyntheticEvent<Element, Event>,
    reason: string
  ) => {
    if (reason === "clickaway") {
      return;
    }
    setOpenSnackBar(false);
  };

  const handleCloseSnackBarAlert = (event: SyntheticEvent<Element, Event>) => {
    setOpenSnackBar(false);
  };

  if (Object.values(errors).some((error) => error === true)) {
    return (
      <div>
        <Error toggle={toggleFetch} />
        <BottomAppBar />
      </div>
    );
  }

  return (
    <div style={main}>
      <Snackbar
        open={openSnackBar}
        autoHideDuration={Constants.ALERTAUTOHIDDEN}
        onClose={handleCloseSnackBar}
        anchorOrigin={{
          vertical: "top",
          horizontal: "center",
        }}
        TransitionComponent={SlideTransition}
      >
        <Alert
          onClose={handleCloseSnackBarAlert}
          severity={alertType}
          sx={{ width: "100%" }}
          elevation={6}
          variant="filled"
        >
          {alertText}
        </Alert>
      </Snackbar>
      {loading ? (
        <SkeletonItem header={true} />
      ) : (
        <div>
          <Box
            style={{
              position: "fixed",
              left: "0",
              right: "0",
              bottom: "56px",
              zIndex: "10",
            }}
          >
            <Fade in={refreshing} unmountOnExit>
              <LinearProgress sx={{ height: "8px" }} />
            </Fade>
          </Box>
          <Box
            component="form"
            onSubmit={setProfileData}
            noValidate
            sx={{ mt: 1 }}
            style={{ maxWidth: "90%", margin: "auto" }}
          >
            <Row style={{ padding: "0 32px" }}>
              <ChangeAvatar id={profile.id} username={profile.username} />

              <Column>
                <TextField
                  id="user_name"
                  label="Username"
                  name="user_name"
                  variant="standard"
                  value={profile.username}
                  style={text}
                  onChange={(e) => handleInputChange("username", e, true)}
                />
                <TextField
                  id="first_name"
                  label="First name"
                  name="first_name"
                  variant="standard"
                  value={profile.first_name}
                  style={text}
                  onChange={(e) => handleInputChange("first_name", e)}
                />
                <TextField
                  id="last_name"
                  label="Last name"
                  name="last_name"
                  variant="standard"
                  value={profile.last_name}
                  style={text}
                  onChange={(e) => handleInputChange("last_name", e)}
                />
              </Column>
            </Row>
            <Button
              style={{ marginTop: "2rem" }}
              fullWidth
              variant="contained"
              type="submit"
              disabled={!validateForm()}
            >
              Save
            </Button>
          </Box>
          <TextField
            disabled
            fullWidth
            margin="normal"
            label="Email"
            id="last-name-input"
            variant="standard"
            value={profile.email}
            style={{ width: "90%" }}
            onChange={(e) => handleInputChange("last_name", e)}
          />
        </div>
      )}
      <BottomAppBar value="" />
    </div>
  );
}

const main = {
  maxWidth: "1000px",
  width: "100%",
  marginLeft: "auto",
  marginRight: "auto",
  textAlign: "center" as "center",
  marginBottom: "65px",
};

const text = {
  marginRight: "0",
  marginLeft: "20px",
  width: "100%",
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
