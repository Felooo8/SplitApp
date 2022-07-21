import React, { useEffect, useState } from "react";
import Stack from "@mui/material/Stack";
import ExpenseItem from "../components/Expense";

function AllExpenses(props) {
  const [userExpenses, setUserExpenses] = useState(undefined);
  const [currentUser, setCurrentUser] = useState(undefined);

  const getExpenses = () => {
    fetch("http://127.0.0.1:8000/api/userExpenses", {
      method: "POST",
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
  //   console.log(currentUser);
  // };

  useEffect(() => {
    getExpenses();
    getUser();
    const interval = setInterval(() => {
      getExpenses();
    }, 80000);
    return () => clearInterval(interval);
  }, []);
  if (userExpenses === undefined || currentUser === undefined) {
    return <p>Loading...</p>;
  }
  return (
    <div>
      <p>Your expenses:</p>
      <div>
        <Stack spacing={2}>
          {userExpenses.map((expense, index) => (
            <ExpenseItem
              key={index}
              expense={expense}
              index={index}
              currentUser={currentUser}
            />
          ))}
        </Stack>
      </div>
    </div>
  );
}

export default AllExpenses;
