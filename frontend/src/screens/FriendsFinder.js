import React, { useEffect, useState } from "react";
import Stack from "@mui/material/Stack";
import SearchResult from "../components/SearchResult";
import { useParams } from "react-router-dom";
import SkeletonItem from "../components/SkeletonItem";
import Constants from "../apis/Constants";
import BottomAppBar from "../components/Appbar";
import Error from "../components/Error";
import Snackbar from "@mui/material/Snackbar";
import MuiAlert from "@mui/material/Alert";
import Slide from "@mui/material/Slide";

const Alert = React.forwardRef(function Alert(props, ref) {
  return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

function SlideTransition(props) {
  return <Slide {...props} direction="left" />;
}

function FriendsFinder(props) {
  const [users, setUsers] = useState([]);
  const [friends, setFriends] = useState([]);
  const [sent, setSent] = useState([]);
  const [pending, setPending] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [lastAction, setLastAction] = useState("");
  const [openSnackBar, setOpenSnackBar] = useState(false);
  // const [currentUser, setCurrentUser] = useState(undefined);
  const params = useParams();

  const findFriends = () => {
    fetch("http://127.0.0.1:8000/api/findFriends/" + params.search, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Token ${localStorage.getItem("token")}`,
      },
    })
      .then((response) => {
        if (response.ok) {
          response.json().then((data) => {
            setUsers(data["users"]);
            setFriends(data["friends"]);
            setSent(data["sent"]);
            setPending(data["pending"]);
            setLoading(false);
            setError(false);
          });
        } else {
          throw new Error("Something went wrong");
        }
      })
      .catch((error) => {
        console.log(error);
        setError(true);
      });
  };

  const alertMessage = () => {
    switch (lastAction) {
      case "acc":
        return "Accepted invitation";
      case "inv":
        return "Sent invitation";
      case "rem":
        return "Friend removed";
      case "dec":
        return "Friends invitation declined";
      case "can":
        return "Invitation canceled";
      default:
        return "Request sent";
    }
  };

  const reRenderToggle = (action) => {
    setLastAction(action);
    setOpenSnackBar(true);
    findFriends();
  };

  const errorToggle = () => {
    setError(true);
  };

  const isFriend = (id) => {
    return friends.includes(id);
  };

  const isPending = (id) => {
    return pending.includes(id);
  };

  const isSent = (id) => {
    return sent.includes(id);
  };

  const handleCloseSnackBar = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }
    setOpenSnackBar(false);
  };

  useEffect(() => {
    setLoading(true);
    const timer = setTimeout(() => {
      findFriends();
    }, Constants.LOADING_DATA_DELAY);
    return () => clearTimeout(timer);
  }, []);

  const toggleFetch = () => {
    findFriends();
  };

  if (error) {
    return (
      <div>
        <Error toggle={toggleFetch} />
        <BottomAppBar />
      </div>
    );
  }

  return (
    <div>
      <Snackbar
        open={openSnackBar}
        autoHideDuration={6000}
        onClose={handleCloseSnackBar}
        anchorOrigin={{
          vertical: "top",
          horizontal: "center",
        }}
        TransitionComponent={SlideTransition}
      >
        <Alert
          onClose={handleCloseSnackBar}
          severity="info"
          sx={{ width: "100%" }}
        >
          {alertMessage()}
        </Alert>
      </Snackbar>
      {loading ? (
        <SkeletonItem header={true} />
      ) : (
        <div>
          <h5>Search results:</h5>
          <Stack spacing={2} style={{ marginBottom: "10px" }}>
            {users.map((user, index) => (
              <SearchResult
                key={index}
                user={user}
                index={index}
                isFriend={isFriend(user.id)}
                isSent={isSent(user.id)}
                isPending={isPending(user.id)}
                toggle={reRenderToggle}
                errorToggle={errorToggle}
              />
            ))}
          </Stack>
        </div>
      )}
      <BottomAppBar />
    </div>
  );
}

export default FriendsFinder;
