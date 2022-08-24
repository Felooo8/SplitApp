import { Box, Fade, useScrollTrigger } from "@mui/material";
import React from "react";

interface Props {
  /**
   * Injected by the documentation to work in an iframe.
   * You won't need it on your project.
   */
  WINDOW?: () => Window;
  children: React.ReactElement;
}

export default function ScrollTop(props: Props) {
  const { children, WINDOW } = props;
  // Note that you normally won't need to set the window ref as useScrollTrigger
  // will default to window.
  // This is only being set here because the demo is in an iframe.
  const trigger = useScrollTrigger({
    target: WINDOW ? WINDOW() : undefined,
    disableHysteresis: true,
    threshold: 100,
  });

  const handleClick = (event: React.MouseEvent<HTMLDivElement>) => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };
  return (
    <Fade in={trigger}>
      <Box
        onClick={handleClick}
        role="presentation"
        sx={{ position: "fixed", bottom: 70, left: 16 }}
      >
        {children}
      </Box>
    </Fade>
  );
}
