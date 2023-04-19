import React from "react";
import Settling from "./SettlingComponent";
import styled from "styled-components";
import Accordion from "@mui/material/Accordion";
import AccordionSummary from "@mui/material/AccordionSummary";
import AccordionDetails from "@mui/material/AccordionDetails";
// import Typography from "@mui/material/Typography";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import "../App.css";
import Slide from "@mui/material/Slide";
import returnIcon from "../apis/returnIcon";
import Alert from "@mui/material/Alert";
import Constants from "../apis/Constants";

export default function ExpenseItem(props) {
  // console.log(props);
  const displayUser = () => {
    if (isBorrowed(props.expense)) {
      return props.expense.payer_username;
    }
    return props.expense.ower_username;
  };

  const isBorrowed = (expense) => {
    if (expense.payer === props.currentUser) {
      return false;
    }
    return true;
  };

  const isPendning = () => {
    if (props.expense.is_paid) {
      if (!isBorrowed(props.expense) && !props.expense.settled) {
        return true;
      }
    }
    return false;
  };

  const marked = (expense) => {
    if (isBorrowed(expense)) {
      return expense.is_paid === true;
    }
    return expense.settled === true;
  };

  return (
    <Expense
      style={{
        maxWidth: Constants.ITEM_MAX_WIDTH,
      }}
    >
      <div style={center}>
        <Slide
          direction="right"
          in={true}
          style={{
            transitionDelay: `${props.index * Constants.ANIMATION_DELAY}ms`,
            borderRadius: "10px",
            backgroundColor: props.expense.settled
              ? "rgb(255, 244, 229)"
              : null,
          }}
          sx={{ boxShadow: 5 }}
        >
          <Accordion className="boxMovementa">
            <AccordionSummary
              expandIcon={<ExpandMoreIcon />}
              aria-controls="panel1a-content"
              id="panel1a-header"
            >
              <WholeStack>
                <StackColumn>
                  {returnIcon(props.expense.category)}
                  <RowStack style={{ float: "left " }}>
                    <Text>{props.expense.name}</Text>
                    <Date>On: {props.expense.short_date}</Date>
                    <Date>{displayUser()}</Date>
                  </RowStack>
                </StackColumn>
                <StackColumn>
                  <RowStack
                    style={{
                      display: "table",
                      width: "min-content",
                      height: "min-content",
                      marginRight: "4px",
                      color: isBorrowed(props.expense) ? "orange" : "green",
                    }}
                  >
                    <YouBorrowed>
                      {isBorrowed(props.expense) ? "you borrowed" : "you lent"}
                    </YouBorrowed>
                    <Price>${props.expense.amount}</Price>
                  </RowStack>
                </StackColumn>
              </WholeStack>
              {isPendning() ? (
                <Alert severity="info">
                  {props.expense.ower_username} has marked as paid
                </Alert>
              ) : null}
            </AccordionSummary>
            <AccordionDetails>
              <Settling
                isBorrowed={isBorrowed(props.expense)}
                id={props.expense.id}
                expense={props.expense}
                marked={marked(props.expense)}
                toggle={props.toggle}
                errorToggle={props.errorToggle}
                isGroupExpense={props.isGroupExpense}
              />
            </AccordionDetails>
          </Accordion>
        </Slide>
        {/* </Badge> */}
      </div>
    </Expense>
  );
}

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
  // margin-top: 14px;
}
`;
