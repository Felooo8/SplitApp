import DeleteIcon from "@mui/icons-material/Delete";
import EditRoundedIcon from "@mui/icons-material/EditRounded";
import ExitToAppIcon from "@mui/icons-material/ExitToApp";
import { Box, Button } from "@mui/material";
import Alert from "@mui/material/Alert";
import Chip from "@mui/material/Chip";
import Slide, { SlideProps } from "@mui/material/Slide";
import Snackbar from "@mui/material/Snackbar";
import Stack from "@mui/material/Stack";
import React, {
  SetStateAction,
  SyntheticEvent,
  useEffect,
  useState,
} from "react";
import { useParams } from "react-router-dom";

import Constants from "../apis/Constants";
import BottomAppBar from "../components/Appbar";
import ChartPie from "../components/chart";
import Error from "../components/Error";
import ExpenseItemGroup from "../components/ExpenseGroup";
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
  total: boolean;
  groups: boolean;
  leave: boolean;
  delete: boolean;
};

type Params = {
  id: string | undefined;
  groupName: SetStateAction<string>;
};

function SlideTransition(props: JSX.IntrinsicAttributes & SlideProps) {
  return <Slide {...props} direction="left" />;
}

function Group() {
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [keys, setKeys] = useState([]);
  const [values, setValues] = useState([]);
  const [expenses, setExpenses] = useState<Expense[]>([]);
  // const [groupName, setGroupName] = useState<string>("");
  // const [newGroupName, setNewGroupName] = useState("");
  const [inputText, setInputText] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(true);
  const [openSnackBar, setOpenSnackBar] = useState<boolean>(false);
  const [errors, setErrors] = useState<Errors>({
    user: false,
    total: false,
    groups: false,
    leave: false,
    delete: false,
  });
  const { id, groupName } = useParams<"id" | "groupName">();

  const getUser = () => {
    fetch(Constants.SERVER + "/api/auth/users/me/", {
      headers: {
        Authorization: `Token ${localStorage.getItem("token")}`,
      },
    })
      .then((response) => {
        if (response.ok) {
          response.json().then((data) => {
            setCurrentUser(data);
            setLoading(false);
            setErrors((errors) => ({
              ...errors,
              user: false,
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
          user: true,
        }));
      });
  };

  // const fetchNewGroupName = () => {
  //   fetch(Constants.SERVER + "/api/setGroupName", {
  //     method: "POST",
  //     headers: {
  //       "Content-Type": "application/json",
  //       Authorization: `Token ${localStorage.getItem("token")}`,
  //     },
  //     body: JSON.stringify({ id: id, name: newGroupName }),
  //   })
  //     .then((response) => {
  //       if (response.ok) {
  //         setNewGroupName("");
  //         console.log("Changed");
  //       } else {
  //         throw Error("Something went wrong");
  //       }
  //     })
  //     .catch((error) => {
  //       console.log(error);
  //       // setErrors((errors) => ({
  //       //   ...errors,
  //       //   total: true,
  //       // }));
  //     });
  // };

  const getTotalExpenses = () => {
    fetch(Constants.SERVER + "/api/chartData/" + id, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Token ${localStorage.getItem("token")}`,
      },
    })
      .then((response) => {
        if (response.ok) {
          response.json().then((data) => {
            console.log(data);
            setKeys(data["keys"]);
            setValues(data["values"]);
            setErrors((errors) => ({
              ...errors,
              total: false,
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
          total: true,
        }));
        // setErrors(true);
      });
  };

  const leaveGroup = () => {
    fetch(Constants.SERVER + "/api/leaveGroup", {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Token ${localStorage.getItem("token")}`,
      },
      body: JSON.stringify({ group_id: id }),
    })
      .then((response) => {
        if (response.ok) {
          console.log("Good");
          setErrors((errors) => ({
            ...errors,
            leave: false,
          }));
          window.location.replace("/groups");
        } else {
          throw Error("Something went wrong");
        }
      })
      .catch((error) => {
        console.log(error);
        setErrors((errors) => ({
          ...errors,
          leave: true,
        }));
      });
  };

  const deleteGroup = () => {
    fetch(Constants.SERVER + "/api/deleteGroup", {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Token ${localStorage.getItem("token")}`,
      },
      body: JSON.stringify({ group_id: id }),
    })
      .then((response) => {
        if (response.ok) {
          console.log("Good");
          setErrors((errors) => ({
            ...errors,
            delete: false,
          }));
          window.location.replace("/groups");
        } else {
          throw Error("Something went wrong");
        }
      })
      .catch((error) => {
        console.log(error);
        setErrors((errors) => ({
          ...errors,
          delete: true,
        }));
      });
  };

  const getGroups = () => {
    fetch(Constants.SERVER + "/api/groupExpenses/" + id, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Token ${localStorage.getItem("token")}`,
      },
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
          throw Error("Something went wrong");
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

  const handleCloseSnackBar = (event: any, reason: string) => {
    if (reason === "clickaway") {
      return;
    }
    setOpenSnackBar(false);
  };

  const handleCloseSnackBarAlert = (event: SyntheticEvent<Element, Event>) => {
    setOpenSnackBar(false);
  };

  const errorToggle = () => {
    setOpenSnackBar(true);
  };

  const toggleFetch = () => {
    getGroups();
    getTotalExpenses();
    getUser();
  };

  const handleEditName = () => {
    setInputText(!inputText);
    console.log("JD");
  };

  useEffect(() => {
    setLoading(true);
    const timer = setTimeout(() => {
      getGroups();
      getTotalExpenses();
      getUser();
    }, Constants.LOADING_DATA_DELAY);
    return () => clearTimeout(timer);
  }, []);

  const displayChart = () => {
    if (Object.values(values).some((value) => value !== 0)) {
      return true;
    }
    return false;
  };

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
        onDelete={handleEditName}
        deleteIcon={
          <EditRoundedIcon
            sx={{ color: "red" }}
            style={{ width: "1em", height: "1em" }}
          />
        }
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
        <SkeletonItem header={false} />
      ) : (
        <div>
          <Stack spacing={2}>
            {expenses.map((expense, index) => (
              <ExpenseItemGroup
                key={expense.id}
                expense={expense}
                index={index}
                currentUser={currentUser}
                errorToggle={errorToggle}
              />
            ))}
          </Stack>
          {displayChart() ? (
            <div style={chart}>
              <ChartPie keys={keys} values={values} />
            </div>
          ) : null}
          <Box>
            <Button
              onClick={leaveGroup}
              variant="outlined"
              color="warning"
              startIcon={<ExitToAppIcon />}
              style={button}
            >
              Leave group
            </Button>
            <Button
              onClick={deleteGroup}
              variant="outlined"
              color="error"
              startIcon={<DeleteIcon />}
              style={button}
            >
              Delete group
            </Button>
          </Box>
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
  margin: "20px auto auto",
};

const button = {
  width: "fit-content",
  display: "flex",
  margin: "20px auto 0 auto",
};
