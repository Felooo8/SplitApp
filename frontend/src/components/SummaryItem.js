import React, { useEffect, useState } from "react";
import styled, { css } from "styled-components";
import "../App.css";
import Slide from "@mui/material/Slide";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import Paper from "@mui/material/Paper";
import Avatar from "@mui/material/Avatar";

export default function SummaryItem(props) {
  console.log(props);

  const isBorrowed = (debt) => {
    return debt > 0;
  };

  return (
    <div style={summarizing}>
      <div style={{ padding: "5px" }}>
        <Paper
          elevation={5}
          style={{ minHeight: "100px", borderRadius: "10px" }}
        >
          {/* <Badge color="warning" badgeContent={"!"} invisible={!isPendning()}> */}
          {/* <Paper elevation={3}> */}
          <Slide
            direction="right"
            in={true}
            style={{
              transitionDelay: `${props.index * 100}ms`,
              display: "inline-flex",
              width: "90%",
            }}
          >
            <WholeStack>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  flexWrap: "wrap",
                  marginRight: "auto",
                }}
              >
                <Avatar sx={{ width: 56, height: 56, fontSize: "2rem" }}>
                  {props.username[0]}
                </Avatar>
                <Text>{props.username}</Text>
              </div>
              <RowStack
                style={{
                  display: "table",
                  width: "min-content",
                  marginRight: "4px",
                  color: isBorrowed(props.debt) ? "orange" : "green",
                }}
              >
                <YouBorrowed>
                  {isBorrowed(props.debt) ? "you owe" : "owes you"}
                </YouBorrowed>
                <Price>${props.debt}</Price>
              </RowStack>
            </WholeStack>
          </Slide>
          {/* </Paper> */}
        </Paper>
      </div>
    </div>
  );
}

const center = {
  marginLeft: "auto",
  marginRight: "auto",
  padding: "5px",
};

const icon = {
  top: "0",
  left: "0",
  fontSize: "56",
  height: "60px",
  width: "60px",
  display: "table",
};

const summarizing = {
  maxWidth: "500px",
  width: "100%",
  marginLeft: "auto",
  marginRight: "auto",
  textAlign: "center",
};
const Text = styled.span`
  font-size: 17px;
  font-style: normal;
  font-weight: 400;
  color: #121212;
  position: relative;
  display: flex;
  text-align: left;
  margin-left: 5px;
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
