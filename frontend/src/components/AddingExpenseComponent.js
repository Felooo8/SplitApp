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
import Select from "@mui/material/Select";
import Switch from "@mui/material/Switch";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import React, { useEffect, useState } from "react";
import styled from "styled-components";
import returnIcon from "../apis/returnIcon";
import "../App.css";
import ListOfCategories from "./listOfCategoriesModal";
import ListOfGroupsModal from "./listOfGroupsModal";

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 400,
  bgcolor: "background.paper",
  border: "2px solid #000",
  boxShadow: 24,
  p: 4,
};
const defaultValues = {
  amount: "",
  name: "",
  category: "other",
  splitted: false,
  payer: null,
  is_paid: false,
  settled: false,
  owers: [],
  is_group: true,
};

export default function AddingExpense(props) {
  const [open, setOpen] = useState(false);
  const [openGroup, setOpenGroup] = useState(false);
  const [groups, setGroups] = useState(undefined);
  const [currentUser, setCurrentUser] = useState(undefined);
  const [payers, setPayers] = useState([]);
  const [friends, setFriends] = useState(undefined);
  const [chosenGroupName, setChosenGroupName] = useState("");
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);
  const handleOpenGroup = () => setOpenGroup(true);
  const handleCloseGroup = () => setOpenGroup(false);
  // need to make it possible to add a few owers (list) and settled and chosing payer
  const [values, setValues] = useState({
    amount: "",
    name: "",
    category: "other",
    splitted: false,
    payer: null,
    is_paid: false,
    settled: false,
    owers: [],
    is_group: true,
  });

  const validateForm = () => {
    return (
      values.name !== "" &&
      values.payer !== 0 &&
      // values.owers !== [] &&
      values.amount > 0 &&
      values.owers !== []
    );
  };

  const getGroups = () => {
    fetch("http://127.0.0.1:8000/api/group", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Token ${localStorage.getItem("token")}`,
      },
    }).then((response) => {
      if (response.ok) {
        response.json().then((data) => {
          setGroups(data);
          console.log(data);
        });
      } else {
        console.log("Please log in!");
      }
    });
  };

  const getFriends = () => {
    fetch("http://127.0.0.1:8000/api/seeFriends", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Token ${localStorage.getItem("token")}`,
      },
    }).then((response) => {
      if (response.ok) {
        response.json().then((data) => {
          setFriends(data);
        });
      } else {
        console.log("Please log in!");
      }
    });
  };

  const getUser = () => {
    fetch("http://127.0.0.1:8000/api/auth/users/me/", {
      headers: {
        Authorization: `Token ${localStorage.getItem("token")}`,
      },
    }).then((res) => {
      if (res.ok) {
        res.json().then((data) => {
          setCurrentUser(data);
          // setPayers([{ id: data.id, username: "You" }]);
        });
      } else {
        console.log("Not logged in");
      }
    });
  };

  useEffect(() => {
    getGroups();
    getFriends();
    getUser();
    // const interval = setInterval(() => {
    //   getGroups();
    //   getFriends();
    //   getUser();
    // }, 50000);
    // return () => clearInterval(interval);
  }, []);

  const sendRequest = () => {
    fetch("http://127.0.0.1:8000/api/addExpense", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Token ${localStorage.getItem("token")}`,
      },
      body: JSON.stringify({ values: values }),
    }).then((res) => {
      if (res.ok) {
        console.log("Good");
        setValues(defaultValues);
        setChosenGroupName("");
      } else {
        console.log("Failed");
      }
    });
  };

  const setPayersData = (id, isGroup, username) => {
    console.log("ASD");
    if (isGroup) {
      for (const group of groups) {
        if (group["id"] === id) {
          setPayers([{ id: currentUser.id, username: "You" }]);
          for (var i = 0; i < group["users"].length; i++) {
            if (group["users"][i] !== currentUser.id) {
              let newArray = {
                id: group["users"][i],
                username: group["usernames"][i],
              };
              setPayers((payers) => [...payers, newArray]);
            }
          }
          values.payer = currentUser.id;
          setValues({
            ...values,
            payer: currentUser.id,
          });
          return;
        }
      }
    } else {
      setPayers([
        { id: currentUser.id, username: "You" },
        { id: id, username: username },
      ]);
      values.payer = currentUser.id;
      setValues({
        ...values,
        payer: currentUser.id,
      });
    }
  };

  const isPayerUpdated = () => {
    return payers.length > 0;
  };

  const handleChange = (prop) => (event) => {
    setValues({ ...values, [prop]: event.target.value });
    console.log(values);
  };

  const handleChangePayer = () => (event) => {
    console.log("CHANGING");
    console.log(event.target.value);
    values.payer = event.target.value;
    setValues({ ...values, payer: event.target.value });
    if (event.target.value === values["owers"][0]) {
      if (event.target.value === currentUser.id) {
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

  const handleChangeSwitch = (prop) => (event) => {
    console.log(values);
    setValues({ ...values, [prop]: event.target.checked });
  };
  const toggleClose = (category) => {
    setOpen(false);
    setValues({ ...values, category: category });
  };
  const toggleCloseGroup = (group_friend_id, isGroup, group_friend_name) => {
    values.owers = [group_friend_id];
    values.is_group = isGroup;
    setOpenGroup(false);
    setChosenGroupName(group_friend_name);
    setPayersData(group_friend_id, isGroup, group_friend_name);
    console.log(payers);
  };

  const handleDeleteGroup = () => {
    setValues({
      ...values,
      owers: [],
    });
    setPayers([]);
    values.payer = null;
    setValues({ ...values, payer: null });
    setChosenGroupName("");
    console.log(values);
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

  return (
    <Expense>
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
              <Typography
                style={{
                  width: "-webkit-fill-available",
                }}
              >
                <WholeStack>
                  <StackColumn>
                    <Button onClick={handleOpen}>{categoryIcon()}</Button>
                    <Modal
                      open={open}
                      onClose={handleClose}
                      aria-labelledby="modal-modal-title"
                      aria-describedby="modal-modal-description"
                    >
                      <Box sx={style}>
                        <ListOfCategories toggle={toggleClose} />
                      </Box>
                    </Modal>
                    <RowStack style={{ float: "left " }}>
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
                          label="Amount"
                          value={values.amount}
                          onChange={handleChange("amount")}
                          startAdornment={
                            <InputAdornment position="start">$</InputAdornment>
                          }
                        />
                      </FormControl>
                    </RowStack>
                  </StackColumn>
                </WholeStack>
              </Typography>
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
                <Box sx={style}>
                  <ListOfGroupsModal
                    toggle={toggleCloseGroup}
                    groups={groups}
                    friends={friends}
                  />
                </Box>
              </Modal>
              {chosenGroupName !== "" ? (
                <Chip
                  color="success"
                  style={chipstyling}
                  label={chosenGroupName}
                  variant="outlined"
                  icon={<GroupOutlinedIcon />}
                  onDelete={handleDeleteGroup}
                />
              ) : null}

              {isPayerUpdated() ? (
                <FormControl sx={{ m: 1, minWidth: 80 }}>
                  <InputLabel id="demo-simple-select-autowidth-label">
                    Payer
                  </InputLabel>
                  <Select
                    labelId="payer-id"
                    id="payer-id"
                    value={values.payer}
                    onChange={handleChangePayer()}
                    autoWidth
                    label="Payer"
                    style={(chipstyling, noMaxWidth)}
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
    </Expense>
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
const Expense = styled.span`
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

const WholeStack = styled.div`
  flex-direction: row;
  display: flex;
  flex: 1 1 0%;
  margin-top: 14px;
}
`;
