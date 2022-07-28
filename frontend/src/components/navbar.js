import React, { useEffect, useState } from "react";
import Container from "react-bootstrap/Container";
import Nav from "react-bootstrap/Nav";
import Navbar from "react-bootstrap/Navbar";
// import NavDropdown from "react-bootstrap/NavDropdown";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import { logout } from "../apis/auth";
import { Button } from "@material-ui/core";
import Search from "./Search";

// import IconButton from "@mui/material/IconButton";
// import FavoriteIcon from "@mui/icons-material/Favorite";

function NavbarTop(props) {
  const [currentUser, setCurrentUser] = useState(undefined);

  const handleLogout = () => {
    logout();
    localStorage.clear();
    window.location.replace("/login");
  };

  const showUserName = () => {
    if (currentUser !== undefined || currentUser !== null) {
      return currentUser;
    }
    return "Guest";
  };

  const getUsername = () => {
    let username = localStorage.getItem("UserName");
    if (username !== undefined || username !== null) {
      setCurrentUser(localStorage.getItem("UserName"));
    }
  };

  useEffect(() => {
    getUsername();
    const interval = setInterval(() => {
      getUsername();
    }, 500);
    return () => clearInterval(interval);
  }, []);

  return (
    <Navbar bg="light" expand="lg" style={navbar} variant="light" sticky="top">
      <Container>
        <Navbar.Brand href="#home">Split App</Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="me-auto">
            <Nav.Link href="/">Home</Nav.Link>
            <Nav.Link href="/groups">My Groups</Nav.Link>
            <Nav.Link href="/all-expenses">All Expenses</Nav.Link>
            <Nav.Link href="/add-expense">Add Expense</Nav.Link>
            <Nav.Link href="/summary">Summary</Nav.Link>
          </Nav>
          <Search />
          <Navbar.Text style={login}>
            Signed in as:{" "}
            <a href="/login">
              {showUserName()}
              <AccountCircleIcon fontSize="large" />
            </a>
            <Button onClick={handleLogout}>Logout</Button>
          </Navbar.Text>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}

export default NavbarTop;

const navbar = {
  width: "100%",
  boxShadow: "0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19)",
  marginBottom: "20px",
};

const login = {
  marginLeft: "auto",
  marginRight: "0",
  paddingTop: "0",
  paddingBottom: "0",
};
