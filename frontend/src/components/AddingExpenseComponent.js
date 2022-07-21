import React, { useEffect, useState } from "react";
import "../App.css";
import ListOfCategories from "./listOfCategoriesModal";
import ListOfGroupsModal from "./listOfGroupsModal";
import styled, { css } from "styled-components";
import Accordion from "@mui/material/Accordion";
import AccordionSummary from "@mui/material/AccordionSummary";
import AccordionDetails from "@mui/material/AccordionDetails";
import Typography from "@mui/material/Typography";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import TextField from "@mui/material/TextField";
import FormControl from "@mui/material/FormControl";
import Input from "@mui/material/Input";
import InputLabel from "@mui/material/InputLabel";
import InputAdornment from "@mui/material/InputAdornment";
import Button from "@mui/material/Button";
import Modal from "@mui/material/Modal";
import Box from "@mui/material/Box";
import Paper from "@mui/material/Paper";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import SendIcon from "@mui/icons-material/Send";
import Switch from "@mui/material/Switch";
import FormGroup from "@mui/material/FormGroup";
import FormControlLabel from "@mui/material/FormControlLabel";
import CategoryOutlinedIcon from "@mui/icons-material/CategoryOutlined";
import GroupsIcon from "@mui/icons-material/Groups";
import GroupOutlinedIcon from "@mui/icons-material/GroupOutlined";
import Fade from "@mui/material/Fade";
import returnIcon from "../apis/returnIcon";
import Chip from "@mui/material/Chip";

const categoryIconSize = "60px";

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

export default function AddingExpense(props) {
  const [open, setOpen] = useState(false);
  const [openGroup, setOpenGroup] = useState(false);
  const [groups, setGroups] = useState(undefined);
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
    payer: 1,
    // owers: ["3"],
    is_paid: false,
    settled: false,
    owers: 0,
    is_group: true,
  });

  const validateForm = () => {
    return (
      values.name != "" &&
      values.payer != 0 &&
      // values.owers != [] &&
      values.amount > 0 &&
      values.owers != 0
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
          console.log(data);
        });
      } else {
        console.log("Please log in!");
      }
    });
  };

  useEffect(() => {
    getGroups();
    getFriends();
    const interval = setInterval(() => {
      getGroups();
      getFriends();
    }, 50000);
    return () => clearInterval(interval);
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
      } else {
        console.log("Failed");
      }
    });
  };

  const handleChange = (prop) => (event) => {
    setValues({ ...values, [prop]: event.target.value });
    console.log(values);
  };

  const handleChangeSwitch = (prop) => (event) => {
    setValues({ ...values, [prop]: event.target.checked });
    console.log(values);
  };
  const toggleClose = (category) => {
    setOpen(false);
    setValues({ ...values, ["category"]: category });
  };
  const toggleCloseGroup = (group_friend_id, isGroup, group_friend_name) => {
    // setValues({ ...values, ["owers"]: group_friend_id });
    // setValues({ ...values, ["is_group"]: isGroup });
    values.owers = group_friend_id;
    values.is_group = isGroup;
    setOpenGroup(false);
    setChosenGroupName(group_friend_name);
  };

  const handleDeleteGroup = () => {
    setValues({
      ...values,
      ["owers"]: 0,
    });
    setChosenGroupName("");
  };

  const categoryIcon = () => {
    if (values["category"] == "other") {
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
              {chosenGroupName != "" ? (
                <Chip
                  color="success"
                  style={chipstyling}
                  label={chosenGroupName}
                  variant="outlined"
                  icon={<GroupOutlinedIcon />}
                  onDelete={handleDeleteGroup}
                />
              ) : null}
            </FormGroup>
          </Paper>
        </Fade>
      </div>
    </Expense>
  );
}

const icon = {
  top: "0",
  left: "0",
  color: "rgba(128,128,128,1)",
  fontSize: "56",
  height: categoryIconSize,
  width: categoryIconSize,
  display: "table",
  marginTop: "auto",
  marginBottom: "auto",
};

const chipstyling = {
  fontSize: "large",
  maxWidth: "80%",
  marginTop: "0.2rem",
  marginBottom: "1rem",
};

const dial = {
  display: "flex",
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
const Date = styled.span`
  font-size: 14px;
  font-style: italic;
  font-weight: 400;
  color: #121212;
  position: relative;
  display: flex;
`;
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

const Price = styled.span`
  position: relative;
  font-style: normal;
  font-weight: 600;
  height: 37px;
  font-size: 24px;
  text-align: right;
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
