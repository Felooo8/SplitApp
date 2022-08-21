import DeleteIcon from "@mui/icons-material/Delete";
import EditRoundedIcon from "@mui/icons-material/EditRounded";
import ExitToAppIcon from "@mui/icons-material/ExitToApp";
import PersonAddIcon from "@mui/icons-material/PersonAdd";
import { Box, Button, Modal } from "@mui/material";
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
import AddUserToGroup from "../components/AddUserToGroup";
import BottomAppBar from "../components/Appbar";
import ChartPie from "../components/chart";
import Error from "../components/Error";
import ExpenseItemGroup from "../components/ExpenseGroup";
import SkeletonItem from "../components/SkeletonItem";
import { style } from "./Groups";

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

const alertAutoHidden = 3000; // in ms
const alertUpdate = 1500;

function SlideTransition(props: JSX.IntrinsicAttributes & SlideProps) {
  return <Slide {...props} direction="left" />;
}

function Group() {
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [keys, setKeys] = useState([]);
  const [values, setValues] = useState([]);
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [alertText, setAlertText] = useState<string>("");
  const [alertType, setAlertType] = useState<any>(undefined);
  const [openSnackBarAdding, setOpenSnackBarAdding] = useState<boolean>(false);
  const [inputText, setInputText] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(true);
  const [open, setOpen] = useState(false);
  const timerAlert = React.useRef<number>();
  const [openSnackBarSettling, setOpenSnackBarSettling] = useState<boolean>(
    false
  );
  const [errors, setErrors] = useState<Errors>({
    user: false,
    total: false,
    groups: false,
    leave: false,
    delete: false,
  });
  const { id, groupName } = useParams<"id" | "groupName">();

  const handleOpen = () => {
    setOpen(true);
  };
  const handleClose = () => setOpen(false);

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

  const addUserToGroup = (user_id: number, userName: string) => {
    fetch(Constants.SERVER + "/api/addUserToGroup", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Token ${localStorage.getItem("token")}`,
      },
      body: JSON.stringify({ id: id, user_id: user_id, userName: userName }),
    })
      .then((response) => {
        if (response.ok) {
          console.log("Good");
          toggleFetch();
          timerAlert.current = window.setTimeout(() => {
            setAlertText("User " + userName + " was added");
            setAlertType("success");
            setOpenSnackBarAdding(true);
          }, alertUpdate);
          // setErrors((errors) => ({
          //   ...errors,
          //   leave: false,
          // }));
          // window.location.replace("/groups");
        } else {
          throw Error("Something went wrong");
        }
      })
      .catch((error) => {
        console.log(error);
        timerAlert.current = window.setTimeout(() => {
          setAlertText(
            "Something went wrong. User " + userName + " was not added"
          );
          setAlertType("error");
          setOpenSnackBarAdding(true);
        }, alertUpdate);
        // setErrors((errors) => ({
        //   ...errors,
        //   leave: true,
        // }));
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

  const handleCloseSnackBarSettling = (event: any, reason: string) => {
    if (reason === "clickaway") {
      return;
    }
    setOpenSnackBarSettling(false);
  };

  const handleCloseSnackBarAlertSettling = (
    event: SyntheticEvent<Element, Event>
  ) => {
    setOpenSnackBarSettling(false);
  };

  const handleCloseSnackBarAdding = (event: any, reason: string) => {
    if (reason === "clickaway") {
      return;
    }
    setOpenSnackBarAdding(false);
  };

  const handleCloseSnackBarAlertAdding = (
    event: SyntheticEvent<Element, Event>
  ) => {
    setOpenSnackBarAdding(false);
  };

  const errorToggle = () => {
    setOpenSnackBarSettling(true);
  };

  const toggleFetch = () => {
    getGroups();
    getTotalExpenses();
    getUser();
  };

  const toggleSave = (user_id: number, userName: string) => {
    addUserToGroup(user_id, userName);
    setOpen(false);
    setAlertText("User " + userName + " is being added");
    setAlertType("info");
    setOpenSnackBarAdding(true);
  };

  const toggleClose = () => {
    setOpen(false);
    setAlertText("User was not added");
    setAlertType("warning");
    setOpenSnackBarAdding(true);
  };

  const handleEditName = () => {
    setInputText(!inputText);
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
      <Snackbar
        open={openSnackBarAdding}
        autoHideDuration={alertAutoHidden}
        onClose={handleCloseSnackBarAdding}
        anchorOrigin={{
          vertical: "top",
          horizontal: "center",
        }}
        TransitionComponent={SlideTransition}
      >
        <Alert
          onClose={handleCloseSnackBarAlertAdding}
          severity={alertType}
          sx={{ width: "100%" }}
          elevation={6}
          variant="filled"
        >
          {alertText}
        </Alert>
      </Snackbar>
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
        open={openSnackBarSettling}
        autoHideDuration={6000}
        onClose={handleCloseSnackBarSettling}
        anchorOrigin={{
          vertical: "top",
          horizontal: "center",
        }}
        TransitionComponent={SlideTransition}
      >
        <Alert
          onClose={handleCloseSnackBarAlertSettling}
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
              onClick={handleOpen}
              variant="outlined"
              color="success"
              startIcon={<PersonAddIcon />}
              style={button}
            >
              Add user
            </Button>
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
          <Modal
            open={open}
            onClose={handleClose}
            aria-labelledby="modal-modal-title"
            aria-describedby="modal-modal-description"
          >
            <Box sx={style}>
              <AddUserToGroup
                id={id}
                toggleClose={toggleClose}
                toggleSave={toggleSave}
              />
            </Box>
          </Modal>
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
  margin: "20px auto 20px auto",
};

const button = {
  width: "fit-content",
  display: "flex",
  margin: "0 auto 20px auto",
};
