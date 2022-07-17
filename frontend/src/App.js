import "./App.css";
import React, { useEffect, useState } from "react";
import styled, { css } from "styled-components";
import LoginScreen from "./screens/Login";
import AllExpenses from "./screens/AllExpenses";
import Groups from "./screens/Groups";
import Group from "./screens/MyGroup";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import { Button } from "@material-ui/core";
import NavbarTop from "./components/navbar";

function App() {
  console.log(localStorage.getItem("token"));

  return (
    <div className="App">
      <NavbarTop />
      <p>
        Edit <code>src/App.js</code> and save to reload.
      </p>
      <Router>
        <Button
          component={Link}
          to="/login"
          variant="contained"
          color="secondary"
          style={button}
        >
          Login
        </Button>
        <Divider />
        <Button component={Link} to="/" variant="contained" style={button}>
          Home
        </Button>
        <Divider />
        <Button
          component={Link}
          to="/groups"
          variant="contained"
          color="primary"
          style={button}
        >
          See your groups
        </Button>
        <Divider />
        <Button
          component={Link}
          to="/mygroup"
          variant="contained"
          color="secondary"
          style={button}
        >
          See your groups
        </Button>
        <Divider />
        <Routes>
          <Route exact path="/" />
          <Route path="/login" element={<LoginScreen />} />
          <Route path="/groups" element={<Groups />} />
          <Route path="/mygroup/:id" element={<Group />} />
          <Route path="/all-expenses" element={<AllExpenses />} />
          <Route path="/messages" />
          <Route path="/chat" />
        </Routes>
      </Router>
    </div>
  );
}

export default App;

const button = {
  marginRight: "auto",
};

const Divider = styled.div`
  width: 10px;
  height: auto;
  display: inline-block;
`;
