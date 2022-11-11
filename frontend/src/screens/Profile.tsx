import React, { SyntheticEvent, useEffect, useReducer, useState } from "react";
import Constants from "../apis/Constants";
import BottomAppBar from "../components/Appbar";
import Error from "../components/Error";
import ExpenseItem from "../components/Expense";
import NothingToDisplay from "../components/NothingToDisplay";
import SkeletonItem from "../components/SkeletonItem";

export default function Profile() {
  return (
    <div>
      <BottomAppBar value="" />
    </div>
  );
}
