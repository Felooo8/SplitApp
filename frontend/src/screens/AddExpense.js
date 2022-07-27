import React from "react";
import AddingExpense from "../components/AddingExpenseComponent";
import BottomAppBar from "../components/Appbar";

function AddExpense(props) {
  return (
    <div
      style={{
        maxWidth: "500px",
        margin: "0 auto",
      }}
    >
      <p>Add expense:</p>
      <AddingExpense />
      <BottomAppBar value="add expense" />
    </div>
  );
}

export default AddExpense;
