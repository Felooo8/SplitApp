import Alert from "@mui/material/Alert";
import Slide, { SlideProps } from "@mui/material/Slide";
import Snackbar from "@mui/material/Snackbar";
import Stack from "@mui/material/Stack";
import React, { SyntheticEvent, useEffect, useState } from "react";
import { useParams } from "react-router-dom";

import Constants from "../apis/Constants";
import BottomAppBar from "../components/Appbar";
import Error from "../components/Error";
import SearchResult from "../components/SearchResult";
import SkeletonItem from "../components/SkeletonItem";

type User = {
  id: number;
  username: string;
};

function SlideTransition(props: JSX.IntrinsicAttributes & SlideProps) {
  return <Slide {...props} direction="left" />;
}

function FriendsFinder() {
  const [users, setUsers] = useState<User[]>([]);
  const [friends, setFriends] = useState<number[]>([]);
  const [sent, setSent] = useState<number[]>([]);
  const [pending, setPending] = useState<number[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<boolean>(false);
  const [lastAction, setLastAction] = useState<string>("");
  const [openSnackBar, setOpenSnackBar] = useState<boolean>(false);
  const params = useParams();

  const findFriends = () => {
    fetch(Constants.SERVER + "/api/findFriends/" + params.search, {
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
          throw Error("Something went wrong");
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

  const reRenderToggle = (action: React.SetStateAction<string>) => {
    setLastAction(action);
    setOpenSnackBar(true);
    findFriends();
  };

  const errorToggle = () => {
    setError(true);
  };

  const isFriend = (id: number) => {
    return friends.includes(id);
  };

  const isPending = (id: number) => {
    return pending.includes(id);
  };

  const isSent = (id: number) => {
    return sent.includes(id);
  };

  const handleCloseSnackBar = (
    event: Event | SyntheticEvent<Element, Event>,
    reason: string
  ) => {
    if (reason === "clickaway") {
      return;
    }
    setOpenSnackBar(false);
  };

  const handleCloseSnackBarAlert = (event: SyntheticEvent<Element, Event>) => {
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
          onClose={handleCloseSnackBarAlert}
          severity="info"
          sx={{ width: "100%" }}
          elevation={6}
          variant="filled"
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
