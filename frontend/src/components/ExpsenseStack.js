import KeyboardArrowRightIcon from "@mui/icons-material/KeyboardArrowRight";
import LiquorIcon from "@mui/icons-material/Liquor";
import React from "react";
import styled from "styled-components";

function ExpenseStack(props) {
  return (
    <Expense>
      <Rect>
        <On15JuneStackStackRow>
          <On15JuneStackStack>
            <On15JuneStack>
              <On15June>On: 15 June</On15June>
              <LiquorIcon
                style={{
                  top: 0,
                  left: 0,
                  position: "absolute",
                  color: "rgba(128,128,128,1)",
                  fontSize: 56,
                  height: 61,
                  width: 56,
                }}
              ></LiquorIcon>
              <Alcohol>Lithuania Gold before club</Alcohol>
              <YouBorrowed>you borrowed</YouBorrowed>
            </On15JuneStack>
            <LoremIpsum>$5.99</LoremIpsum>
          </On15JuneStackStack>
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
        </On15JuneStackStackRow>
      </Rect>
    </Expense>
  );
}

const Expense = styled.div`
  display: relative;
  width: 114px;
  height: 23px;
  flex-direction: column;
`;

const Rect = styled.div`
  width: 375px;
  height: 90px;
  background-color: #e6e6e6;
  flex-direction: row;
`;

const On15June = styled.span`
  font-family: Roboto;
  font-style: normal;
  font-weight: 400;
  color: #121212;
  height: 23px;
  width: 114px;
`;

const Alcohol = styled.span`
  font-family: Roboto;
  font-style: normal;
  font-weight: 400;
  color: #121212;
  height: 30px;
  width: 201px;
  font-size: 16px;
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
`;

const On15JuneStack = styled.div`
  width: 352px;
  height: 61px;
  position: absolute;
`;

const LoremIpsum = styled.span`
  font-family: Roboto;
  top: 31px;
  left: 250px;
  position: absolute;
  font-style: normal;
  font-weight: 400;
  color: #121212;
  height: 37px;
  width: 102px;
  font-size: 24px;
  text-align: right;
`;

const On15JuneStackStack = styled.div`
  width: 352px;
  height: 68px;
  position: relative;
`;

const On15JuneStackStackRow = styled.div`
  height: 68px;
  flex-direction: row;
  display: flex;
  flex: 1 1 0%;
  margin-top: 14px;
`;

export default ExpenseStack;
