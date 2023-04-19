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
import CreateNewGroup from "../components/CreateNewGroup";
import Error from "../components/Error";
import ExpenseItem from "../components/Expense";
import SkeletonItem from "../components/SkeletonItem";
import { style } from "./Groups";

type Expense = {
  id: number;
  name: string;
  category: string;
  amount: number;
  short_date: string;
  payer: number;
  payer_username: string;
  ower: number;
  ower_username: string;
  is_paid: boolean;
  settled: boolean;
};

type Errors = {
  user: boolean;
  total: boolean;
  groups: boolean;
  leave: boolean;
  addUser: boolean;
};

function SlideTransition(props: JSX.IntrinsicAttributes & SlideProps) {
  return <Slide {...props} direction="left" />;
}

export default function Group() {
  const [keys, setKeys] = useState([]);
  const [values, setValues] = useState([]);
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [alertText, setAlertText] = useState<string>("");
  const [newGroupName, setNewGroupName] = useState<string>("");
  const [alertType, setAlertType] = useState<any>(undefined);
  const [openSnackBar, setOpenSnackBar] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(true);
  const [openChangeName, setOpenChangeName] = useState<boolean>(false);
  const [open, setOpen] = useState<boolean>(false);
  const timerAlert = React.useRef<number>();
  const [errors, setErrors] = useState<Errors>({
    user: false,
    total: false,
    groups: false,
    leave: false,
    addUser: false,
  });
  const { id, groupName } = useParams<"id" | "groupName">();
  const currentUser: number | null = Number(localStorage.getItem("userID"));

  const handleOpen = () => {
    setOpen(true);
  };
  const handleClose = () => setOpen(false);

  const handleOpenChangeName = () => {
    setOpenChangeName(true);
  };
  const handleCloseChangeName = () => setOpenChangeName(false);

  // FETCH
  const fetchNewGroupName = (newName: string) => {
    fetch(Constants.SERVER + "/api/setGroupName", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Token ${localStorage.getItem("token")}`,
      },
      body: JSON.stringify({ id: id, name: newName }),
    })
      .then((response) => {
        if (response.ok) {
          setNewGroupName("");
          console.log("Changed");
        } else {
          throw Error("Something went wrong");
        }
      })
      .catch((error) => {
        console.log(error);
        // setErrors((errors) => ({
        //   ...errors,
        //   total: true,
        // }));
      });
  };

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
            setKeys(data["keys"]);
            setValues(data["values"]);
            setLoading(false);
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
            setOpenSnackBar(true);
          }, Constants.ALERTUPDATE);
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
          setOpenSnackBar(true);
        }, Constants.ALERTUPDATE);
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
          window.location.replace("/groups");
        } else {
          throw Error("Something went wrong");
        }
      })
      .catch((error) => {
        console.log(error);
        setAlertText("Something went wrong. Group was not deleted");
        setAlertType("error");
        setOpenSnackBar(true);
      });
  };

  const getGroupExpenses = () => {
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

  // SNACKBARS
  const handleCloseSnackBar = (_event: any, reason: string) => {
    if (reason === "clickaway") {
      return;
    }
    setOpenSnackBar(false);
  };

  const handleCloseSnackBarAlert = (_event: SyntheticEvent<Element, Event>) => {
    setOpenSnackBar(false);
  };

  // TOGGLE
  const errorToggle = () => {
    setAlertText("Something went wrong");
    setAlertType("error");
    setOpenSnackBar(true);
  };

  const toggleFetch = () => {
    setErrors((errors) => ({
      ...errors,
      addUser: false,
    }));
    getGroupExpenses();
    getTotalExpenses();
  };

  const toggleSaveAddingUser = (user_id: number, userName: string) => {
    addUserToGroup(user_id, userName);
    setOpen(false);
    setAlertText("User " + userName + " is being added");
    setAlertType("info");
    setOpenSnackBar(true);
  };

  const toggleClose = () => {
    setOpen(false);
    setAlertText("User was not added");
    setAlertType("warning");
    setOpenSnackBar(true);
  };

  const toggleAddUserError = (error: boolean) => {
    setErrors({ ...errors, addUser: error });
  };

  const toggleSaveChangeName = (newGroupName: string) => {
    setOpenChangeName(false);
    fetchNewGroupName(newGroupName);
    setNewGroupName(newGroupName);
    setAlertText("Name was changed to " + newGroupName);
    setAlertType("info");
    setOpenSnackBar(true);
  };

  const toggleCloseChangeName = () => {
    setOpenChangeName(false);
    setOpen(false);
    setAlertText("Group name was not changed");
    setAlertType("warning");
    setOpenSnackBar(true);
  };

  const handleEditName = () => {
    setOpenChangeName(true);
  };

  useEffect(() => {
    setLoading(true);
    const timer = setTimeout(() => {
      getGroupExpenses();
      getTotalExpenses();
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

  return (
    <div style={{ marginBottom: "65px" }}>
      <Snackbar
        open={openSnackBar}
        autoHideDuration={Constants.ALERTAUTOHIDDEN}
        onClose={handleCloseSnackBar}
        anchorOrigin={{
          vertical: "top",
          horizontal: "center",
        }}
        TransitionComponent={SlideTransition}
      >
        <Alert
          onClose={handleCloseSnackBarAlert}
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
      {loading ? (
        <SkeletonItem header={false} />
      ) : (
        <div>
          <Stack spacing={2}>
            {expenses.map((expense, index) => (
              <ExpenseItem
                key={expense.id}
                expense={expense}
                index={index}
                currentUser={currentUser}
                errorToggle={errorToggle}
                toggle={toggleFetch}
                isGroupExpense={true}
              />
            ))}
          </Stack>
          {displayChart() ? (
            <div style={chart}>
              <ChartPie keys={keys} values={values} />
            </div>
          ) : null}
          <Box id="Managing group">
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
            id="Adding user to group"
            open={open}
            onClose={handleClose}
            aria-labelledby="modal-modal-title"
            aria-describedby="modal-modal-description"
          >
            <Box sx={style}>
              <AddUserToGroup
                id={id}
                toggleError={toggleAddUserError}
                toggleClose={toggleClose}
                toggleSave={toggleSaveAddingUser}
              />
            </Box>
          </Modal>
          <Modal
            id="Change group name"
            open={openChangeName}
            onClose={handleCloseChangeName}
            aria-labelledby="modal-modal-title"
            aria-describedby="modal-modal-description"
          >
            <Box sx={style}>
              <CreateNewGroup
                toggleClose={toggleCloseChangeName}
                toggleSave={toggleSaveChangeName}
                basic={true}
                heading="Change group name"
              />
            </Box>
          </Modal>
        </div>
      )}
      <BottomAppBar value="groups" />
    </div>
  );
}

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
