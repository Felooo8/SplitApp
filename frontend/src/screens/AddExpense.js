import React, { useEffect, useState } from "react";
import Stack from "@mui/material/Stack";
import AddingExpense from "../components/AddingExpense";

function AddExpense(props) {
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

  useEffect(() => {
    getExpenses();
    getUser();
    const interval = setInterval(() => {
      getExpenses();
    }, 80000);
    return () => clearInterval(interval);
  }, []);
  if (userExpenses === undefined) {
    return <p>Loading...</p>;
  }
  return (
    <div>
      <p>Your expenses:</p>
      <AddingExpense />
    </div>
  );
}

export default AddExpense;
