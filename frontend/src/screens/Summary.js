import React, { useEffect, useState } from "react";
import Stack from "@mui/material/Stack";
import SummaryItem from "../components/SummaryItem";
import BottomAppBar from "../components/Appbar";

function Summary(props) {
  const [summaries, setSummaries] = useState({});
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

  useEffect(() => {
    getUser();
    getSummarize();
  }, []);
  if (summaries === undefined || currentUser === undefined) {
    return <p>Loading...</p>;
  }
  return (
    <div>
      <p>Your summary:</p>
      <Stack spacing={2}>
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
      <BottomAppBar value="summary" />
    </div>
  );
}

export default Summary;
