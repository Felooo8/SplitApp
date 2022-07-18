import React, { useEffect, useState } from "react";
import styled, { css } from "styled-components";
import Stack from "@mui/material/Stack";
import Paper from "@mui/material/Paper";
import { styled as styledMUI } from "@mui/material/styles";
import Grid from "@mui/system/Unstable_Grid";
import ExpsenseStack from "../components/ExpsenseStack";
import LiquorIcon from "@mui/icons-material/Liquor";
import KeyboardArrowRightIcon from "@mui/icons-material/KeyboardArrowRight";
import Accordion from "@mui/material/Accordion";
import AccordionSummary from "@mui/material/AccordionSummary";
import AccordionDetails from "@mui/material/AccordionDetails";
import Typography from "@mui/material/Typography";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";

const categoryIconSize = "60px";

function AllExpenses(props) {
  const [userExpenses, setUserExpenses] = useState(undefined);
  const [currentUser, setCurrentUser] = useState(undefined);

  const getExpenses = () => {
    fetch("http://127.0.0.1:8000/api/userExpenses", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Token ${localStorage.getItem("token")}`,
      },
    })
      .then((response) => response.json())
      .then((data) => {
        setUserExpenses(data);
        console.log(data);
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
        });
      } else {
        console.log("Not logged in");
      }
    });
  };

  const ifBorrowed = (expense) => {
    console.log(expense);
    console.log(currentUser);
    console.log(expense.payer);
    console.log(currentUser.id);
    if (expense.payer == currentUser.id) {
      return false;
    }
    return true;
  };

  useEffect(() => {
    getExpenses();
    getUser();
    const interval = setInterval(() => {
      getExpenses();
    }, 80000);
    return () => clearInterval(interval);
  }, []);
  if (userExpenses === undefined) {
    return <p>Loading...</p>;
  }
  return (
    <div>
      <p>Your expenses:</p>
      <div>
        <Stack spacing={2}>
          {userExpenses.map((expense, index) => (
            <Expense>
              <div key={index} style={center}>
                {/* {expense.name}: {expense.total}$ */}

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
                          <LiquorIcon
                            style={{
                              top: 0,
                              left: 0,
                              color: "rgba(128,128,128,1)",
                              fontSize: 56,
                              height: categoryIconSize,
                              width: categoryIconSize,
                              display: "table",
                            }}
                          ></LiquorIcon>
                          <RowStack style={{ float: "left " }}>
                            <Text>{expense.name}</Text>
                            <Date>On: {expense.short_date}</Date>
                            <Date>{expense.payer_username}</Date>
                          </RowStack>
                        </StackColumn>
                        <StackColumn>
                          <RowStack
                            style={{
                              display: "table",
                              width: "min-content",
                              marginRight: "4px",
                              color: ifBorrowed(expense) ? "orange" : "green",
                            }}
                          >
                            <YouBorrowed>
                              {ifBorrowed(expense)
                                ? "you borrowed"
                                : "you lent"}
                            </YouBorrowed>
                            <Price>${expense.total}</Price>
                          </RowStack>
                        </StackColumn>
                      </WholeStack>
                    </Typography>
                  </AccordionSummary>
                  <AccordionDetails>asdasd</AccordionDetails>
                </Accordion>
              </div>
            </Expense>
          ))}
        </Stack>
      </div>
    </div>
  );
}

export default AllExpenses;

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
  // left: ${categoryIconSize};
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
