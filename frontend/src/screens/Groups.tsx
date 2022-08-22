import "../App.css";

import GroupAddIcon from "@mui/icons-material/GroupAdd";
import NoAccountsIcon from "@mui/icons-material/NoAccounts";
import {
  Alert,
  Box,
  Button,
  Fade,
  IconButton,
  LinearProgress,
  Modal,
  Slide,
  SlideProps,
  Snackbar,
} from "@mui/material";
import React, { SyntheticEvent, useEffect, useState } from "react";
import { Link } from "react-router-dom";

import Constants from "../apis/Constants";
import BottomAppBar from "../components/Appbar";
import CreateNewGroup from "../components/CreateNewGroup";
import Error from "../components/Error";
import GroupItem from "../components/GroupItem";
import NothingToDisplay from "../components/NothingToDisplay";
import SkeletonItem from "../components/SkeletonItem";

function SlideTransition(props: JSX.IntrinsicAttributes & SlideProps) {
  return <Slide {...props} direction="left" />;
}

export const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: "100%",
  height: "100%",
  bgcolor: "background.paper",
  boxShadow: 24,
  p: 4,
  padding: "0",
};
type Group = {
  id: number;
  spent_by_category: number;
  group_name: string;
  balance: number;
};

function Groups() {
  const [groups, setGroups] = useState<Group[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<boolean>(false);
  const [alertText, setAlertText] = useState<string>("");
  const [alertType, setAlertType] = useState<any>(undefined);
  const [refreshing, setRefreshing] = useState<boolean>(false);
  const timer = React.useRef<number>();
  const [openSnackBar, setOpenSnackBar] = useState<boolean>(false);
  const [open, setOpen] = useState(false);
  const timerAlert = React.useRef<number>();
  const handleOpen = () => {
    setOpenSnackBar(false);
    setOpen(true);
  };
  const handleClose = () => setOpen(false);

  const createNewGroup = (groupName: string) => {
    fetch(Constants.SERVER + "/api/createGroup", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Token ${localStorage.getItem("token")}`,
      },
      body: JSON.stringify({ group_name: groupName }),
    })
      .then((response) => {
        if (response.ok) {
          console.log("Good");
          toggleFetch();
          timerAlert.current = window.setTimeout(() => {
            setAlertText("Group " + groupName + " created");
            setAlertType("success");
            setOpenSnackBar(true);
          }, Constants.ALERTUPDATE);
        } else {
          throw Error("Something went wrong");
        }
      })
      .catch((error) => {
        console.log("Failed");
        console.log(error);
        timerAlert.current = window.setTimeout(() => {
          setAlertText(
            "Something went wrong. Group " + groupName + " was not created"
          );
          setAlertType("error");
          setOpenSnackBar(true);
        }, Constants.ALERTUPDATE);
      });
  };

  const getGroups = () => {
    fetch(Constants.SERVER + "/api/group", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Token ${localStorage.getItem("token")}`,
      },
    })
      .then((response) => {
        if (response.ok) {
          response.json().then((data) => {
            setGroups(data);
            setLoading(false);
            setError(false);
          });
        } else {
          throw Error("Something went wrong");
        }
      })
      .catch((error) => {
        console.log(error);
        setError(true);
      });
  };

  const toggleFetch = () => {
    setRefreshing(true);
    timer.current = window.setTimeout(() => {
      setRefreshing(false);
    }, Constants.PROGRESS_ANIMATION_TIME);
    getGroups();
  };

  const toggleSave = (groupName: string) => {
    createNewGroup(groupName);
    setOpen(false);
    setAlertText("Group " + groupName + " is being created");
    setAlertType("info");
    setOpenSnackBar(true);
  };

  const toggleClose = () => {
    setOpen(false);
    setAlertText("Group not created");
    setAlertType("warning");
    setOpenSnackBar(true);
  };
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

  useEffect(() => {
    setLoading(true);
    const timer = setTimeout(() => {
      getGroups();
    }, Constants.LOADING_DATA_DELAY);
    return () => clearTimeout(timer);
  }, []);

  if (error) {
    return (
      <div>
        <Error toggle={toggleFetch} />
        <BottomAppBar value="groups" />
      </div>
    );
  }

  console.log(groups);
  return (
    <div style={{ marginBottom: "65px" }}>
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
              position: "absolute",
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
          {groups.length === 0 ? (
            <NothingToDisplay
              statusIcon={NoAccountsIcon}
              mainText={"You are currenly not in any group"}
              helperText={"When you join one, it'll show up here"}
              toggleRefresh={toggleFetch}
              refreshing={refreshing}
            />
          ) : (
            groups.map((group, index) => (
              <div key={index}>
                <IconButton
                  component={Link}
                  to={`/mygroup/${group.id}/${group.group_name}`}
                  // variant="contained"
                  // color="default"
                  style={{
                    textDecoration: "none",
                    width: "100%",
                  }}
                >
                  <GroupItem
                    name={group.group_name}
                    index={index}
                    balance={group.balance}
                    id={group.id}
                  />
                </IconButton>
              </div>
            ))
          )}
          <Button
            variant="outlined"
            startIcon={<GroupAddIcon />}
            onClick={handleOpen}
            style={{ marginTop: "1rem", marginBottom: "0rem" }}
          >
            Create new group
          </Button>
          <Modal
            open={open}
            onClose={handleClose}
            aria-labelledby="modal-modal-title"
            aria-describedby="modal-modal-description"
          >
            <Box sx={style}>
              <CreateNewGroup
                toggleClose={toggleClose}
                toggleSave={toggleSave}
              />
            </Box>
          </Modal>
        </div>
      )}
      <BottomAppBar value="groups" />
    </div>
  );
}

export default Groups;
