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
import SummaryItem from "../components/SummaryItem";
import NothingToDisplay from "../components/NothingToDisplay";
import SkeletonItem from "../components/SkeletonItem";

function SlideTransition(props: JSX.IntrinsicAttributes & SlideProps) {
  return <Slide {...props} direction="left" />;
}

type Group = {
  id: number;
  group_name: string;
  balance: number;
};

export default function Groups() {
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

  //FETCH
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
    fetch(Constants.SERVER + "/api/groups", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Token ${localStorage.getItem("token")}`,
      },
    })
      .then((response) => {
        if (response.ok) {
          response.json().then((data) => {
            console.log(data);
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

  //TOGGLE
  const toggleFetch = () => {
    setRefreshing(true);
    timer.current = window.setTimeout(() => {
      setRefreshing(false);
    }, Constants.PROGRESS_ANIMATION_TIME);
    getGroups();
  };

  const toggleSaveCreatingGroup = (groupName: string) => {
    createNewGroup(groupName);
    setOpen(false);
    setAlertText("Group " + groupName + " is being created");
    setAlertType("info");
    setOpenSnackBar(true);
  };

  const toggleCloseCreatingGroup = () => {
    setOpen(false);
    setAlertText("Group not created");
    setAlertType("warning");
    setOpenSnackBar(true);
  };

  //SNACKBARS
  const handleCloseSnackBar = (
    event: Event | SyntheticEvent<Element, Event>,
    reason: string
  ) => {
    if (reason === "clickaway") {
      return;
    }
    setOpenSnackBar(false);
  };

  const handleOpen = () => {
    setOpenSnackBar(false);
    setOpen(true);
  };
  const handleClose = () => setOpen(false);

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
          {groups.length === 0 ? (
            <NothingToDisplay
              statusIcon={NoAccountsIcon}
              mainText={"You are currenly not in any group"}
              helperText={"When you join one, it'll show up here"}
              toggleRefresh={toggleFetch}
              refreshing={refreshing}
            />
          ) : (
            <React.Fragment>
              <h5>Your groups:</h5>
              {groups.map((group, index) => (
                <IconButton
                  component={Link}
                  to={`/mygroup/${group.id}/${group.group_name}`}
                  // variant="contained"
                  // color="default"
                  style={{
                    textDecoration: "none",
                    width: "100%",
                  }}
                  key={index}
                >
                  <SummaryItem
                    name={group.group_name}
                    index={index}
                    balance={group.balance}
                    id={group.id}
                    isGroup={true}
                  />
                </IconButton>
              ))}
            </React.Fragment>
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
                toggleClose={toggleCloseCreatingGroup}
                toggleSave={toggleSaveCreatingGroup}
                basic={false}
                heading="Create group"
              />
            </Box>
          </Modal>
        </div>
      )}
      <BottomAppBar value="groups" />
    </div>
  );
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
