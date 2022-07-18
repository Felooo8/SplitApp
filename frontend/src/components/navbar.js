import React, { useEffect, useState } from "react";
import Container from "react-bootstrap/Container";
import Nav from "react-bootstrap/Nav";
import Navbar from "react-bootstrap/Navbar";
import NavDropdown from "react-bootstrap/NavDropdown";
import styled, { css } from "styled-components";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import { logout } from "../apis/auth";
import { Button } from "@material-ui/core";
// import IconButton from "@mui/material/IconButton";
// import FavoriteIcon from "@mui/icons-material/Favorite";

function NavbarTop(props) {
  const [currentUser, setCurrentUser] = useState(undefined);

  const handleLogout = () => {
    logout();
    window.location.replace("http://localhost:3000/login");
  };

  const getUser = () => {
    fetch("http://127.0.0.1:8000/api/auth/users/me/", {
      headers: {
        Authorization: `Token ${localStorage.getItem("token")}`,
      },
    }).then((res) => {
      if (res.ok) {
        res.json().then((data) => {
          setCurrentUser(data);
        });
      } else {
        console.log("Not logged in");
      }
    });
  };

  const showUserName = () => {
    if (currentUser != undefined) {
      return currentUser.username;
    }
    return "Guest";
  };

  useEffect(() => {
    getUser();
    const interval = setInterval(() => {
      getUser();
    }, 50000);
    return () => clearInterval(interval);
  }, []);

  return (
    <Navbar bg="light" expand="lg" style={navbar}>
      <Container>
        <Navbar.Brand href="#home">Split App</Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="me-auto">
            <Nav.Link href="/">Home</Nav.Link>
            <Nav.Link href="/groups">My Groups</Nav.Link>
            <Nav.Link href="/all-expenses">All Expenses</Nav.Link>
            <Nav.Link href="/add-expense">Add Expense</Nav.Link>
            <NavDropdown title="Dropdown" id="basic-nav-dropdown">
              <NavDropdown.Item href="#action/3.1">Action</NavDropdown.Item>
              <NavDropdown.Item href="#action/3.2">
                Another action
              </NavDropdown.Item>
              <NavDropdown.Item href="#action/3.3">Something</NavDropdown.Item>
              <NavDropdown.Divider />
              <NavDropdown.Item href="#action/3.4">
                Separated link
              </NavDropdown.Item>
            </NavDropdown>
          </Nav>
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
};

const login = {
  marginLeft: "auto",
  marginRight: "0",
  paddingTop: "0",
  paddingBottom: "0",
};
