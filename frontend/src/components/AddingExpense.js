import React, { useEffect, useState } from "react";
import styled, { css } from "styled-components";
import LiquorIcon from "@mui/icons-material/Liquor";
import Accordion from "@mui/material/Accordion";
import AccordionSummary from "@mui/material/AccordionSummary";
import AccordionDetails from "@mui/material/AccordionDetails";
import Typography from "@mui/material/Typography";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import LocalTaxiIcon from "@mui/icons-material/LocalTaxi";
import HomeIcon from "@mui/icons-material/Home";
import ConfirmationNumberRoundedIcon from "@mui/icons-material/ConfirmationNumberRounded";
import RestaurantMenuRoundedIcon from "@mui/icons-material/RestaurantMenuRounded";
import KitchenRoundedIcon from "@mui/icons-material/KitchenRounded";
import PaidOutlinedIcon from "@mui/icons-material/PaidOutlined";
import TextField from "@mui/material/TextField";
import FormControl from "@mui/material/FormControl";
import Input from "@mui/material/Input";
import InputLabel from "@mui/material/InputLabel";
import InputAdornment from "@mui/material/InputAdornment";
import MenuItem from "@mui/material/MenuItem";
import Select from "@mui/material/Select";

// types =
//   (("Other", "Other"),
//   ("Restaurant", "Restaurant"),
//   ("Transport", "Transport"),
//   ("Rent", "Rent"),
//   ("Alcohol", "Alcohol"),
//   ("Groceries", "Groceries"),
//   ("Tickets", "Tickets"));

const categoryIconSize = "60px";

export default function AddingExpense(props) {
  const [values, setValues] = React.useState({
    amount: "",
    name: "",
    weight: "",
    weightRange: "",
    showPassword: false,
  });
  console.log(props);

  const handleChange = (prop) => (event) => {
    setValues({ ...values, [prop]: event.target.value });
  };

  const returnIcon = (expense) => {
    if (expense.category == "Restaurant") {
      return <RestaurantMenuRoundedIcon style={icon} />;
    } else if (expense.category == "Transport") {
      return <LocalTaxiIcon style={icon} />;
    } else if (expense.category == "Rent") {
      return <HomeIcon style={icon} />;
    } else if (expense.category == "Alcohol") {
      return <LiquorIcon style={icon} />;
    } else if (expense.category == "Groceries") {
      return <KitchenRoundedIcon style={icon} />;
    } else if (expense.category == "Tickets") {
      return <ConfirmationNumberRoundedIcon style={icon} />;
    }
    return <PaidOutlinedIcon style={icon} />;
  };

  return (
    <Expense>
      <div style={center}>
        <Accordion>
          <AccordionSummary
            expandIcon={
              <ExpandMoreIcon
                style={{
                  marginTop: "auto",
                  marginBottom: "auto",
                }}
              />
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
                  <LiquorIcon style={icon} />
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
          <AccordionDetails>asdasd</AccordionDetails>
        </Accordion>
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
