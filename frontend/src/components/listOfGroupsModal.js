import CloseIcon from "@mui/icons-material/Close";
import GroupAddIcon from "@mui/icons-material/GroupAdd";
import PersonAddIcon from "@mui/icons-material/PersonAdd";
import SearchIcon from "@mui/icons-material/Search";
import { Divider, IconButton } from "@mui/material";
import AppBar from "@mui/material/AppBar";
import InputBase from "@mui/material/InputBase";
import List from "@mui/material/List";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListSubheader from "@mui/material/ListSubheader";
import { alpha, styled } from "@mui/material/styles";
import Toolbar from "@mui/material/Toolbar";
import React, { useState } from "react";

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

export default function ListOfGroupsModal(props) {
  const [open] = useState(false);
  const [search, setSearch] = useState("");

  const handleInputChange = (event) => {
    setSearch(event.target.value);
  };

  const filtredFriends = props.friends.filter((friend) =>
    friend.username.toLowerCase().includes(search.toLowerCase())
  );

  const filtredGroups = props.groups.filter((group) =>
    group.group_name.toLowerCase().includes(search.toLowerCase())
  );

  const handleClose = () => {
    props.toggleClose();
  };

  const handleSave = (group_friend_id, isGroup, group_friend_name) => {
    props.toggleSave(group_friend_id, isGroup, group_friend_name);
  };

  return (
    <div open={open}>
      <List
        sx={{
          width: "100%",
          bgcolor: "background.paper",
          position: "relative",
          overflow: "auto",
          height: "100vh",
          "& ul": { padding: 0 },
        }}
        component="nav"
        style={{
          borderStyle: "solid",
          borderColor: "#1976d2",
        }}
        aria-labelledby="nested-list-subheader"
        subheader={
          <ListSubheader
            component="div"
            id="nested-list-subheader"
            style={{ paddingLeft: "0", paddingRight: "0" }}
          >
            <AppBar position="static">
              <Toolbar>
                <IconButton
                  style={{
                    fontSize: "25px",
                    margin: "auto 10px auto 10px",
                  }}
                  onClick={handleClose}
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
        <ListItemButton>Your groups:</ListItemButton>
        {filtredGroups.length !== 0 ? (
          filtredGroups.map((group, index) => (
            <ListItemButton
              key={index}
              value={group.id}
              onClick={() => handleSave(group.id, true, group.group_name)}
            >
              <ListItemIcon>
                <GroupAddIcon
                  sx={{ color: colors[index % colors.length] }}
                  style={{ width: "2em", height: "2em" }}
                />
              </ListItemIcon>
              {group.group_name}
            </ListItemButton>
          ))
        ) : (
          <ListItemButton style={{ fontStyle: "italic" }}>
            No group matches
          </ListItemButton>
        )}
        <Divider />
        <ListItemButton>Your friends:</ListItemButton>
        {filtredFriends.length !== 0 ? (
          filtredFriends.map((friend, index) => (
            <ListItemButton
              key={index}
              value={friend.id}
              onClick={() => handleSave(friend.id, false, friend.username)}
            >
              <ListItemIcon>
                <PersonAddIcon
                  sx={{ color: colors[index % colors.length] }}
                  style={{ width: "2em", height: "2em" }}
                />
              </ListItemIcon>
              {friend.username}
            </ListItemButton>
          ))
        ) : (
          <ListItemButton style={{ fontStyle: "italic" }}>
            No friend matches
          </ListItemButton>
        )}
      </List>
    </div>
  );
}
