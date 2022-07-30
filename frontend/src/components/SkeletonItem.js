import React from "react";
import Skeleton from "@mui/material/Skeleton";

export default function SkeletonItem(props) {
  return (
    <div style={{ maxHeight: "90%", position: "fixed", left: "0", right: "0" }}>
      {props.header ? (
        <Skeleton width={396} height={30} animation="wave" style={skeleton} />
      ) : null}
      <Skeleton width={396} height={100} style={skeleton} />
      <Skeleton width={396} height={100} style={skeleton} />
      <Skeleton width={396} height={100} style={skeleton} />
      <Skeleton width={396} height={100} style={skeleton} />
      <Skeleton width={396} height={100} style={skeleton} />
      <Skeleton width={396} height={100} style={skeleton} />
      <Skeleton width={396} height={100} style={skeleton} />
      <Skeleton width={396} height={100} style={skeleton} />
    </div>
  );
}

const skeleton = {
  margin: "0 auto",
  maxWidth: "90%",
  borderRadius: "10px",
  transform: "scale(1, 1)",
  marginBottom: "20px",
};
