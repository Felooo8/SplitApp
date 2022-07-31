import Checkbox from "@mui/material/Checkbox";
import FormControl from "@mui/material/FormControl";
import FormControlLabel from "@mui/material/FormControlLabel";
// import FormLabel from "@mui/material/FormLabel";
import Radio from "@mui/material/Radio";
import RadioGroup from "@mui/material/RadioGroup";
import Stack from "@mui/material/Stack";
import React, { useEffect, useReducer, useState } from "react";
import ExpenseItem from "../components/Expense";
import BottomAppBar from "../components/Appbar";
import SkeletonItem from "../components/SkeletonItem";
import Constants from "../apis/Constants";

function AllExpenses(props) {
  const [userExpenses, setUserExpenses] = useState([]);
  const [filtredExpenses, setFiltredExpenses] = useState([]);
  const [currentUser, setCurrentUser] = useState(null);
  const [filter, setFilter] = useState("all");
  const [showSettled, setShowSettled] = useState(false);
  const [showBorrowed, setShowBorrowed] = useState(true);
  const [showLent, setShowLent] = useState(true);
  const [, forceUpdate] = useReducer((x) => x + 1, 0);
  const [loading, setLoading] = useState(true);

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
        // console.log(data);
        setUserExpenses(data);
        setFiltredExpenses(
          data.filter((expense) => expense.settled === showSettled)
        );
        console.log(filtredExpenses);
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
    if (event.target.value === "all") {
      setShowLent(true);
      setShowBorrowed(true);
      setFiltredExpenses(
        userExpenses.filter(
          (expense) => expense.settled === showSettled || showSettled
        )
      );
    } else if (event.target.value === "lent") {
      setShowLent(true);
      setShowBorrowed(false);
      setFiltredExpenses(
        userExpenses.filter(
          (expense) =>
            expense.payer === currentUser.id &&
            (expense.settled === showSettled || showSettled)
        )
      );
    } else if (event.target.value === "borrowed") {
      setShowLent(false);
      setShowBorrowed(true);
      setFiltredExpenses(
        userExpenses.filter((expense) => expense.ower === currentUser.id)
      );
    }
  };

  const displaySettled = () => (event) => {
    setShowSettled(event.target.checked);
    if (event.target.checked) {
      if (showBorrowed) {
        setFiltredExpenses(userExpenses);
      } else {
        setFiltredExpenses(
          userExpenses.filter((expense) => expense.payer === currentUser.id)
        );
      }
    } else {
      if (showBorrowed) {
        setFiltredExpenses(
          userExpenses.filter((expense) => expense.settled === false)
        );
      } else {
        setFiltredExpenses(
          userExpenses.filter(
            (expense) =>
              expense.payer === currentUser.id && expense.settled === false
          )
        );
      }
    }
  };

  const reRenderToggle = () => {
    forceUpdate();
  };

  const Filteres = () => {
    return (
      <div>
        <h5>Your expenses:</h5>
        <FormControl>
          {/* <FormLabel id="filter-row-radio">Filter</FormLabel> */}
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
                  disabled={showBorrowed && !showLent}
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
      </div>
    );
  };

  useEffect(() => {
    setLoading(true);
    const timer = setTimeout(() => {
      getUser();
      getExpenses();
      setLoading(false);
    }, Constants.LOADING_DATA_DELAY);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div>
      {loading ? (
        <SkeletonItem header={true} />
      ) : (
        <div>
          {Filteres()}
          <Stack spacing={2}>
            {filtredExpenses.map((expense, index) => (
              <ExpenseItem
                key={index}
                expense={expense}
                index={index}
                currentUser={currentUser}
                toggle={reRenderToggle}
              />
            ))}
          </Stack>
        </div>
      )}
      <BottomAppBar value="all expenses" />
    </div>
  );
}

export default AllExpenses;
