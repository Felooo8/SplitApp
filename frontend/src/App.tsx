import "./App.css";

import React, { useEffect, useState } from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";

import PrivateRoute from "./components/PrivateRoute";
import TopBar from "./components/TopBar";
import AddExpense from "./screens/AddExpense";
import AllExpenses from "./screens/AllExpenses";
import FriendsFinder from "./screens/FriendsFinder";
import Groups from "./screens/Groups";
import Group from "./screens/MyGroup";
import Notifications from "./screens/Notifications";
import Profile from "./screens/Profile";
import SignIn from "./screens/SignIn";
import SignUp from "./screens/SignUp";
import Summary from "./screens/Summary";

function App() {
  const [isAuth, setIsAuth] = useState<boolean>(Boolean(localStorage.getItem("token")));
  const [currentUser, setCurrentUser] = useState<string>(
    localStorage.getItem("UserName") || "Guest"
  );

  useEffect(() => {
    setCurrentUser(localStorage.getItem("UserName") || "Guest");
    setIsAuth(Boolean(localStorage.getItem("token")));
  }, []);

  return (
    <Router>
      <div className="App">
        <TopBar username={currentUser} isAuth={isAuth} />
        <Routes>
          <Route path="/" element={<PrivateRoute />}>
            <Route index element={<Summary />} />
          </Route>
          <Route path="/groups" element={<PrivateRoute />}>
            <Route index element={<Groups />} />
          </Route>
          <Route path="/mygroup/:id/:groupName" element={<PrivateRoute />}>
            <Route index element={<Group />} />
          </Route>
          <Route path="/all-expenses" element={<PrivateRoute />}>
            <Route index element={<AllExpenses />} />
          </Route>
          <Route path="/add-expense" element={<PrivateRoute />}>
            <Route index element={<AddExpense />} />
          </Route>
          <Route path="/summary" element={<PrivateRoute />}>
            <Route index element={<Summary />} />
          </Route>
          <Route path="/notifications" element={<PrivateRoute />}>
            <Route index element={<Notifications />} />
          </Route>
          <Route path="/friends/:search" element={<PrivateRoute />}>
            <Route index element={<FriendsFinder />} />
          </Route>
          <Route path="/profile" element={<PrivateRoute />}>
            <Route index element={<Profile />} />
          </Route>
          <Route path="/login" element={<SignIn />} />
          <Route path="/sign-up" element={<SignUp />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
