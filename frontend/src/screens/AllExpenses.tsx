import "../App.css";

import LayersClearIcon from "@mui/icons-material/LayersClear";
import { Box, LinearProgress } from "@mui/material";
import Alert from "@mui/material/Alert";
import Checkbox from "@mui/material/Checkbox";
import FormControl from "@mui/material/FormControl";
import FormControlLabel from "@mui/material/FormControlLabel";
import Radio from "@mui/material/Radio";
import RadioGroup from "@mui/material/RadioGroup";
import Slide, { SlideProps } from "@mui/material/Slide";
import Snackbar from "@mui/material/Snackbar";
import Stack from "@mui/material/Stack";
import React, { SyntheticEvent, useEffect, useReducer, useState } from "react";
import { Fade } from "react-bootstrap";

import Constants from "../apis/Constants";
import BottomAppBar from "../components/Appbar";
import Error from "../components/Error";
import ExpenseItem from "../components/Expense";
import NothingToDisplay from "../components/NothingToDisplay";
import SkeletonItem from "../components/SkeletonItem";

type Expense = {
  id: number;
  name: string;
  category: string;
  amount: number;
  splitted: boolean;
  date: string;
  ower: number;
  payer: number;
  is_paid: boolean;
  settled: boolean;
};

type Errors = {
  user: boolean;
  expenses: boolean;
};

function SlideTransition(props: JSX.IntrinsicAttributes & SlideProps) {
  return <Slide {...props} direction="left" />;
}

function AllExpenses() {
  const [userExpenses, setUserExpenses] = useState<Expense[]>([]);
  const [filtredExpenses, setFiltredExpenses] = useState<Expense[]>([]);
  // const [currentUser, setCurrentUser] = useState<any>(null);
  const [filter, setFilter] = useState<string>("all");
  const [showSettled, setShowSettled] = useState<boolean>(false);
  const [showBorrowed, setShowBorrowed] = useState<boolean>(true);
  const [showLent, setShowLent] = useState<boolean>(true);
  const [refreshing, setRefreshing] = useState<boolean>(false);
  const [, forceUpdate] = useReducer((x) => x + 1, 0);
  const [loading, setLoading] = useState<boolean>(true);
  const [openSnackBar, setOpenSnackBar] = useState<boolean>(false);
  const [errors, setErrors] = useState<Errors>({
    user: false,
    expenses: false,
  });
  const timer = React.useRef<number>();
  const currentUser: number | null = Number(localStorage.getItem("userID"));

  const getExpenses = () => {
    fetch(Constants.SERVER + "/api/userExpenses", {
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
              data.filter((expense: Expense) => expense.settled === showSettled)
            );
            // console.log(filtredExpenses);
            setLoading(false);
            setErrors((errors) => ({
              ...errors,
              expenses: false,
            }));
          });
        } else {
          throw Error("Something went wrong");
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

  const filterExpenses = (event: {
    target: { value: React.SetStateAction<string> };
  }) => {
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
            expense.payer === currentUser &&
            (expense.settled === showSettled || showSettled)
        )
      );
    } else if (event.target.value === "borrowed") {
      setShowLent(false);
      setShowBorrowed(true);
      setFiltredExpenses(
        userExpenses.filter((expense) => expense.ower === currentUser)
      );
    }
  };

  const updateDisplaySettled = () => (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setShowSettled(event.target.checked);
    if (event.target.checked) {
      if (showBorrowed) {
        setFiltredExpenses(userExpenses);
      } else {
        setFiltredExpenses(
          userExpenses.filter((expense) => expense.payer === currentUser)
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
              expense.payer === currentUser && expense.settled === false
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
          <RadioGroup
            row
            aria-labelledby="filter-row-radio-label"
            name="row-radio-buttons-group"
            value={filter}
            onChange={filterExpenses}
            style={{ display: "block" }}
            className="filtresGroup"
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
                  onChange={updateDisplaySettled()}
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

  const handleCloseSnackBar = (
    event: Event | SyntheticEvent<Element, Event>,
    reason: string
  ) => {
    if (reason === "clickaway") {
      return;
    }
    setOpenSnackBar(false);
  };

  const handleCloseSnackBarAlert = (event: SyntheticEvent<Element, Event>) => {
    setOpenSnackBar(false);
  };

  const toggleFetch = () => {
    setRefreshing(true);
    timer.current = window.setTimeout(() => {
      setRefreshing(false);
    }, Constants.PROGRESS_ANIMATION_TIME);
    // getUser();
    getExpenses();
  };

  const errorToggle = () => {
    setOpenSnackBar(true);
  };

  useEffect(() => {
    setLoading(true);
    const timer = setTimeout(() => {
      // getUser();
      getExpenses();
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
    <div style={{ marginBottom: "65px" }}>
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
          onClose={handleCloseSnackBarAlert}
          severity="error"
          sx={{ width: "100%" }}
          elevation={6}
          variant="filled"
        >
          Something went wrong!
        </Alert>
      </Snackbar>
      {loading ? (
        <SkeletonItem header={true} />
      ) : (
        <div>
          <Box
            style={{
              position: "fixed",
              left: "0",
              right: "0",
              bottom: "56px",
              zIndex: "10",
            }}
          >
            <Fade in={refreshing} unmountOnExit>
              <LinearProgress sx={{ height: "8px" }} />
            </Fade>
          </Box>
          {filtredExpenses.length === 0 ? (
            <NothingToDisplay
              statusIcon={LayersClearIcon}
              mainText={"No expenses yet"}
              helperText={"When you get expenses, they'll show up here"}
              toggleRefresh={toggleFetch}
              refreshing={refreshing}
            />
          ) : (
            <Box>
              {Filteres()}
              <Stack spacing={2}>
                {filtredExpenses.map((expense, index) => (
                  <ExpenseItem
                    key={expense.id}
                    expense={expense}
                    index={index}
                    currentUser={currentUser}
                    toggle={reRenderToggle}
                    errorToggle={errorToggle}
                  />
                ))}
              </Stack>
            </Box>
          )}
        </div>
      )}
      <BottomAppBar value="all expenses" />
    </div>
  );
}

export default AllExpenses;
