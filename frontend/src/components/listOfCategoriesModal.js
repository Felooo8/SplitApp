import CloseIcon from "@mui/icons-material/Close";
import SearchIcon from "@mui/icons-material/Search";
import { IconButton } from "@mui/material";
import AppBar from "@mui/material/AppBar";
import InputBase from "@mui/material/InputBase";
import List from "@mui/material/List";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListSubheader from "@mui/material/ListSubheader";
import { alpha, styled } from "@mui/material/styles";
import Toolbar from "@mui/material/Toolbar";
import React, { useState } from "react";

import Constants from "../apis/Constants";
import returnIcon from "../apis/returnIcon";

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

export default function ListOfCategories(props) {
  const [open] = useState(false);
  const [search, setSearch] = useState("");

  const handleInputChange = (event) => {
    setSearch(event.target.value);
  };

  const filtredCategories = Constants.CATEGORIES.filter((category) =>
    category.toLowerCase().includes(search.toLowerCase())
  );

  const handleClose = () => {
    props.toggleClose();
  };

  const handleSave = (e) => {
    props.toggleSave(e);
  };

  return (
    <div open={open}>
      <List
        sx={{ width: "100%", maxWidth: 360, bgcolor: "background.paper" }}
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
        {filtredCategories.length !== 0 ? (
          filtredCategories.map((category, index) => (
            <ListItemButton
              key={index}
              value={category}
              onClick={() => handleSave(category)}
            >
              <ListItemIcon>{returnIcon(category)}</ListItemIcon>
              {category}
            </ListItemButton>
          ))
        ) : (
          <ListItemButton style={{ fontStyle: "italic" }}>
            No category matches
          </ListItemButton>
        )}
      </List>
    </div>
  );
}
