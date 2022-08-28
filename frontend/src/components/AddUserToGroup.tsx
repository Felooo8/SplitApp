import CloseIcon from "@mui/icons-material/Close";
import PersonAddIcon from "@mui/icons-material/PersonAdd";
import SearchIcon from "@mui/icons-material/Search";
import {
  CircularProgress,
  Divider,
  Fade,
  IconButton,
  LinearProgress,
} from "@mui/material";
import AppBar from "@mui/material/AppBar";
import List from "@mui/material/List";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListSubheader from "@mui/material/ListSubheader";
import Toolbar from "@mui/material/Toolbar";
import React, { useEffect, useState } from "react";

import Constants from "../apis/Constants";
import {
  colors,
  Search,
  SearchIconWrapper,
  StyledInputBase,
} from "./AppBarTopSeatch";

type User = {
  id: number;
  username: string;
};

export default function AddUserToGroup(props: any) {
  const [search, setSearch] = useState<string>("");
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [loadingFriends, setLoadingFriends] = useState<boolean>(false);
  const [friends, setFriends] = useState([]);
  const timer = React.useRef<number>();
  const [errors, setErrors] = useState({
    friends: false,
    request: false,
  });

  const filtredFriends = friends.filter((friend: User) =>
    friend.username.toLowerCase().includes(search.toLowerCase())
  );

  const filtredUsers = users.filter((user: User) =>
    user.username.toLowerCase().includes(search.toLowerCase())
  );

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
    fetch(
      Constants.SERVER + "/api/searchUsersToAdd/" + search + "/" + props.id,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Token ${localStorage.getItem("token")}`,
        },
      }
    )
      .then((response) => {
        if (response.ok) {
          response.json().then((data) => {
            console.log(data);
            setUsers(data);
            timer.current = window.setTimeout(() => {
              setLoading(false);
            }, Constants.PROGRESS_ANIMATION_TIME);
            setErrors((errors) => ({
              ...errors,
              request: false,
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
          request: false,
        }));
        const timer = setTimeout(() => {
          setLoading(false);
        }, Constants.PROGRESS_ANIMATION_TIME);
        return () => clearTimeout(timer);
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
            const timer = setTimeout(() => {
              setLoadingFriends(false);
            }, 1000);
            setErrors((errors) => ({
              ...errors,
              friends: false,
            }));
            return () => clearTimeout(timer);
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
        const timer = setTimeout(() => {
          setLoadingFriends(false);
        }, 1000);
        return () => clearTimeout(timer);
      });
  };
  const refresh = () => {
    setLoadingFriends(true);
    getFriends();
  };

  useEffect(() => {
    setLoading(true);
    const timer2 = setTimeout(() => {
      setLoading(false);
    }, Constants.PROGRESS_ANIMATION_TIME);
    const timer = setTimeout(() => {
      getFriends();
    }, Constants.LOADING_DATA_DELAY);
    return () => {
      clearTimeout(timer);
      clearTimeout(timer2);
    };
  }, []);

  const handleSave = (user_id: number, username: string) => {
    props.toggleSave(user_id, username);
  };

  const handleClose = () => {
    props.toggleClose();
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
        <Divider style={{ marginBottom: "20px" }} />
        <ListItemButton>Your friends:</ListItemButton>
        <Fade in={loadingFriends} unmountOnExit>
          <CircularProgress
            style={{ margin: "auto", display: "block" }}
            sx={{ height: "8px" }}
          />
        </Fade>
        {filtredFriends.length !== 0 ? (
          filtredFriends.map((friend: User, index) => (
            <ListItemButton
              key={index}
              onClick={() => handleSave(friend.id, friend.username)}
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
          // <Button
          //   style={{ margin: "10px auto", display: "block" }}
          //   variant="outlined"
          //   onClick={refresh}
          // >
          //   Refresh
          // </Button>
        )}
        {search ? (
          <div>
            <Divider />
            <ListItemButton>Search results:</ListItemButton>
            <Fade in={loading} unmountOnExit>
              <LinearProgress sx={{ height: "8px" }} />
            </Fade>
            {filtredUsers.length !== 0 ? (
              filtredUsers.map((user, index) => (
                <ListItemButton
                  key={index}
                  onClick={() => handleSave(user.id, user.username)}
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
