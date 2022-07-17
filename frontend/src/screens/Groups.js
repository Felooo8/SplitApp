import React, { useEffect, useState } from "react";
import styled, { css } from "styled-components";
import { Link, useNavigate } from "react-router-dom";
import Form from "react-bootstrap/Form";
import { Button } from "@material-ui/core";
import { Button as ButtonB } from "react-bootstrap/Button";

// import { getGroups } from "../apis/fetch";

function Groups(props) {
  const [groups, setGroups] = useState(undefined);

  const colors = [
    "#0275d8",
    "#5cb85c",
    "#f50057",
    "#5bc0de",
    "#f0ad4e",
    "#3f51b5",
    "#d9534f",
    "#292b2c",
  ];

  useEffect(() => {
    const getGroups = () => {
      fetch("http://127.0.0.1:8000/api/group", {
        method: "POST",
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
          console.log("PLease log in!");
        }
      });
    };
    getGroups();
    const interval = setInterval(() => {
      getGroups();
    }, 50000);
    return () => clearInterval(interval);
  }, []);
  if (groups == undefined) {
    console.log(groups);
    return <p>No groups :(</p>;
  }
  console.log(groups);
  return (
    <div>
      <p>Your groups:</p>
      <div>
        {groups.map((group, index) => (
          <div>
            <Button
              key={group.id}
              component={Link}
              to={`/mygroup/${group.id}`}
              variant="contained"
              color="primary"
              style={{
                backgroundColor: colors[index % colors.length],
                marginTop: "10px",
              }}
              spending={group.spent_by_category}
              state={{ id: group.id }}
            >
              {group.group_name}
            </Button>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Groups;

const groupButton = {
  marginRight: "10px",
  marginTop: "10px",
};
