import "../App.css";

import FormControlLabel from "@mui/material/FormControlLabel";
import FormGroup from "@mui/material/FormGroup";
import Switch from "@mui/material/Switch";
import React, { useState } from "react";

import { postSetAsPaid, postSettled } from "../apis/fetch";

export default function Settling(props) {
  const [settled, setSettled] = useState(props.marked);
  const getLabel = (isBorrowed) => {
    if (isBorrowed) {
      return "Set as Paid";
    }
    // console.log(props);
    return "Settle";
  };

  const handleChangeSwitch = () => (event) => {
    setSettled(event.target.checked);
    if (props.isBorrowed) {
      postSetAsPaid(
        props.id,
        event.target.checked,
        props.isGroupExpense,
        props.errorToggle
      ).then((fetched) => {
        if (!fetched) {
          setSettled(!event.target.checked);
        }
      });
      props.expense["is_paid"] = event.target.checked;
    } else {
      postSettled(
        props.id,
        event.target.checked,
        props.isGroupExpense,
        props.errorToggle
      ).then((fetched) => {
        if (!fetched) {
          setSettled(!event.target.checked);
        }
      });
      props.expense["settled"] = event.target.checked;
    }
    props.toggle();
  };

  return (
    <div>
      <FormGroup
        style={{
          display: "block",
          paddingBottom: "0.7rem",
        }}
      >
        <FormControlLabel
          control={<Switch />}
          label={getLabel(props.isBorrowed)}
          checked={settled}
          onChange={handleChangeSwitch()}
        />
      </FormGroup>
    </div>
  );
}
