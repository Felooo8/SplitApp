import React from "react";

import AddingExpense from "../components/AddingExpenseComponent";
import BottomAppBar from "../components/Appbar";

function AddExpense() {
  return (
    <div
      style={{
        maxWidth: "500px",
        margin: "0 auto",
      }}
    >
      <AddingExpense />
      <BottomAppBar value="add expense" />
    </div>
  );
}

export default AddExpense;
