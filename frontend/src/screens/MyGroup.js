import React, { useEffect, useState } from "react";
import Stack from "@mui/material/Stack";
import ChartPie from "../components/chart";
import { useParams } from "react-router-dom";
import ExpenseItemGroup from "../components/ExpenseGroup";
import BottomAppBar from "../components/Appbar";
import Chip from "@mui/material/Chip";
import Constants from "../apis/Constants";
import SkeletonItem from "../components/SkeletonItem";
import Error from "../components/Error";
import Snackbar from "@mui/material/Snackbar";
import MuiAlert from "@mui/material/Alert";
import Slide from "@mui/material/Slide";

const Alert = React.forwardRef(function Alert(props, ref) {
  return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

function SlideTransition(props) {
  return <Slide {...props} direction="left" />;
}

function Group(props) {
  const [currentUser, setCurrentUser] = useState(null);
  const [keys, setKeys] = useState([]);
  const [values, setValues] = useState([]);
  const [expenses, setExpenses] = useState([]);
  const [groupName, setGroupName] = useState("");
  const [loading, setLoading] = useState(true);
  const [openSnackBar, setOpenSnackBar] = useState(false);
  const [errors, setErrors] = useState({
    user: false,
    total: false,
    groups: false,
  });
  const params = useParams();

  const getUser = () => {
    fetch("http://127.0.0.1:8000/api/auth/users/me/", {
      headers: {
        Authorization: `Token ${localStorage.getItem("token")}`,
      },
    })
      .then((response) => {
        if (response.ok) {
          response.json().then((data) => {
            setCurrentUser(data);
            setErrors((errors) => ({
              ...errors,
              user: false,
            }));
          });
        } else {
          throw new Error("Something went wrong");
        }
      })
      .catch((error) => {
        console.log(error);
        setErrors((errors) => ({
          ...errors,
          user: true,
        }));
      });
  };

  const getTotalExpenses = () => {
    fetch("http://127.0.0.1:8000/api/chartData", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Token ${localStorage.getItem("token")}`,
      },
      body: JSON.stringify({ id: params.id }),
    })
      .then((response) => {
        if (response.ok) {
          response.json().then((data) => {
            setKeys(data["keys"]);
            setValues(data["values"]);
            setErrors((errors) => ({
              ...errors,
              total: false,
            }));
          });
        } else {
          throw new Error("Something went wrong");
        }
      })
      .catch((error) => {
        console.log(error);
        setErrors((errors) => ({
          ...errors,
          total: true,
        }));
        // setErrors(true);
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
      .then((response) => {
        if (response.ok) {
          response.json().then((data) => {
            setExpenses(data);
            setErrors((errors) => ({
              ...errors,
              groups: false,
            }));
          });
        } else {
          throw new Error("Something went wrong");
        }
      })
      .catch((error) => {
        console.log(error);
        setErrors((errors) => ({
          ...errors,
          groups: true,
        }));
      });
  };

  const handleCloseSnackBar = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }
    setOpenSnackBar(false);
  };

  const errorToggle = () => {
    setOpenSnackBar(true);
  };

  const toggleFetch = () => {
    getGroups();
    getTotalExpenses();
    setGroupName(params.groupName);
    getUser();
  };

  useEffect(() => {
    setLoading(true);
    const timer = setTimeout(() => {
      getGroups();
      getTotalExpenses();
      setGroupName(params.groupName);
      getUser();
      setLoading(false);
    }, Constants.LOADING_DATA_DELAY);
    return () => clearTimeout(timer);
  }, []);

  if (Object.values(errors).some((error) => error === true)) {
    return (
      <div>
        <Error toggle={toggleFetch} />
        <BottomAppBar value="groups" />
      </div>
    );
  }

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
      <Snackbar
        open={openSnackBar}
        autoHideDuration={6000}
        onClose={handleCloseSnackBar}
        anchorOrigin={{
          vertical: "top",
          horizontal: "center",
        }}
        TransitionComponent={SlideTransition}
      >
        <Alert
          onClose={handleCloseSnackBar}
          severity="error"
          sx={{ width: "100%" }}
        >
          Something went wrong!
        </Alert>
      </Snackbar>
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
                errorToggle={errorToggle}
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
