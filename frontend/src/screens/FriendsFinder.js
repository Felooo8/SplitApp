import React, { useEffect, useState } from "react";
import Stack from "@mui/material/Stack";
import SearchResult from "../components/SearchResult";
import { useParams } from "react-router-dom";

function FriendsFinder(props) {
  const [users, setUsers] = useState([]);
  const [friends, setFriends] = useState([]);
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
        setUsers(data[0]);
        setFriends(data[1]);
      });
  };

  // const seeFriends = () => {
  //   fetch("http://127.0.0.1:8000/api/seeFriends", {
  //     method: "GET",
  //     headers: {
  //       "Content-Type": "application/json",
  //       Authorization: `Token ${localStorage.getItem("token")}`,
  //     },
  //   })
  //     .then((response) => response.json())
  //     .then((data) => {
  //       console.log(data);
  //       setFriends(data);
  //     });
  // };

  const isFriend = (index) => {
    return friends.includes(index);
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
      <Stack spacing={2}>
        {users.map((user, index) => (
          <SearchResult
            key={index}
            user={user}
            index={index}
            isFriend={isFriend(user.id)}
          />
        ))}
      </Stack>
    </div>
  );
}

export default FriendsFinder;
