import SearchIcon from "@mui/icons-material/Search";
import IconButton from "@mui/material/IconButton";
import InputBase from "@mui/material/InputBase";
import { alpha, styled } from "@mui/material/styles";
import React, { useState } from "react";
import Form from "react-bootstrap/Form";

const SearchBar = styled("div")(({ theme }) => ({
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

export default function Search() {
  const [search, setSearch] = useState("");

  const handleSumbit = () => {
    const location = "/friends/" + search;
    window.history.pushState({ search: search }, undefined, location);
  };

  const isValid = () => {
    return search !== "";
  };

  return (
    <SearchBar
      style={{
        marginLeft: "auto",
        marginRight: "0px",
      }}
    >
      <Form
        onSubmit={handleSumbit}
        style={{
          display: "block",
        }}
      >
        <IconButton disabled={!isValid()} type="submit">
          <SearchIcon />
        </IconButton>
        <StyledInputBase
          placeholder="Search…"
          inputProps={{ "aria-label": "search" }}
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </Form>
    </SearchBar>
  );
}
