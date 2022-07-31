import Stack from "@mui/material/Stack";
import React, { useEffect, useState } from "react";
import InvitationItem from "../components/InvitationItem";
import BottomAppBar from "../components/Appbar";
import SkeletonItem from "../components/SkeletonItem";
import NotificationsNoneIcon from "@mui/icons-material/NotificationsNone";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import Constants from "../apis/Constants";

function Notifications(props) {
  const [invitations, setInvitations] = useState([]);
  const [loading, setLoading] = useState(true);

  const findFriends = () => {
    fetch("http://127.0.0.1:8000/api/getInvitations", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Token ${localStorage.getItem("token")}`,
      },
    })
      .then((response) => response.json())
      .then((data) => {
        console.log(data);
        setInvitations(data);
      });
  };

  const reRenderToggle = () => {
    findFriends();
  };

  useEffect(() => {
    setLoading(true);
    const timer = setTimeout(() => {
      findFriends();
      setLoading(false);
    }, Constants.LOADING_DATA_DELAY);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div>
      {loading ? (
        <SkeletonItem header={true} />
      ) : (
        <div>
          {invitations.length === 0 ? (
            <div style={{ marginTop: "10em" }}>
              <NotificationsNoneIcon style={icon} />
              <h5>No notifications yet</h5>
              <Typography variant="subtitle1" gutterBottom component="div">
                When you get notifications, they'll show up here
              </Typography>
              <Button variant="outlined" onClick={findFriends}>
                Refresh
              </Button>
            </div>
          ) : (
            <Stack spacing={2} style={{ marginBottom: "10px" }}>
              {invitations.map((invitation, index) => (
                <InvitationItem
                  key={index}
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
