import "../App.css";

import NoAccountsIcon from "@mui/icons-material/NoAccounts";
import {
  Box,
  Button,
  Fade,
  IconButton,
  LinearProgress,
  Modal,
} from "@mui/material";
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";

import Constants from "../apis/Constants";
import BottomAppBar from "../components/Appbar";
import Error from "../components/Error";
import GroupItem from "../components/GroupItem";
import NothingToDisplay from "../components/NothingToDisplay";
import SkeletonItem from "../components/SkeletonItem";
import GroupAddIcon from "@mui/icons-material/GroupAdd";
import CreateNewGroup from "../components/CreateNewGroup";

// import { getGroups } from "../apis/fetch";

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 400,
  bgcolor: "background.paper",
  border: "2px solid #000",
  boxShadow: 24,
  p: 4,
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
  const [newGroupName, setNewGroupName] = useState<string>("");
  const [refreshing, setRefreshing] = useState<boolean>(false);
  const timer = React.useRef<number>();
  const [open, setOpen] = useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

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

  const toggleClose = (name: string) => {
    setOpen(false);
    setNewGroupName(name);
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
    <div>
      {loading ? (
        <SkeletonItem header={true} />
      ) : (
        <div>
          <Button
            variant="outlined"
            startIcon={<GroupAddIcon />}
            onClick={handleOpen}
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
              <CreateNewGroup toggle={toggleClose} />
            </Box>
          </Modal>
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
        </div>
      )}
      <BottomAppBar value="groups" />
    </div>
  );
}

export default Groups;
