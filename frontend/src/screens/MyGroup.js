import React, { useEffect, useState } from "react";
import Stack from "@mui/material/Stack";
import ChartPie from "../components/chart";
import { useParams } from "react-router-dom";
import ExpenseItemGroup from "../components/ExpenseGroup";
import BottomAppBar from "../components/Appbar";
import Chip from "@mui/material/Chip";
import Constants from "../apis/Constants";
import SkeletonItem from "../components/SkeletonItem";

function Group(props) {
  const [currentUser, setCurrentUser] = useState(null);
  const [keys, setKeys] = useState([]);
  const [values, setValues] = useState([]);
  const [expenses, setExpenses] = useState([]);
  const [groupID, setGroupID] = useState(null);
  const [groupName, setGroupName] = useState("");
  const [loading, setLoading] = useState(true);
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
      body: JSON.stringify({ id: params.id }),
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
      body: JSON.stringify({ id: params.id }),
    })
      .then((response) => response.json())
      .then((data) => {
        setExpenses(data);
      });
  };

  useEffect(() => {
    setLoading(true);
    const timer = setTimeout(() => {
      setGroupID(params.id);
      getGroups();
      getTotalExpenses();
      setGroupName(params.groupName);
      getUser();
      setLoading(false);
    }, Constants.LOADING_DATA_DELAY);
    return () => clearTimeout(timer);
  }, []);

  console.log(expenses);
  return (
    <div>
      <Chip
        variant="outlined"
        color="error"
        label={groupName}
        style={{
          fontSize: "20px",
          maxWidth: "90%",
          marginBottom: "20px",
        }}
      />

      {loading ? (
        <SkeletonItem header={false} />
      ) : (
        <div>
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
      )}
      <BottomAppBar value="groups" />
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
