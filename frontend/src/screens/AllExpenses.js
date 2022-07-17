import React, { useEffect, useState } from "react";
import styled, { css } from "styled-components";
import Stack from "@mui/material/Stack";
import Paper from "@mui/material/Paper";
import { styled as styledMUI } from "@mui/material/styles";
import Grid from "@mui/system/Unstable_Grid";

const Item = styledMUI(Paper)(({ theme }) => ({
  backgroundColor: theme.palette.mode === "dark" ? "#1A2027" : "#fff",
  padding: theme.spacing(1),
  textAlign: "center",
  color: theme.palette.text.primary,
  maxWidth: "500px",
  width: "100%",
  marginLeft: "auto",
  marginRight: "auto",
}));

function AllExpenses(props) {
  const [userExpenses, setUserExpenses] = useState(undefined);

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
      });
  };

  useEffect(() => {
    getExpenses();
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
      <div>
        <Stack spacing={2}>
          {userExpenses.map((expense, index) => (
            <Item key={index} style={center}>
              {expense.name}: {expense.total}$
            </Item>
          ))}
        </Stack>
      </div>
    </div>
  );
}

export default AllExpenses;

const center = {
  marginLeft: "auto",
  marginRight: "auto",
};

const grid = {
  display: "grid",
};

const PostWrapper = styled.div`
  height: 50px;
  flex-direction: column;
  align-self: stretch;
  justify-content: space-around;
  display: flex;
  width: fit-content;
  padding: 10px;
  margin-left: auto;
  margin-right: auto;
`;
