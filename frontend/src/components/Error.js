import ReportIcon from "@mui/icons-material/Report";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import React from "react";

export default function Error(props) {
  return (
    <div style={{ marginTop: "10em" }}>
      <ReportIcon style={icon} />
      <h5>Aaaah! Something went wrong</h5>
      <Typography variant="subtitle1" gutterBottom component="div">
        Brace yourself till we get the error fixed.
      </Typography>
      <Typography variant="subtitle1" gutterBottom component="div">
        You may also refresh the page or try again later
      </Typography>
      <Button variant="outlined" onClick={props.toggle}>
        Refresh
      </Button>
    </div>
  );
}

const IconSize = "140px";

const icon = {
  top: "0",
  left: "0",
  fontSize: "56",
  height: IconSize,
  width: IconSize,
  display: "table",
  margin: "auto",
};
