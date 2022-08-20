import AddAPhotoIcon from "@mui/icons-material/AddAPhoto";
import CloseIcon from "@mui/icons-material/Close";
import PersonAddIcon from "@mui/icons-material/PersonAdd";
import { Box, Divider, IconButton, Typography } from "@mui/material";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import React, { useEffect, useState } from "react";
import styled from "styled-components";
import Constants from "../apis/Constants";
import ListOfGroupsModal from "./listOfGroupsModal";

export default function AddUserToGroup(props: any) {
  const [groupName, setGroupName] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(true);
  const [groups, setGroups] = useState([]);
  const [friends, setFriends] = useState([]);
  const [errors, setErrors] = useState({
    groups: false,
    friends: false,
    request: false,
  });

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
            console.log(data);
            setErrors((errors) => ({
              ...errors,
              groups: false,
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
          groups: true,
        }));
      });
  };

  const getFriends = () => {
    fetch(Constants.SERVER + "/api/seeFriends", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Token ${localStorage.getItem("token")}`,
      },
    })
      .then((response) => {
        if (response.ok) {
          response.json().then((data) => {
            setFriends(data);
            setLoading(false);
            setErrors((errors) => ({
              ...errors,
              friends: false,
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
          friends: true,
        }));
      });
  };

  useEffect(() => {
    setLoading(true);
    const timer = setTimeout(() => {
      getGroups();
      getFriends();
    }, Constants.LOADING_DATA_DELAY);
    return () => clearTimeout(timer);
  }, []);

  const toggleCloseGroup = (group_id: string, isGroup: boolean) => {
    console.log(group_id, isGroup);
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
      <ListOfGroupsModal
        toggle={toggleCloseGroup}
        groups={groups}
        friends={friends}
      />
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
function setLoading(arg0: boolean) {
  throw new Error("Function not implemented.");
}
