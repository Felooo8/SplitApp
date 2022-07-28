import React, { useEffect, useState } from "react";
import Stack from "@mui/material/Stack";
import ChartPie from "../components/chart";
import { useParams } from "react-router-dom";
import ExpenseItemGroup from "../components/ExpenseGroup";

function Group(props) {
  const [currentUser, setCurrentUser] = useState(undefined);
  const [keys, setKeys] = useState(undefined);
  const [values, setValues] = useState(undefined);
  const [expenses, setExpenses] = useState(undefined);
  const [groupID, setGroupID] = useState(undefined);
  const params = useParams();

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

  // const setUsername = () => {
  //   setCurrentUser(localStorage.getItem("UserName"));
  // }

  const getTotalExpenses = () => {
    fetch("http://127.0.0.1:8000/api/chartData", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Token ${localStorage.getItem("token")}`,
      },
      body: JSON.stringify({ id: groupID }),
    })
      .then((response) => response.json())
      .then((data) => {
        setKeys(data["keys"]);
        setValues(data["values"]);
      });
  };

  const getGroups = () => {
    fetch("http://127.0.0.1:8000/api/groupExpenses", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Token ${localStorage.getItem("token")}`,
      },
      body: JSON.stringify({ id: groupID }),
    })
      .then((response) => response.json())
      .then((data) => {
        setExpenses(data);
      });
  };

  useEffect(() => {
    setGroupID(params.id);
    getUser();
    if (groupID !== undefined) {
      getGroups();
      getTotalExpenses();
    }
    const interval = setInterval(() => {
      getGroups();
      getTotalExpenses();
      getUser();
    }, 80000);
    return () => clearInterval(interval);
  }, [groupID]);
  if (expenses === undefined || keys === undefined || values === undefined) {
    return <p>Loading...</p>;
  }
  console.log(expenses);
  return (
    <div>
      <p>Your group:</p>
      <Stack spacing={2}>
        {expenses.map((expense, index) => (
          <ExpenseItemGroup
            key={index}
            expense={expense}
            index={index}
            currentUser={currentUser}
            show={!expense.settled}
          />
        ))}
      </Stack>
      <div style={chart}>
        <ChartPie keys={keys} values={values} />
      </div>
    </div>
  );
}

export default Group;

const chart = {
  width: "30%",
  minWidth: "300px",
  marginLeft: "auto",
  marginRight: "auto",
};
