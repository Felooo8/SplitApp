import { AccountCircle, PersonAdd } from "@material-ui/icons";
import { Divider, ListItemIcon, Menu, MenuItem, Tooltip } from "@mui/material";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import IconButton from "@mui/material/IconButton";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import Avatar from "@mui/material/Avatar";
import LoginIcon from "@mui/icons-material/Login";
import Logout from "@mui/icons-material/Logout";
import * as React from "react";

import { logout } from "../apis/auth";
import SearchBar from "./SearchBar";

type Props = {
  username: string;
  isAuth: boolean;
};

export default function SearchAppBar(props: Props) {
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const username = localStorage.getItem("UserName");
  const isAuth = Boolean(localStorage.getItem("token"));
  const handleLogout = () => {
    logout();
    localStorage.clear();
    window.location.replace("/login");
  };

  const handleAction = (url: string) => {
    window.location.replace(url);
  };

  const handleMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  return (
    <Box sx={{ flexGrow: 1 }} style={{ marginBottom: "75px", zIndex: 100 }}>
      <AppBar
        position="static"
        style={{ position: "fixed", top: "0", zIndex: "100" }}
      >
        <Toolbar
          style={{ maxWidth: "500px", margin: "auto", width: "inherit" }}
        >
          {props.isAuth ? <SearchBar /> : null}
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
                <Typography>{props.username}</Typography>
                <AccountCircle />
              </IconButton>
            </Tooltip>
            <Menu
              anchorEl={anchorEl}
              id="account-menu"
              open={Boolean(anchorEl)}
              onClose={handleClose}
              onClick={handleClose}
              PaperProps={{
                elevation: 0,
                sx: {
                  overflow: "visible",
                  filter: "drop-shadow(0px 2px 8px rgba(0,0,0,0.32))",
                  mt: 1.5,
                  "& .MuiAvatar-root": {
                    width: 32,
                    height: 32,
                    ml: -0.5,
                    mr: 1,
                  },
                  "&:before": {
                    content: '""',
                    display: "block",
                    position: "absolute",
                    top: 0,
                    right: 14,
                    width: 10,
                    height: 10,
                    bgcolor: "background.paper",
                    transform: "translateY(-50%) rotate(45deg)",
                    zIndex: 0,
                  },
                },
              }}
              transformOrigin={{ horizontal: "right", vertical: "top" }}
              anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
            >
              {isAuth ? (
                <Box>
                  <MenuItem style={{ minHeight: "20px" }}>{username}</MenuItem>
                  <Divider />
                  <MenuItem onClick={() => handleAction("/profile")}>
                    <Avatar />
                    Profile
                  </MenuItem>
                  {/* <MenuItem onClick={handleClose}>
                    <Avatar />
                    My account
                  </MenuItem> */}
                  <MenuItem onClick={handleLogout}>
                    <ListItemIcon>
                      <Logout fontSize="small" />
                    </ListItemIcon>
                    Logout
                  </MenuItem>
                </Box>
              ) : (
                <Box>
                  <MenuItem style={{ minHeight: "20px" }}>Guest</MenuItem>
                  <Divider />
                  <MenuItem onClick={() => handleAction("/login")}>
                    <LoginIcon />
                    Login
                  </MenuItem>
                  <MenuItem onClick={() => handleAction("/sign-up")}>
                    <PersonAdd fontSize="small" />
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
