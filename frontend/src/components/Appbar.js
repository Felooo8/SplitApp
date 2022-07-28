import AddCardIcon from "@mui/icons-material/AddCard";
import GroupsIcon from "@mui/icons-material/Groups";
import HomeIcon from "@mui/icons-material/Home";
import PaymentsIcon from "@mui/icons-material/Payments";
import SummarizeIcon from "@mui/icons-material/Summarize";
import BottomNavigation from "@mui/material/BottomNavigation";
import BottomNavigationAction from "@mui/material/BottomNavigationAction";
import Box from "@mui/material/Box";
import CssBaseline from "@mui/material/CssBaseline";
import Link from "@mui/material/Link";
import Paper from "@mui/material/Paper";
import React, { useRef, useState } from "react";

export default function BottomAppBar(props) {
  const ref = useRef(null);
  const [value, setValue] = useState(props.value);

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
            href="/summary"
            // label="All Expenses"
            value="summary"
            icon={<SummarizeIcon />}
          />
        </BottomNavigation>
      </Paper>
    </Box>
  );
}
