import "../App.css";

import AddIcon from "@mui/icons-material/Add";
import AddCardIcon from "@mui/icons-material/AddCard";
import GroupsIcon from "@mui/icons-material/Groups";
import HomeIcon from "@mui/icons-material/Home";
import MailIcon from "@mui/icons-material/Mail";
import PaymentsIcon from "@mui/icons-material/Payments";
import Badge from "@mui/material/Badge";
import BottomNavigation from "@mui/material/BottomNavigation";
import BottomNavigationAction from "@mui/material/BottomNavigationAction";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import CssBaseline from "@mui/material/CssBaseline";
import Link from "@mui/material/Link";
import Paper from "@mui/material/Paper";
import Slide from "@mui/material/Slide";
import Typography from "@mui/material/Typography";
import React, { useEffect, useRef, useState } from "react";

import Constants from "../apis/Constants";

export default function BottomAppBar(props) {
  const ref = useRef(null);
  const [value, setValue] = useState(props.value);
  const [notifications, setNotifications] = useState(0);
  const [scrolling, setScrolling] = useState(false);
  const [scrollTop, setScrollTop] = useState(0);
  const containerRef = React.useRef(null);

  const getNotifications = () => {
    fetch(Constants.SERVER + "/api/getNotifications", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Token ${localStorage.getItem("token")}`,
      },
    })
      .then((response) => {
        if (response.ok) {
          response.json().then((data) => {
            setNotifications(data);
          });
        } else {
          throw Error("Something went wrong");
        }
      })
      .catch((error) => {
        console.log(error);
      });
  };

  useEffect(() => {
    getNotifications();
    const onScroll = (e) => {
      setScrollTop(e.target.documentElement.scrollTop);
      setScrolling(e.target.documentElement.scrollTop > scrollTop);
    };
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, [scrollTop]);

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  return (
    <Box sx={{ pb: 7 }} ref={ref}>
      <CssBaseline />
      <Paper
        sx={{ position: "fixed", bottom: 0, left: 0, right: 0 }}
        elevation={3}
      >
        <BottomNavigation value={value} onChange={handleChange}>
          {/* <Link href="/groups">
            <HomeIcon />
          </Link> */}
          <BottomNavigationAction
            component={Link}
            href="/"
            // label="Home"
            value="home"
            icon={<HomeIcon />}
          />
          <BottomNavigationAction
            component={Link}
            href="/groups"
            // label="My Groups"
            value="groups"
            icon={<GroupsIcon />}
          />
          <BottomNavigationAction
            component={Link}
            href="/all-expenses"
            // label="All Expenses"
            value="all expenses"
            icon={<PaymentsIcon />}
          />
          <BottomNavigationAction
            component={Link}
            href="/add-expense"
            // label="All Expenses"
            value="add expense"
            icon={<AddCardIcon />}
          />
          <BottomNavigationAction
            component={Link}
            href="/notifications"
            // label="All Expenses"
            value="notifications"
            icon={
              <Badge
                badgeContent={notifications}
                color="success"
                anchorOrigin={{
                  vertical: "top",
                  horizontal: "left",
                }}
                overlap="circular"
              >
                <MailIcon color="" fontSize="medium" />
              </Badge>
            }
          />
        </BottomNavigation>
      </Paper>
      {props.value !== "add expense" ? (
        <Button
          style={addNewExpenseButton}
          className="addExpense"
          variant="contained"
          startIcon={<AddIcon />}
          component={Link}
          href="/add-expense"
          ref={containerRef}
        >
          <Slide
            orientation="horizontal"
            direction="left"
            in={!scrolling}
            container={containerRef.current}
            style={{ display: scrolling ? "none" : "" }}
          >
            <Typography variant="button">Add new expense</Typography>
          </Slide>
        </Button>
      ) : null}
      <Box sx={{ width: "50%" }}></Box>
    </Box>
  );
}

const addNewExpenseButton = {
  position: "fixed",
  bottom: "70px",
  right: "8%",
  width: "auto",
  height: "5%",
  maxWidth: "300px",
  minHeight: "40px",
  maxHeight: "60px",
  borderRadius: "40px",
  opacity: "95%",
};
