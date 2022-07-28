import React, { useEffect, useState } from "react";
import Stack from "@mui/material/Stack";
import SummaryItem from "../components/SummaryItem";
import BottomAppBar from "../components/Appbar";

function Summary(props) {
  const [summaries, setSummaries] = useState({});
  const [total, setTotal] = useState(null);
  const [currentUser, setCurrentUser] = useState(undefined);

  const getSummarize = () => {
    fetch("http://127.0.0.1:8000/api/summarize", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Token ${localStorage.getItem("token")}`,
      },
    })
      .then((response) => response.json())
      .then((data) => {
        console.log(data);
        setSummaries(data);
        inTotal(data);
      });
  };

  const getUser = () => {
    fetch("http://127.0.0.1:8000/api/auth/users/me/", {
      headers: {
        Authorization: `Token ${localStorage.getItem("token")}`,
      },
    }).then((res) => {
      if (res.ok) {
        res.json().then((data) => {
          setCurrentUser(data);
        });
      } else {
        console.log("Not logged in");
      }
    });
  };

  const Overrall = () => {
    if (total > 0) {
      return (
        <h5 style={{ color: "orange", padding: "10px" }}>
          Overall, you owe ${Math.abs(total)}
        </h5>
      );
    }
    return (
      <h5 style={{ color: "green", padding: "10px" }}>
        Overall, people owe you ${Math.abs(total).toFixed(2)}
      </h5>
    );
  };

  const inTotal = (summaries) => {
    var total = 0;
    for (let key in summaries) {
      total += summaries[key];
    }
    setTotal(total);
  };

  useEffect(() => {
    getUser();
    getSummarize();
  }, []);
  if (summaries === undefined || currentUser === undefined) {
    return <p>Loading...</p>;
  }
  return (
    <div>
      {total !== null ? Overrall() : null}
      <Stack spacing={2} style={{ marginBottom: "10px" }}>
        {Object.entries(summaries).map(([key, value], index) => (
          <SummaryItem
            key={index}
            username={key}
            debt={value}
            index={index}
            currentUser={currentUser}
          />
        ))}
      </Stack>
      <BottomAppBar value="home" />
    </div>
  );
}

export default Summary;
