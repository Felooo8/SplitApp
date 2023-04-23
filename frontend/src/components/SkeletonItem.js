import Skeleton from "@mui/material/Skeleton";
import React from "react";

const WIDTH = 396;
const HEIGHT = 100;

export default function SkeletonItem(props) {
  return (
    <div style={{ maxHeight: "90%", position: "fixed", left: "0", right: "0" }}>
      {props.header ? (
        <Skeleton width={WIDTH} height={30} animation="wave" style={skeleton} />
      ) : null}
      <Skeleton width={WIDTH} height={HEIGHT} style={skeleton} />
      <Skeleton width={WIDTH} height={HEIGHT} style={skeleton} />
      <Skeleton width={WIDTH} height={HEIGHT} style={skeleton} />
      <Skeleton width={WIDTH} height={HEIGHT} style={skeleton} />
      <Skeleton width={WIDTH} height={HEIGHT} style={skeleton} />
      <Skeleton width={WIDTH} height={HEIGHT} style={skeleton} />
      <Skeleton width={WIDTH} height={HEIGHT} style={skeleton} />
      <Skeleton width={WIDTH} height={HEIGHT} style={skeleton} />
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
