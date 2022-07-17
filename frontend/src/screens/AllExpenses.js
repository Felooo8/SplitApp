import React, { useEffect, useState } from "react";
import styled, { css } from "styled-components";
import { Link, useNavigate } from "react-router-dom";
import Form from "react-bootstrap/Form";
import ChartPie from "../components/chart";
import { useParams } from "react-router-dom";

function AllExpenses(props) {
  const [totalExpenses, setTotalExpenses] = useState(undefined);
  const [keys, setKeys] = useState(undefined);
  const [values, setValues] = useState(undefined);
  const [expenses, setExpenses] = useState(undefined);
  const [groupID, setGroupID] = useState(undefined);
  const params = useParams();

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
    console.log(params);
    console.log(params.id);
    if (groupID != undefined) {
      console.log("ASdasd");
      getGroups();
      getTotalExpenses();
    }
    const interval = setInterval(() => {
      getGroups();
      getTotalExpenses();
    }, 80000);
    return () => clearInterval(interval);
  }, [groupID]);
  if (expenses === undefined || keys === undefined || values === undefined) {
    return <p>Loading...</p>;
  }
  return (
    <div>
      <p>Your grups:</p>
      <div>
        {expenses.map((expense, index) => (
          <p key={index}>
            {expense.name}: {expense.total}$
          </p>
        ))}
      </div>
      <div style={chart}>
        <ChartPie keys={keys} values={values} />
      </div>
    </div>
  );
}

export default AllExpenses;

const chart = {
  width: "30%",
  minWidth: "300px",
  marginLeft: "auto",
  marginRight: "auto",
};
