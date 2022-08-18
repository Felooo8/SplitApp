import "./App.css";

import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";

import NavbarTop from "./components/navbar";
import AddExpense from "./screens/AddExpense";
import AllExpenses from "./screens/AllExpenses";
import FriendsFinder from "./screens/FriendsFinder";
import Groups from "./screens/Groups";
import Group from "./screens/MyGroup";
import Notifications from "./screens/Notifications";
import SignIn from "./screens/SignIn";
import SignUp from "./screens/SignUp";
import Summary from "./screens/Summary";

function App() {
  console.log(localStorage.getItem("token"));

  return (
    <div className="App">
      <NavbarTop />
      <Router>
        <Routes>
          <Route path="/" element={<Summary />} />
          <Route path="/login" element={<SignIn />} />
          <Route path="/sign-up" element={<SignUp />} />
          <Route path="/groups" element={<Groups />} />
          <Route path="/mygroup/:id/:groupName" element={<Group />} />
          <Route path="/all-expenses" element={<AllExpenses />} />
          <Route path="/add-expense" element={<AddExpense />} />
          <Route path="/summary" element={<Summary />} />
          <Route path="/notifications" element={<Notifications />} />
          <Route path="/friends/:search" element={<FriendsFinder />} />
        </Routes>
      </Router>
    </div>
  );
}

export default App;
