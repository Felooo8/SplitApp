import React from "react";
import AddingExpense from "../components/AddingExpenseComponent";

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
    </div>
  );
}

export default AddExpense;
