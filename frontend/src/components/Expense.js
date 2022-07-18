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

// types =
//   (("Other", "Other"),
//   ("Restaurant", "Restaurant"),
//   ("Transport", "Transport"),
//   ("Rent", "Rent"),
//   ("Alcohol", "Alcohol"),
//   ("Groceries", "Groceries"),
//   ("Tickets", "Tickets"));

const categoryIconSize = "60px";

export default function ExpenseItem(props) {
  console.log(props);
  const ifBorrowed = (expense) => {
    if (expense.payer == props.currentUser.id) {
      return false;
    }
    return true;
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
      <div key={props.index} style={center}>
        <Accordion>
          <AccordionSummary
            expandIcon={<ExpandMoreIcon />}
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
                  {returnIcon(props.expense)}
                  {/* <LiquorIcon
                    style={{
                      top: 0,
                      left: 0,
                      color: "rgba(128,128,128,1)",
                      fontSize: 56,
                      height: categoryIconSize,
                      width: categoryIconSize,
                      display: "table",
                    }}
                  ></LiquorIcon> */}
                  <RowStack style={{ float: "left " }}>
                    <Text>{props.expense.name}</Text>
                    <Date>On: {props.expense.short_date}</Date>
                    <Date>{props.expense.payer_username}</Date>
                  </RowStack>
                </StackColumn>
                <StackColumn>
                  <RowStack
                    style={{
                      display: "table",
                      width: "min-content",
                      marginRight: "4px",
                      color: ifBorrowed(props.expense) ? "orange" : "green",
                    }}
                  >
                    <YouBorrowed>
                      {ifBorrowed(props.expense) ? "you borrowed" : "you lent"}
                    </YouBorrowed>
                    <Price>${props.expense.total}</Price>
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
};

const center = {
  marginLeft: "auto",
  marginRight: "auto",
  padding: "5px",
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

const Text = styled.span`
  font-size: 17px;
  font-style: normal;
  font-weight: 400;
  color: #121212;
  position: relative;
  display: flex;
  text-align: left;
`;

const YouBorrowed = styled.span`
  font-style: italic;
  font-weight: 400;
  height: 30px;
  width: max-content;
  font-size: 16px;
  text-align: right;
  position: relative;
  display: block;
  right: 0;
  margin-left: auto;
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
