import React, { useEffect, useState } from "react";
import Container from "react-bootstrap/Container";
import Nav from "react-bootstrap/Nav";
import Navbar from "react-bootstrap/Navbar";
// import NavDropdown from "react-bootstrap/NavDropdown";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import { logout } from "../apis/auth";
import { Button } from "@material-ui/core";
import Search from "./Search";

function getWindowDimensions() {
  const { innerWidth: width, innerHeight: height } = window;
  return {
    width,
    height,
  };
}

// import IconButton from "@mui/material/IconButton";
// import FavoriteIcon from "@mui/icons-material/Favorite";

function NavbarTop(props) {
  const [currentUser, setCurrentUser] = useState(undefined);
  const [isMobile, setIsMobile] = useState(false);
  const [windowDimensions, setWindowDimensions] = useState(
    getWindowDimensions()
  );
  const handleResize = () => {
    if (window.innerWidth < 720) {
      setIsMobile(true);
      console.log(1);
    } else {
      setIsMobile(false);
    }
    console.log(isMobile);
  };

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
    // window.addEventListener("resize", handleResize);
    function handleResize() {
      setWindowDimensions(getWindowDimensions());
      console.log(windowDimensions);
    }

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const whichNavbar = () => {
    return windowDimensions.width < 700;
  };

  return (
    <div>
      {whichNavbar() ? (
        <Navbar
          bg="light"
          expand="lg"
          style={navbar}
          variant="light"
          sticky="top"
        >
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
      ) : (
        <Nav
          className="flex-column"
          bg="light"
          expand="lg"
          style={navbarMobile}
          variant="light"
          sticky="top"
        >
          <Navbar.Brand href="#home">Split App</Navbar.Brand>
          <Navbar.Toggle aria-controls="basic-navbar-nav" />
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
        </Nav>
      )}
    </div>
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

const navbarMobile = {
  width: "min-content",
  boxShadow: "0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19)",
  marginBottom: "20px",
  height: getWindowDimensions().height,
  display: "grid",
};
