import BottomAppBar from "../components/Appbar";

import "../App.css";

import CategoryOutlinedIcon from "@mui/icons-material/CategoryOutlined";
import GroupOutlinedIcon from "@mui/icons-material/GroupOutlined";
import GroupsIcon from "@mui/icons-material/Groups";
import SendIcon from "@mui/icons-material/Send";
import AccordionSummary from "@mui/material/AccordionSummary";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Chip from "@mui/material/Chip";
import Fade from "@mui/material/Fade";
import FormControl from "@mui/material/FormControl";
import FormControlLabel from "@mui/material/FormControlLabel";
import FormGroup from "@mui/material/FormGroup";
import Input from "@mui/material/Input";
import InputAdornment from "@mui/material/InputAdornment";
import InputLabel from "@mui/material/InputLabel";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import MenuItem from "@mui/material/MenuItem";
import Modal from "@mui/material/Modal";
import Paper from "@mui/material/Paper";
import Slide, { SlideProps } from "@mui/material/Slide";
import Alert, { AlertColor } from "@mui/material/Alert";
import Select, { SelectChangeEvent } from "@mui/material/Select";
import Switch from "@mui/material/Switch";
import TextField from "@mui/material/TextField";
import React, { useEffect, useState } from "react";
import styled from "styled-components";
import Snackbar from "@mui/material/Snackbar";

import Constants from "../apis/Constants";
import returnIcon from "../apis/returnIcon";
import Error from "../components/Error";
import SkeletonItem from "../components/SkeletonItem";
import ListOfCategories from "../components/listOfCategoriesModal";
import ListOfGroupsModal from "../components/listOfGroupsModal";

function SlideTransition(props: JSX.IntrinsicAttributes & SlideProps) {
  return <Slide {...props} direction="left" />;
}

const style = {
  bgcolor: "background.paper",
  border: "2px solid #000",
  boxShadow: 24,
};

const defaultValues = {
  amount: 0,
  name: "",
  category: "other",
  splitted: false,
  payer: undefined,
  is_paid: false,
  settled: false,
  owers: [],
  owers_groups: [],
};

interface ExpenseValues {
  amount: number;
  name: string;
  category: string;
  splitted: boolean;
  payer: number | undefined;
  is_paid: boolean;
  settled: boolean;
  owers: number[];
  owers_groups: number[];
}

interface Errors {
  user: boolean;
  groups: boolean;
  friends: boolean;
}

interface Group {
  id: number;
  users: number[];
  usernames: string[];
}

interface User {
  id: number;
  username: string;
}

export default function AddExpense() {
  const [open, setOpen] = useState<boolean>(false);
  const [openGroup, setOpenGroup] = useState<boolean>(false);
  const [groups, setGroups] = useState<Group[]>([]);
  const [currentUser, setCurrentUser] = useState<User | any>();
  const [payers, setPayers] = useState<User[]>([]);
  const [friends, setFriends] = useState<string[]>([]);
  const [alertText, setAlertText] = useState<string>("");
  const [alertType, setAlertType] = useState<AlertColor | undefined>(undefined);
  const [openSnackBar, setOpenSnackBar] = useState<boolean>(false);
  const [chosenExpenseIncurer, setChosenExpenseIncurer] = useState<string[]>(
    []
  );
  const [chosenIsGroup, setChosenIsGroup] = useState<boolean[]>([]);
  const [errors, setErrors] = useState<Errors>({
    user: false,
    groups: false,
    friends: false,
  });
  const [loading, setLoading] = useState<boolean>(true);
  const handleOpen = (): void => setOpen(true);
  const handleClose = (): void => setOpen(false);
  const handleOpenGroup = (): void => setOpenGroup(true);
  const handleCloseGroup = (): void => setOpenGroup(false);
  const [values, setValues] = useState<ExpenseValues>({
    amount: 0,
    name: "",
    category: "other",
    splitted: false,
    payer: undefined,
    is_paid: false,
    settled: false,
    owers: [],
    owers_groups: [],
  });
  const validateForm = () => {
    return (
      values.name !== "" &&
      values.payer !== 0 &&
      // values.owers !== [] &&
      values.amount > 0 &&
      values.owers.length > 0
    );
  };

  //API
  const getGroups = () => {
    fetch(Constants.SERVER + "/api/group", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Token ${localStorage.getItem("token")}`,
      },
    })
      .then((response) => {
        if (response.ok) {
          response.json().then((data) => {
            setGroups(data);
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

  const getFriends = () => {
    fetch(Constants.SERVER + "/api/seeFriends", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Token ${localStorage.getItem("token")}`,
      },
    })
      .then((response) => {
        if (response.ok) {
          response.json().then((data) => {
            setFriends(data);
            setErrors((errors) => ({
              ...errors,
              friends: false,
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
          friends: true,
        }));
      });
  };

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

  const sendRequest = () => {
    fetch(Constants.SERVER + "/api/addExpense", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Token ${localStorage.getItem("token")}`,
      },
      body: JSON.stringify({ values: values }),
    })
      .then((response) => {
        if (response.ok) {
          console.log("Good");
          setValues(defaultValues);
          setChosenExpenseIncurer([]);
          setPayers([]);
          setChosenIsGroup([]);
          setAlertText("Expense was added");
          setAlertType("success");
          setOpenSnackBar(true);
        } else {
          throw Error("Something went wrong");
        }
      })
      .catch((error) => {
        console.log("Failed");
        console.log(error);
        setAlertText("Something went wrong. Expense was not added");
        setAlertType("error");
        setOpenSnackBar(true);
      });
  };

  useEffect(() => {
    setLoading(true);
    const timer = setTimeout(() => {
      getGroups();
      getFriends();
      getUser();
    }, Constants.LOADING_DATA_DELAY);
    return () => clearTimeout(timer);
  }, []);

  const setPayersData = (id: number, isGroup: boolean, username: string) => {
    // Sets list of available payers to choose
    if (isGroup) {
      // Add all group members
      for (const group of groups) {
        if (group["id"] === id) {
          setPayers([{ id: currentUser.id, username: "You" }]);
          for (var i = 0; i < group["users"].length; i++) {
            // Add each user
            if (group["users"][i] !== currentUser.id) {
              let newArray = {
                id: group["users"][i],
                username: group["usernames"][i],
              };
              setPayers((payers) => [...payers, newArray]);
            }
          }
        }
      }
    } else {
      // Set currentUser and the other user as a possible
      setPayers([
        { id: currentUser.id, username: "You" },
        { id: id, username: username },
      ]);
    }
    setValues({
      ...values,
      payer: currentUser.id,
    });
  };

  const isPayerUpdated = () => {
    return payers.length > 0;
  };

  const handleChange = (prop: string) => (event: {
    target: { value: any };
  }) => {
    setValues({ ...values, [prop]: event.target.value });
  };
  const handleChangePayer = (event: SelectChangeEvent) => {
    const payer = (event.target.value as unknown) as number;
    setValues({ ...values, payer: payer });

    if (payer === values["owers"][0]) {
      if (payer === currentUser.id) {
        // If new payer is currentUser we need to change ower to the other user
        let new_ower = payers[1]["id"];
        setValues({
          ...values,
          owers: [new_ower],
        });
      } else {
        let new_ower = currentUser.id;
        setValues({
          ...values,
          owers: [new_ower],
        });
      }
    }
  };

  const handleChangeSwitch = (name: string) => (
    event: React.SyntheticEvent<Element, Event>
  ) => {
    const isChecked = (event.target as HTMLInputElement).checked;
    setValues({ ...values, [name]: isChecked });
  };

  // TOGGLES
  const toggleSave = (category: any) => {
    setOpen(false);
    setValues({ ...values, category: category });
  };
  const toggleSaveGroup = (
    incrurer_id: any,
    isGroup: any,
    incrurer_name: any
  ) => {
    if (isGroup) {
      values.owers_groups = [...values.owers_groups, incrurer_id];
    } else {
      values.owers = [...values.owers, incrurer_id];
    }
    setOpenGroup(false);
    setChosenExpenseIncurer((chosenExpenseIncurer) => [
      ...chosenExpenseIncurer,
      incrurer_name,
    ]);
    setChosenIsGroup((chosenIsGroup) => [...chosenIsGroup, isGroup]);
    // If there more incurers only possible payer is "You"
    if (chosenExpenseIncurer.length > 0) {
      setValues({ ...values, payer: currentUser.id });
      setPayers([{ id: currentUser.id, username: "You" }]);
    } else {
      setPayersData(incrurer_id, isGroup, incrurer_name);
    }
  };

  const afterDeletingGroup = (index: number) => {
    // If there are more than 2 groups then after deleting one
    // we will still have more than 1 group so we want only currentuser to be payer
    const sliceIndex = chosenExpenseIncurer.length - index - 1;
    if (chosenExpenseIncurer.length > 2) {
      setValues({ ...values, payer: currentUser.id });
      setPayers([{ id: currentUser.id, username: "You" }]);
    } else if (chosenExpenseIncurer.length === 2) {
      // If there are 2 group then after deleting one we will have only 1 group, so
      // we want all of the group members to be possible payers
      if (chosenIsGroup[sliceIndex]) {
        values.owers_groups = [values.owers_groups[sliceIndex]];
        setPayersData(
          values.owers_groups[0],
          true,
          chosenExpenseIncurer[sliceIndex]
        );
      } else {
        // No group left -> only one user
        values.owers_groups = [];
        setPayersData(values.owers[0], false, chosenExpenseIncurer[sliceIndex]);
      }
    } else {
      // deleting last Incurer
      setValues({ ...values, payer: undefined });
      values.owers = [];
      values.owers_groups = [];
      values.payer = undefined;
      setValues({ ...values, payer: undefined });
      setValues({ ...values, owers_groups: [] });
      setValues({ ...values, owers: [] });
      setPayers([]);
    }
  };

  const handleDeleteGroup = (index: number) => {
    setChosenExpenseIncurer([
      ...chosenExpenseIncurer.slice(0, index),
      ...chosenExpenseIncurer.slice(index + 1, chosenExpenseIncurer.length),
    ]);
    setChosenIsGroup([
      ...chosenIsGroup.slice(0, index),
      ...chosenIsGroup.slice(index + 1, chosenIsGroup.length),
    ]);
    afterDeletingGroup(index);
  };

  const categoryIcon = () => {
    if (values["category"] === "other") {
      return (
        <CategoryOutlinedIcon
          color="action"
          style={{ width: "2em", height: "2em" }}
        />
      );
    }
    return returnIcon(values["category"]);
  };

  // SNACKBARS
  const handleCloseSnackBar = (event: any, reason: string) => {
    if (reason === "clickaway") {
      return;
    }
    setOpenSnackBar(false);
  };

  const handleCloseSnackBarAlert = (event: any) => {
    setOpenSnackBar(false);
  };

  const toggleFetch = () => {
    getGroups();
    getFriends();
    getUser();
  };

  if (Object.values(errors).some((error) => error === true)) {
    return (
      <div>
        <Error toggle={toggleFetch} />
      </div>
    );
  }

  return (
    <div
      style={{
        maxWidth: "500px",
        margin: "0 auto",
      }}
    >
      <Expense>
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
        {loading ? (
          <SkeletonItem header={false} />
        ) : (
          <div style={center}>
            <Fade in={true}>
              <Paper elevation={3}>
                <AccordionSummary
                  expandIcon={
                    <ListItemButton
                      onClick={sendRequest}
                      disabled={!validateForm()}
                    >
                      <ListItemIcon style={{ minWidth: "0" }}>
                        <SendIcon color="primary" />
                      </ListItemIcon>
                    </ListItemButton>
                  }
                  aria-controls="panel1a-content"
                  id="panel1a-header"
                >
                  <MainInput>
                    <StackColumn>
                      <Button onClick={handleOpen}>{categoryIcon()}</Button>
                      <Modal
                        open={open}
                        onClose={handleClose}
                        aria-labelledby="modal-modal-title"
                        aria-describedby="modal-modal-description"
                      >
                        <Box sx={style}>
                          <ListOfCategories
                            toggleClose={handleClose}
                            toggleSave={toggleSave}
                          />
                        </Box>
                      </Modal>
                      <RowStack style={{ float: "left" }}>
                        <TextField
                          id="standard-basic"
                          label="Name"
                          value={values.name}
                          variant="standard"
                          style={nameInput}
                          onChange={handleChange("name")}
                        />

                        <FormControl
                          fullWidth
                          sx={{ m: 1 }}
                          variant="standard"
                          style={ammountInput}
                        >
                          <InputLabel htmlFor="standard-adornment-amount">
                            Amount
                          </InputLabel>
                          <Input
                            type="number"
                            id="standard-adornment-amount"
                            value={values.amount}
                            onChange={handleChange("amount")}
                            startAdornment={
                              <InputAdornment position="start">
                                $
                              </InputAdornment>
                            }
                          />
                        </FormControl>
                      </RowStack>
                    </StackColumn>
                  </MainInput>
                </AccordionSummary>
                <FormGroup
                  style={{
                    display: "block",
                    paddingBottom: "0.7rem",
                  }}
                >
                  <FormControlLabel
                    control={<Switch />}
                    label="Is paid"
                    checked={values.is_paid}
                    onChange={handleChangeSwitch("is_paid")}
                  />
                  <FormControlLabel
                    control={<Switch />}
                    label="Settled"
                    checked={values.settled}
                    onChange={handleChangeSwitch("settled")}
                  />
                  <FormControlLabel
                    control={<Switch />}
                    label="Splitted"
                    color="warning"
                    checked={values.splitted}
                    onChange={handleChangeSwitch("splitted")}
                  />
                  <Button onClick={handleOpenGroup}>
                    <GroupsIcon
                      sx={{ color: "red" }}
                      style={{ width: "2em", height: "2em" }}
                    />
                  </Button>
                  <Modal
                    open={openGroup}
                    onClose={handleCloseGroup}
                    aria-labelledby="modal-modal-title"
                    aria-describedby="modal-modal-description"
                  >
                    {groups.length > 0 || friends.length > 0 ? (
                      <Box>
                        <ListOfGroupsModal
                          toggleClose={handleCloseGroup}
                          toggleSave={toggleSaveGroup}
                          groups={groups}
                          friends={friends}
                        />
                      </Box>
                    ) : (
                      <div></div>
                    )}
                  </Modal>
                  {chosenExpenseIncurer.length > 0 ? (
                    chosenExpenseIncurer.map((group, index) => (
                      <Chip
                        color="success"
                        component="div"
                        style={chipstyling}
                        label={group}
                        key={index}
                        variant="outlined"
                        icon={<GroupOutlinedIcon />}
                        onDelete={() => handleDeleteGroup(index)}
                      />
                    ))
                  ) : (
                    <div></div>
                  )}

                  {isPayerUpdated() ? (
                    <FormControl sx={{ m: 1, minWidth: 80 }}>
                      <InputLabel id="demo-simple-select-autowidth-label">
                        Payer
                      </InputLabel>
                      <Select
                        labelId="payer-id"
                        id="payer-id"
                        value={values.payer ? values.payer.toString() : ""}
                        onChange={handleChangePayer}
                        autoWidth
                        label="Payer"
                        style={noMaxWidth}
                      >
                        {payers.map((payer, index) => (
                          <MenuItem key={index} value={payer.id}>
                            {payer.username}
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                  ) : null}
                </FormGroup>
              </Paper>
            </Fade>
          </div>
        )}
      </Expense>
      <BottomAppBar value="add expense" />
    </div>
  );
}

const chipstyling = {
  fontSize: "large",
  maxWidth: "95%",
  margin: "0.2rem auto 1rem",
  display: "flex",
  width: "fit-content",
  overflow: "hidden",
};

const noMaxWidth = {
  maxWidth: "100%",
};

const center = {
  marginLeft: "auto",
  marginRight: "auto",
  padding: "5px",
};
const nameInput = {
  display: "flex",
};

const ammountInput = {
  display: "flex",
  margin: "0",
};
const Expense = styled.div`
  max-width: 500px;
  width: 100%;
  margin-left: auto !important;
  margin-right: auto !important;
  text-align: center;
`;

const RowStack = styled.div`
  width: -webkit-fill-available;
  display: table-row-group;
`;

const StackColumn = styled.div`
  width: -webkit-fill-available;
  position: relative;
  display: contents;
`;

const MainInput = styled.div`
  flex-direction: row;
  display: flex;
  flex: 1 1 0%;
  margin-top: 14px;
}
`;
