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
  const [openSnackBar, setOpenSnackBar] = useState(false);
  const [errors, setErrors] = useState({
    user: false,
    expenses: false,
  });

  const getExpenses = () => {
    fetch("http://127.0.0.1:8000/api/userExpenses", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Token ${localStorage.getItem("token")}`,
      },
    })
      .then((response) => {
        if (response.ok) {
          response.json().then((data) => {
            setUserExpenses(data);
            setFiltredExpenses(
              data.filter((expense) => expense.settled === showSettled)
            );
            // console.log(filtredExpenses);
            setErrors((errors) => ({
              ...errors,
              expenses: false,
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
          expenses: true,
        }));
      });
  };

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

  const handleCloseSnackBar = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }
    setOpenSnackBar(false);
  };

  const toggleFetch = () => {
    getUser();
    getExpenses();
  };

  const errorToggle = () => {
    setOpenSnackBar(true);
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

  if (Object.values(errors).some((error) => error === true)) {
    return (
      <div>
        <Error toggle={toggleFetch} />
        <BottomAppBar value="all expenses" />
      </div>
    );
  }

  return (
    <div>
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
                errorToggle={errorToggle}
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
