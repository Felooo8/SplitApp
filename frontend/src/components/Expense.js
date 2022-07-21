import React, { useEffect, useState } from "react";
import styled, { css } from "styled-components";
import Accordion from "@mui/material/Accordion";
import AccordionSummary from "@mui/material/AccordionSummary";
import AccordionDetails from "@mui/material/AccordionDetails";
import Typography from "@mui/material/Typography";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import "../App.css";
import Fade from "@mui/material/Fade";
import Slide from "@mui/material/Slide";
import returnIcon from "../apis/returnIcon";

export default function ExpenseItem(props) {
  console.log(props);
  const ifBorrowed = (expense) => {
    if (expense.payer == props.currentUser.id) {
      return false;
    }
    return true;
  };

  return (
    <Expense>
      <div key={props.index} style={center}>
        <Slide
          direction="right"
          in={true}
          style={{ transitionDelay: `${props.index * 100}ms` }}
        >
          <Accordion className="boxMovementa">
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
                    {returnIcon(props.expense.category)}
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
                        {ifBorrowed(props.expense)
                          ? "you borrowed"
                          : "you lent"}
                      </YouBorrowed>
                      <Price>${props.expense.amount}</Price>
                    </RowStack>
                  </StackColumn>
                </WholeStack>
              </Typography>
            </AccordionSummary>
            <AccordionDetails>asdasd</AccordionDetails>
          </Accordion>
        </Slide>
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
