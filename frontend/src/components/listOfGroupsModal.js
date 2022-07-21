import React, { useEffect, useState } from "react";
import { styled as style } from "styled-components";
import { styled, alpha } from "@mui/material/styles";
import List from "@mui/material/List";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListSubheader from "@mui/material/ListSubheader";
import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import InputBase from "@mui/material/InputBase";
import SearchIcon from "@mui/icons-material/Search";
import GroupAddIcon from "@mui/icons-material/GroupAdd";
import PersonAddIcon from "@mui/icons-material/PersonAdd";

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
  const [open, setOpen] = useState(false);
  const [groups, setGroups] = useState(undefined);
  const [search, setSearch] = useState("");

  const handleInputChange = (event) => {
    setSearch(event.target.value);
  };

  const handleClose = (group_friend_id, isGroup, group_friend_name) => {
    props.toggle(group_friend_id, isGroup, group_friend_name);
  };

  const isFiltred = (category) => {
    if (search == "") {
      return;
    } else if (category.toLowerCase().includes(search.toLowerCase())) {
      return;
    }
    return "none";
  };

  return (
    <div open={open}>
      <List
        sx={{
          width: "100%",
          maxWidth: 360,
          bgcolor: "background.paper",
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
                {/* <Typography
                  variant="h6"
                  noWrap
                  component="div"
                  sx={{ flexGrow: 1 }}
                >
                  Pick Category
                </Typography> */}
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
        {props.groups.map((group, index) => (
          <ListItemButton
            key={index}
            value={group.id}
            onClick={() => handleClose(group.id, true, group.group_name)}
            style={{ display: isFiltred(group.group_name) }}
          >
            <ListItemIcon>
              <GroupAddIcon
                sx={{ color: colors[index % colors.length] }}
                style={{ width: "2em", height: "2em" }}
              />
            </ListItemIcon>
            {group.group_name}
          </ListItemButton>
        ))}
        <ListItemButton>Your friends:</ListItemButton>
        {props.friends.map((friend, index) => (
          <ListItemButton
            key={index}
            value={friend.id}
            onClick={() => handleClose(friend.id, false, friend.username)}
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
        ))}
      </List>
    </div>
  );
}

const categoryIconSize = "60px";

const icon = {
  top: "0",
  left: "0",
  color: "rgba(128,128,128,1)",
  fontSize: "56",
  height: categoryIconSize,
  width: categoryIconSize,
  display: "table",
  marginTop: "auto",
  marginBottom: "auto",
};
