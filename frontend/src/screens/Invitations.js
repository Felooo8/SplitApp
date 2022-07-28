import Stack from "@mui/material/Stack";
import React, { useEffect, useState } from "react";
import InvitationItem from "../components/InvitationItem";
import BottomAppBar from "../components/Appbar";

function Invitations(props) {
  const [invitations, setInvitations] = useState([]);

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
    findFriends();
    // seeFriends();
  }, []);
  if (invitations === []) {
    return <p>Loading...</p>;
  }
  return (
    <div>
      <p>Search results:</p>
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
      <BottomAppBar value="notifications" />
    </div>
  );
}

export default Invitations;
