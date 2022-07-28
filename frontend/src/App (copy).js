import "./App.css";
import React from "react";
import SignIn from "./screens/SignIn";
import AllExpenses from "./screens/AllExpenses";
import AddExpense from "./screens/AddExpense";
import Summary from "./screens/Summary";
import FriendsFinder from "./screens/FriendsFinder";
import Invitations from "./screens/Invitations";
import Groups from "./screens/Groups";
import Group from "./screens/MyGroup";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import NavbarTop from "./components/navbar";

function App() {
  console.log(localStorage.getItem("token"));

  return (
    <div className="App" style={{ display: "table" }}>
      <NavbarTop />
      <Router>
        <Routes>
          <Route path="/" element={<Summary />} />
          <Route path="/login" element={<SignIn />} />
          <Route path="/groups" element={<Groups />} />
          <Route path="/mygroup/:id" element={<Group />} />
          <Route path="/all-expenses" element={<AllExpenses />} />
          <Route path="/add-expense" element={<AddExpense />} />
          <Route path="/summary" element={<Summary />} />
          <Route path="/notifications" element={<Invitations />} />
          <Route path="/friends/:search" element={<FriendsFinder />} />
        </Routes>
      </Router>
    </div>
  );
}

export default App;
