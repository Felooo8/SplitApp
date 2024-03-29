import "../App.css";

import Paper from "@mui/material/Paper";
import Slide from "@mui/material/Slide";
import React from "react";
import styled from "styled-components";

import Constants from "../apis/Constants";
import DisplayAvatar from "./DisplayAvatar";

export default function SummaryItem(props) {
  // console.log(props);

  const isBorrowed = (debt) => {
    return debt < 0;
  };

  return (
    <div style={body}>
      <Slide
        direction="right"
        in={true}
        style={{
          transitionDelay: `${props.index * Constants.ANIMATION_DELAY}ms`,
          display: "inline-flex",
          width: "90%",
          padding: "16px",
          maxWidth: Constants.ITEM_MAX_WIDTH,
        }}
      >
        <Paper
          elevation={5}
          style={{ minHeight: "100px", borderRadius: "10px" }}
        >
          <WholeStack>
            <DisplayAvatar
              user={{
                id: props.id,
                username: props.name,
              }}
              isGroup={props.isGroup}
            />
            <div
              style={{
                display: "flex",
                alignItems: "center",
                flexWrap: "wrap",
                marginRight: "auto",
                width: "-webkit-fill-available",
              }}
            >
              <Text>{props.name}</Text>
            </div>
            <RowStack
              style={{
                display: "table",
                width: "min-content",
                marginRight: "4px",
                color: isBorrowed(props.balance) ? "orange" : "green",
              }}
            >
              <YouBorrowed>
                {isBorrowed(props.balance) ? "you owe" : "owes you"}
              </YouBorrowed>
              <Price>${Math.abs(props.balance)}</Price>
            </RowStack>
          </WholeStack>
        </Paper>
      </Slide>
      {/* </div> */}
    </div>
  );
}

const body = {
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

const WholeStack = styled.div`
  flex-direction: row;
  display: flex;
  flex: 1 1 0%;
}
`;
