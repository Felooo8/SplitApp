import { IconButton } from "@mui/material";
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import BottomAppBar from "../components/Appbar";
import GroupItem from "../components/GroupItem";
import SkeletonItem from "../components/SkeletonItem";
import Constants from "../apis/Constants";
import "../App.css";

// import { getGroups } from "../apis/fetch";

function Groups(props) {
  const [groups, setGroups] = useState([]);
  const [loading, setLoading] = useState(true);

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
          setLoading(false);
        });
      } else {
        console.log("Please log in!");
      }
    });
  };

  useEffect(() => {
    setLoading(true);
    const timer = setTimeout(() => {
      getGroups();
    }, Constants.LOADING_DATA_DELAY);
    return () => clearTimeout(timer);
  }, []);

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
            ))
          )}
        </div>
      )}
      <BottomAppBar value="groups" />
    </div>
  );
}

export default Groups;
