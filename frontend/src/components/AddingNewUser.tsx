import PersonAddIcon from "@mui/icons-material/PersonAdd";
import SearchIcon from "@mui/icons-material/Search";
import { Fade, LinearProgress } from "@mui/material";
import AppBar from "@mui/material/AppBar";
import CircularProgress from "@mui/material/CircularProgress";
import InputBase from "@mui/material/InputBase";
import List from "@mui/material/List";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListSubheader from "@mui/material/ListSubheader";
import { alpha, styled } from "@mui/material/styles";
import Toolbar from "@mui/material/Toolbar";
import React, { useState } from "react";
import { Box, Divider, IconButton, Typography } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";

import Constants from "../apis/Constants";

const Search = styled("div")(({ theme }) => ({
  position: "relative",
  borderRadius: theme.shape.borderRadius,
  backgroundColor: alpha(theme.palette.common.white, 0.15),
  "&:hover": {
    backgroundColor: alpha(theme.palette.common.white, 0.25),
  },
  marginLeft: 0,
  width: "100%",
  [theme.breakpoints.up("sm")]: {
    marginLeft: theme.spacing(1),
    width: "auto",
  },
}));

const SearchIconWrapper = styled("div")(({ theme }) => ({
  padding: theme.spacing(0, 2),
  height: "100%",
  position: "absolute",
  pointerEvents: "none",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
}));

const StyledInputBase = styled(InputBase)(({ theme }) => ({
  color: "inherit",
  "& .MuiInputBase-input": {
    padding: theme.spacing(1, 1, 1, 0),
    // vertical padding + font size from searchIcon
    paddingLeft: `calc(1em + ${theme.spacing(4)})`,
    transition: theme.transitions.create("width"),
    width: "100%",
    [theme.breakpoints.up("sm")]: {
      width: "12ch",
      "&:focus": {
        width: "20ch",
      },
    },
  },
}));

const colors = [
  "#0275d8",
  "#5cb85c",
  "#f50057",
  "#5bc0de",
  "#f0ad4e",
  "#3f51b5",
  "#d9534f",
  "#292b2c",
];

type User = {
  id: number;
  username: string;
};

export default function AddingNewUser(props: {
  toggle: (user_id: number) => void;
  friends: any[];
}) {
  const [search, setSearch] = useState<string>("");
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<boolean>(false);
  const timer = React.useRef<number>();

  const handleInputChange = (event: {
    target: { value: React.SetStateAction<string> };
  }) => {
    setSearch(event.target.value);
    if (event.target.value !== "") {
      setLoading(true);
      searchUsersToAdd(event.target.value.toString());
    }
  };

  const searchUsersToAdd = (search: string) => {
    fetch(Constants.SERVER + "/api/searchUsersToAdd/" + search, {
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
            setUsers(data);
            timer.current = window.setTimeout(() => {
              setLoading(false);
            }, Constants.PROGRESS_ANIMATION_TIME);
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

  const handleClose = (group_friend_id: number) => {
    props.toggle(group_friend_id);
  };

  const isFiltred = (username: string) => {
    if (search === "") {
      return;
    } else if (username.toLowerCase().includes(search.toLowerCase())) {
      return;
    }
    return "none";
  };

  return (
    <div>
      <List
        sx={{
          width: "100%",
          maxWidth: 360,
          bgcolor: "background.paper",
        }}
        component="nav"
        aria-labelledby="nested-list-subheader"
        subheader={
          <ListSubheader
            component="div"
            id="nested-list-subheader"
            style={{ paddingLeft: "0", paddingRight: "0" }}
          >
            <AppBar position="static" color="transparent">
              <Toolbar>
                <IconButton
                  style={{
                    fontSize: "25px",
                    margin: "auto 10px auto 10px",
                  }}
                >
                  <CloseIcon />
                </IconButton>
                <Search>
                  <SearchIconWrapper>
                    <SearchIcon />
                  </SearchIconWrapper>
                  <StyledInputBase
                    placeholder="Search…"
                    inputProps={{ "aria-label": "search" }}
                    onChange={handleInputChange}
                    value={search}
                  />
                </Search>
              </Toolbar>
            </AppBar>
          </ListSubheader>
        }
      >
        <ListItemButton>Your friends:</ListItemButton>
        {props.friends.map(
          (
            friend: {
              id: number;
              username: string;
            },
            index: number
          ) => (
            <ListItemButton
              key={index}
              onClick={() => handleClose(friend.id)}
              style={{ display: isFiltred(friend.username) }}
            >
              <ListItemIcon>
                <PersonAddIcon
                  sx={{ color: colors[index % colors.length] }}
                  style={{ width: "2em", height: "2em" }}
                />
              </ListItemIcon>
              {friend.username}
            </ListItemButton>
          )
        )}
        {search ? (
          <div>
            <ListItemButton>Search results:</ListItemButton>
            <Fade in={loading} unmountOnExit>
              <LinearProgress sx={{ height: "8px" }} />
            </Fade>
            {users.length !== 0 ? (
              users.map((user, index) => (
                <ListItemButton
                  key={index}
                  onClick={() => handleClose(user.id)}
                  style={{ display: isFiltred(user.username) }}
                >
                  <ListItemIcon>
                    <PersonAddIcon
                      sx={{ color: colors[index % colors.length] }}
                      style={{ width: "2em", height: "2em" }}
                    />
                  </ListItemIcon>
                  {user.username}
                </ListItemButton>
              ))
            ) : (
              <ListItemButton style={{ fontStyle: "italic" }}>
                No users found
              </ListItemButton>
            )}
          </div>
        ) : null}
      </List>
    </div>
  );
}
