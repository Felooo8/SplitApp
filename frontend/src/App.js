import "./App.css";
import React, { useEffect, useState } from "react";
import styled, { css } from "styled-components";
import SignIn from "./screens/SignIn";
import AllExpenses from "./screens/AllExpenses";
import AddExpense from "./screens/AddExpense";
import Summary from "./screens/Summary";
import Groups from "./screens/Groups";
import Group from "./screens/MyGroup";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import Button from "@mui/material/Button";
import NavbarTop from "./components/navbar";
import Stack from "@mui/material/Stack";
import Grid from "@mui/material/Grid";

function App() {
  console.log(localStorage.getItem("token"));

  return (
    <div className="App">
      <NavbarTop />
      <p>
        Edit <code>src/App.js</code> and save to reload.
      </p>
      <Router>
        <Grid
          container
          direction="row"
          justifyContent="center"
          alignItems="center"
          rowSpacing={2}
          columnSpacing={1}
        >
          <Grid item xs="auto">
            <Button href="/login" variant="contained" color="error">
              Login
            </Button>
          </Grid>
          <Grid item xs="auto">
            <Button href="/" variant="contained">
              Home
            </Button>
          </Grid>
          <Grid item xs="auto">
            <Button href="/groups" variant="contained" color="warning">
              See your groups
            </Button>
          </Grid>
          <Grid item xs="auto">
            <Button href="/summary" variant="outlined" color="success">
              Summary
            </Button>
          </Grid>
        </Grid>
        <Routes>
          <Route exact path="/" />
          <Route path="/login" element={<SignIn />} />
          <Route path="/groups" element={<Groups />} />
          <Route path="/mygroup/:id" element={<Group />} />
          <Route path="/all-expenses" element={<AllExpenses />} />
          <Route path="/add-expense" element={<AddExpense />} />
          <Route path="/summary" element={<Summary />} />
        </Routes>
      </Router>
    </div>
  );
}

export default App;
