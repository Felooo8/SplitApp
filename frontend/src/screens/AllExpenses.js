import React, { useEffect, useState } from "react";
import styled, { css } from "styled-components";
import Stack from "@mui/material/Stack";
import Paper from "@mui/material/Paper";
import { styled as styledMUI } from "@mui/material/styles";
import Grid from "@mui/system/Unstable_Grid";
import ExpsenseStack from "../components/ExpsenseStack";
import LiquorIcon from "@mui/icons-material/Liquor";
import KeyboardArrowRightIcon from "@mui/icons-material/KeyboardArrowRight";

const Item = styledMUI(Paper)(({ theme }) => ({
  backgroundColor: theme.palette.mode === "dark" ? "#1A2027" : "#fff",
  padding: theme.spacing(1),
  textAlign: "center",
  color: theme.palette.text.primary,
  maxWidth: "500px",
  width: "100%",
  marginLeft: "auto",
  marginRight: "auto",
}));

const categoryIconSize = "60px";

function AllExpenses(props) {
  const [userExpenses, setUserExpenses] = useState(undefined);

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
      });
  };

  useEffect(() => {
    getExpenses();
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
            <div>
              <Item key={index} style={center}>
                {/* {expense.name}: {expense.total}$ */}

                <WholeStack>
                  <StackColumn>
                    <RowStack>
                      <LiquorIcon
                        style={{
                          top: 0,
                          left: 0,
                          color: "rgba(128,128,128,1)",
                          fontSize: 56,
                          height: categoryIconSize,
                          width: categoryIconSize,
                          display: "table-column-group",
                        }}
                      ></LiquorIcon>
                      <Text>Lithuania Gold before club</Text>
                      <Date>On: 15 June</Date>
                    </RowStack>
                  </StackColumn>
                  <StackColumn>
                    <RowStack>
                      <YouBorrowed>you borrowed</YouBorrowed>
                      <Price>$5.99</Price>
                    </RowStack>
                  </StackColumn>
                  <KeyboardArrowRightIcon
                    style={{
                      color: "rgba(128,128,128,1)",
                      fontSize: 40,
                      height: 44,
                      width: 15,
                      marginLeft: 8,
                      marginTop: 9,
                    }}
                  ></KeyboardArrowRightIcon>
                </WholeStack>
              </Item>
            </div>
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
};

const grid = {
  display: "grid",
};

const PostWrapper = styled.div`
  height: 50px;
  flex-direction: column;
  align-self: stretch;
  justify-content: space-around;
  display: flex;
  width: fit-content;
  padding: 10px;
  margin-left: auto;
  margin-right: auto;
`;

const Date = styled.span`
  font-family: Roboto;
  font-style: normal;
  font-weight: 400;
  color: #121212;
  height: 23px;
  position: relative;
  display: table-row-group;
  left: ${categoryIconSize};
`;

const Text = styled.span`
  font-family: Roboto;
  font-style: normal;
  font-weight: 400;
  color: #121212;
  height: 30px;
  font-size: 16px;
  position: relative;
  display: table-row-group;
  left: ${categoryIconSize};
`;

const YouBorrowed = styled.span`
  font-family: Roboto;
  font-style: normal;
  font-weight: 400;
  color: #121212;
  height: 30px;
  width: 120px;
  font-size: 16px;
  text-align: right;
  position: relative;
  display: table-row-group;
  right: 0;
`;

const RowStack = styled.div`
  width: -webkit-fill-available;
  height: 61px;
  display: table;
`;

const Price = styled.span`
  font-family: Roboto;
  position: relative;
  font-style: normal;
  font-weight: 400;
  color: #121212;
  height: 37px;
  font-size: 24px;
  text-align: right;
  display: table-row-group;
`;

const StackColumn = styled.div`
  width: -webkit-fill-available;
  height: 68px;
  position: relative;
`;

const WholeStack = styled.div`
  height: 68px;
  flex-direction: row;
  display: flex;
  flex: 1 1 0%;
  margin-top: 14px;
`;
