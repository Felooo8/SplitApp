import NotificationsNoneIcon from "@mui/icons-material/NotificationsNone";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import CircularProgress from "@mui/material/CircularProgress";
import Fade from "@mui/material/Fade";
import LinearProgress from "@mui/material/LinearProgress";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import React, { useEffect, useState } from "react";
import Constants from "../apis/Constants";
import BottomAppBar from "../components/Appbar";
import Error from "../components/Error";
import InvitationItem from "../components/InvitationItem";
import SkeletonItem from "../components/SkeletonItem";

type Invitation = {
  id: number;
  invited: number;
  sender: number;
  sender_username: string;
};

function Notifications() {
  const [invitations, setInvitations] = useState<Invitation[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [refreshing, setRefreshing] = useState<boolean>(false);
  const [error, setError] = useState<boolean>(false);
  const timer = React.useRef<number>();

  const getInvitations = () => {
    fetch(Constants.SERVER + "/api/getInvitations", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Token ${localStorage.getItem("token")}`,
      },
    })
      .then((response) => {
        if (response.ok) {
          response.json().then((data) => {
            setInvitations(data);
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

  const reRenderToggle = () => {
    getInvitations();
  };

  useEffect(() => {
    setLoading(true);
    const timer = setTimeout(() => {
      getInvitations();
    }, Constants.LOADING_DATA_DELAY);
    return () => {
      clearTimeout(timer);
    };
  }, []);

  const toggleFetch = () => {
    getInvitations();
    console.log(invitations);
    console.log(invitations === []);
  };

  const refresh = () => {
    setRefreshing(true);
    timer.current = window.setTimeout(() => {
      setRefreshing(false);
    }, Constants.PROGRESS_ANIMATION_TIME);
    getInvitations();
  };

  if (error) {
    return (
      <div>
        <Error toggle={toggleFetch} />
        <BottomAppBar value="notifications" />
      </div>
    );
  }

  return (
    <div>
      {loading ? (
        <SkeletonItem header={true} />
      ) : (
        <div>
          <Box
            style={{
              position: "absolute",
              left: "0",
              right: "0",
              bottom: "56px",
              zIndex: "10",
            }}
          >
            <Fade in={refreshing} unmountOnExit>
              <LinearProgress sx={{ height: "8px" }} />
            </Fade>
          </Box>
          {invitations.length === 0 ? (
            <div style={{ marginTop: "10em" }}>
              <NotificationsNoneIcon style={icon} />
              <h5>No notifications yet</h5>
              <Typography variant="subtitle1" gutterBottom component="div">
                When you get notifications, they'll show up here
              </Typography>
              <Button variant="outlined" onClick={refresh}>
                Refresh
              </Button>
              <Box
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  marginTop: "1rem",
                }}
              >
                <Fade in={refreshing} unmountOnExit>
                  <CircularProgress />
                </Fade>
              </Box>
            </div>
          ) : (
            <Stack spacing={2} style={{ marginBottom: "10px" }}>
              {invitations.map((invitation, index) => (
                <InvitationItem
                  key={invitation.id}
                  invitation={invitation}
                  index={index}
                  toggle={reRenderToggle}
                />
              ))}
            </Stack>
          )}
        </div>
      )}
      <BottomAppBar value="notifications" />
    </div>
  );
}

export default Notifications;

const IconSize = "140px";

const icon = {
  top: "0",
  left: "0",
  fontSize: "56",
  height: IconSize,
  width: IconSize,
  display: "table",
  margin: "auto",
};
