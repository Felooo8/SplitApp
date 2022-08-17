import React from "react";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import CircularProgress from "@mui/material/CircularProgress";
import Fade from "@mui/material/Fade";
import Typography from "@mui/material/Typography";

export default function NothingToDisplay(props) {
  const StatusIcon = props.statusIcon;
  return (
    <div style={{ marginTop: "10em" }}>
      <StatusIcon style={icon} />
      <h5>{props.mainText}</h5>
      <Typography variant="subtitle1" gutterBottom component="div">
        {props.helperText}
      </Typography>
      <Button variant="outlined" onClick={props.toggleRefresh}>
        Refresh
      </Button>
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          marginTop: "1rem",
        }}
      >
        <Fade in={props.refreshing} unmountOnExit>
          <CircularProgress />
        </Fade>
      </Box>
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
