import React, { useEffect, useState } from "react";
import Stack from "@mui/material/Stack";
import SearchResult from "../components/SearchResult";
import { useParams } from "react-router-dom";

function FriendsFinder(props) {
  const [users, setUsers] = useState([]);
  const [friends, setFriends] = useState([]);
  const [sent, setSent] = useState([]);
  const [pending, setPending] = useState([]);
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
      .then((response) => response.json())
      .then((data) => {
        console.log(data);
        setUsers(data["users"]);
        setFriends(data["friends"]);
        setSent(data["sent"]);
        setPending(data["pending"]);
      });
  };

  const reRenderToggle = () => {
    findFriends();
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

  useEffect(() => {
    findFriends();
    // seeFriends();
  }, []);
  if (users === []) {
    return <p>Loading...</p>;
  }
  return (
    <div>
      <p>Search results:</p>
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
          />
        ))}
      </Stack>
    </div>
  );
}

export default FriendsFinder;
