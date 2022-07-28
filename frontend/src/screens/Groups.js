import { IconButton } from "@mui/material";
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import BottomAppBar from "../components/Appbar";
import GroupItem from "../components/GroupItem";

// import { getGroups } from "../apis/fetch";

function Groups(props) {
  const [groups, setGroups] = useState([]);

  useEffect(() => {
    const getGroups = () => {
      fetch("http://127.0.0.1:8000/api/group", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Token ${localStorage.getItem("token")}`,
        },
      }).then((response) => {
        if (response.ok) {
          response.json().then((data) => {
            setGroups(data);
          });
        } else {
          console.log("Please log in!");
        }
      });
    };
    getGroups();
    const interval = setInterval(() => {
      getGroups();
    }, 50000);
    return () => clearInterval(interval);
  }, []);
  if (groups === []) {
    return <p>No groups :(</p>;
  }
  console.log(groups);
  return (
    <div>
      <p>Your groups:</p>
      <div>
        {groups.map((group, index) => (
          <div key={index}>
            <IconButton
              component={Link}
              to={`/mygroup/${group.id}/${group.group_name}`}
              // variant="contained"
              // color="primary"
              style={{
                // backgroundColor: colors[index % colors.length],
                // marginTop: "10px",
                textDecoration: "none",
                width: "100%",
              }}
              spending={group.spent_by_category}
              state={{ id: group.id }}
            >
              <GroupItem
                name={group.group_name}
                index={index}
                balance={group.balance}
              />
            </IconButton>
          </div>
        ))}
      </div>
      <BottomAppBar value="groups" />
    </div>
  );
}

export default Groups;
