import "./App.css";

import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";

import TopBar from "./components/TopBar";
import PrivateRoute from "./components/PrivateRoute";
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
      <TopBar />
      <Router>
        <Routes>
          <Route path="/" element={<PrivateRoute />}>
            <Route path="/" element={<Summary />} />
          </Route>
          <Route path="/groups" element={<PrivateRoute />}>
            <Route path="/groups" element={<Groups />} />
          </Route>
          <Route path="/mygroup/:id/:groupName" element={<PrivateRoute />}>
            <Route path="/mygroup/:id/:groupName" element={<Group />} />
          </Route>
          <Route path="/all-expenses" element={<PrivateRoute />}>
            <Route path="/all-expenses" element={<AllExpenses />} />
          </Route>
          <Route path="/add-expense" element={<PrivateRoute />}>
            <Route path="/add-expense" element={<AddExpense />} />
          </Route>
          <Route path="/summary" element={<PrivateRoute />}>
            <Route path="/summary" element={<Summary />} />
          </Route>
          <Route path="/notifications" element={<PrivateRoute />}>
            <Route path="/notifications" element={<Notifications />} />
          </Route>
          <Route path="/friends/:search" element={<PrivateRoute />}>
            <Route path="/friends/:search" element={<FriendsFinder />} />
          </Route>
          <Route path="/login" element={<SignIn />} />
          <Route path="/sign-up" element={<SignUp />} />
        </Routes>
      </Router>
    </div>
  );
}

export default App;
