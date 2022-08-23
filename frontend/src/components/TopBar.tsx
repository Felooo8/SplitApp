import { AccountCircle } from "@material-ui/icons";
import { Divider, Menu, MenuItem, Tooltip } from "@mui/material";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import IconButton from "@mui/material/IconButton";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import * as React from "react";

import { logout } from "../apis/auth";
import SearchBar from "./SearchBar";

const widthSearchExpanded = 350;

export default function SearchAppBar() {
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const [currentUser, setCurrentUser] = React.useState<any>(undefined);

  const handleLogout = () => {
    logout();
    localStorage.clear();
    window.location.replace("/login");
  };

  const handleAction = (url: string) => {
    window.location.replace(url);
  };

  const showUserName = () => {
    if (currentUser !== undefined || currentUser !== null) {
      return currentUser;
    }
    return "Guest";
  };

  const getUsername = () => {
    let username = localStorage.getItem("UserName");
    if (username !== undefined || username !== null) {
      setCurrentUser(localStorage.getItem("UserName"));
    }
  };
  const handleMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  React.useEffect(() => {
    getUsername();
  }, []);

  return (
    <Box sx={{ flexGrow: 1 }} style={{ marginBottom: "75px" }}>
      <AppBar
        position="static"
        style={{ position: "fixed", top: "0", zIndex: "100" }}
      >
        <Toolbar
          style={{ maxWidth: "600px", margin: "auto", width: "inherit" }}
        >
          <SearchBar />
          <Box sx={{ flexGrow: 0 }} style={{ marginLeft: "auto" }}>
            <Tooltip title="Open settings">
              <IconButton
                size="large"
                aria-label="account of current user"
                aria-controls="menu-appbar"
                aria-haspopup="true"
                onClick={handleMenu}
                color="inherit"
              >
                <Typography>{showUserName()}</Typography>
                <AccountCircle />
              </IconButton>
            </Tooltip>
            <Menu
              id="menu-appbar"
              anchorEl={anchorEl}
              anchorOrigin={{
                vertical: "top",
                horizontal: "right",
              }}
              keepMounted
              transformOrigin={{
                vertical: "top",
                horizontal: "right",
              }}
              open={Boolean(anchorEl)}
              onClose={handleClose}
            >
              {currentUser ? (
                <Box>
                  <MenuItem>{showUserName()}</MenuItem>
                  <Divider />
                  <MenuItem onClick={handleClose}>Profile</MenuItem>
                  <MenuItem onClick={handleClose}>My account</MenuItem>
                  <MenuItem onClick={handleLogout}>Logout</MenuItem>
                </Box>
              ) : (
                <Box>
                  <MenuItem onClick={() => handleAction("/login")}>
                    Login
                  </MenuItem>
                  <MenuItem onClick={() => handleAction("/sign-up")}>
                    Sign Up
                  </MenuItem>
                </Box>
              )}
            </Menu>
          </Box>
        </Toolbar>
      </AppBar>
    </Box>
  );
}
