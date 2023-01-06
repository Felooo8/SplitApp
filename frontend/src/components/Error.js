import ReportIcon from "@mui/icons-material/Report";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import CircularProgress from "@mui/material/CircularProgress";
import Fade from "@mui/material/Fade";
import LinearProgress from "@mui/material/LinearProgress";
import Typography from "@mui/material/Typography";
import React, { useState } from "react";

import Constants from "../apis/Constants";

export default function Error(props) {
  const [refreshing, setRefreshing] = useState(false);
  const timer = React.useRef();

  const refresh = () => {
    setRefreshing(true);
    timer.current = window.setTimeout(() => {
      setRefreshing(false);
    }, Constants.PROGRESS_ANIMATION_TIME);
    props.toggle();
  };

  return (
    <div style={{ marginTop: "10em" }}>
      <ReportIcon style={icon} />
      <h5>Aaaah! Something went wrong</h5>
      <Typography variant="subtitle1" gutterBottom>
        Brace yourself till we get the error fixed.
      </Typography>
      <Typography variant="subtitle1" gutterBottom>
        You may also refresh the page or try again later
      </Typography>
      <Button variant="outlined" onClick={refresh}>
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
        <Fade in={refreshing} unmountOnExit>
          <CircularProgress />
        </Fade>
      </Box>
      <Box
        style={{
          position: "fixed",
          left: "0",
          right: "0",
          bottom: "56px",
          zIndex: "10",
        }}
      >
        <Fade in={refreshing} unmountOnExit>
          <LinearProgress sx={{ height: "8px" }} />
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
