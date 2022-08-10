import "../App.css";

import { IconButton } from "@mui/material";
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";

import Constants from "../apis/Constants";
import BottomAppBar from "../components/Appbar";
import Error from "../components/Error";
import GroupItem from "../components/GroupItem";
import SkeletonItem from "../components/SkeletonItem";

// import { getGroups } from "../apis/fetch";

type Group = {
  id: number;
  spent_by_category: number;
  group_name: string;
  balance: number;
};

function Groups() {
  const [groups, setGroups] = useState<Group[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<boolean>(false);

  const getGroups = () => {
    fetch(Constants.SERVER + "/api/group", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Token ${localStorage.getItem("token")}`,
      },
    })
      .then((response) => {
        if (response.ok) {
          response.json().then((data) => {
            setGroups(data);
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

  const toggleFetch = () => {
    getGroups();
  };

  useEffect(() => {
    setLoading(true);
    const timer = setTimeout(() => {
      getGroups();
    }, Constants.LOADING_DATA_DELAY);
    return () => clearTimeout(timer);
  }, []);

  if (error) {
    return (
      <div>
        <Error toggle={toggleFetch} />
        <BottomAppBar value="groups" />
      </div>
    );
  }

  console.log(groups);
  return (
    <div>
      {loading ? (
        <SkeletonItem header={true} />
      ) : (
        <div>
          <h5>All your groups:</h5>
          {groups.length === 0 ? (
            <h3>Currently you are not in any group</h3>
          ) : (
            groups.map((group, index) => (
              <div key={index}>
                <IconButton
                  component={Link}
                  to={`/mygroup/${group.id}/${group.group_name}`}
                  // variant="contained"
                  // color="default"
                  style={{
                    textDecoration: "none",
                    width: "100%",
                  }}
                >
                  <GroupItem
                    name={group.group_name}
                    index={index}
                    balance={group.balance}
                    id={group.id}
                  />
                </IconButton>
              </div>
            ))
          )}
        </div>
      )}
      <BottomAppBar value="groups" />
    </div>
  );
}

export default Groups;
