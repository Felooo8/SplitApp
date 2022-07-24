import React, { useEffect, useState, useReducer } from "react";
import Stack from "@mui/material/Stack";
import ExpenseItem from "../components/Expense";
import Radio from "@mui/material/Radio";
import RadioGroup from "@mui/material/RadioGroup";
import FormControlLabel from "@mui/material/FormControlLabel";
import FormControl from "@mui/material/FormControl";
import FormLabel from "@mui/material/FormLabel";
import Checkbox from "@mui/material/Checkbox";

function AllExpenses(props) {
  const [userExpenses, setUserExpenses] = useState(undefined);
  const [currentUser, setCurrentUser] = useState(undefined);
  const [filter, setFilter] = useState("all");
  const [showSettled, setShowSettled] = useState(false);
  const [, forceUpdate] = useReducer((x) => x + 1, 0);

  const getExpenses = () => {
    fetch("http://127.0.0.1:8000/api/userExpenses", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Token ${localStorage.getItem("token")}`,
      },
    })
      .then((response) => response.json())
      .then((data) => {
        setUserExpenses(data);
        console.log(data);
      });
  };

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

  const filterExpenses = (event) => {
    setFilter(event.target.value);
  };

  const displaySettled = () => (event) => {
    setShowSettled(event.target.checked);
  };

  const toShow = (expense) => {
    if ((filter === "lent") & (expense.payer != currentUser.id)) {
      return false;
    }
    if ((filter === "borrowed") & (expense.payer == currentUser.id)) {
      return false;
    }
    if ((expense.settled === true) & (showSettled === false)) {
      return false;
    }
    return true;
  };

  const reRenderToggle = () => {
    forceUpdate();
  };

  useEffect(() => {
    getExpenses();
    getUser();
    getSummarize();
    // const interval = setInterval(() => {
    //   getExpenses();
    // }, 80000);
    // return () => clearInterval(interval);
  }, []);
  if (userExpenses === undefined || currentUser === undefined) {
    return <p>Loading...</p>;
  }
  return (
    <div>
      <p>Your expenses:</p>
      <div>
        <FormControl>
          <FormLabel id="filter-row-radio">Filter</FormLabel>
          <RadioGroup
            row
            aria-labelledby="filter-row-radio-label"
            name="row-radio-buttons-group"
            value={filter}
            onChange={filterExpenses}
            style={{ display: "block" }}
          >
            <FormControlLabel
              value="all"
              control={
                <Radio
                  sx={{
                    color: "#007bff",
                    "&.Mui-checked": {
                      color: "#007bff",
                    },
                  }}
                />
              }
              label="All"
            />
            <FormControlLabel
              value="lent"
              control={
                <Radio
                  sx={{
                    color: "green",
                    "&.Mui-checked": {
                      color: "green",
                    },
                  }}
                />
              }
              label="Lent"
            />
            <FormControlLabel
              value="borrowed"
              control={
                <Radio
                  sx={{
                    color: "orange",
                    "&.Mui-checked": {
                      color: "orange",
                    },
                  }}
                />
              }
              label="Borrowed"
            />
            <FormControlLabel
              style={{ marginBottom: "0.5rem" }}
              control={
                <Checkbox
                  checked={showSettled}
                  onChange={displaySettled()}
                  sx={{
                    color: "red",
                    "&.Mui-checked": {
                      color: "red",
                    },
                  }}
                />
              }
              label="Settled"
            />
          </RadioGroup>
        </FormControl>
        <Stack spacing={2}>
          {userExpenses.map((expense, index) => (
            <ExpenseItem
              key={index}
              expense={expense}
              index={index}
              currentUser={currentUser}
              show={toShow(expense)}
              toggle={reRenderToggle}
            />
          ))}
        </Stack>
      </div>
    </div>
  );
}

export default AllExpenses;
