import LiquorIcon from "@mui/icons-material/Liquor";
import LocalTaxiIcon from "@mui/icons-material/LocalTaxi";
import HomeIcon from "@mui/icons-material/Home";
import ConfirmationNumberRoundedIcon from "@mui/icons-material/ConfirmationNumberRounded";
import RestaurantMenuRoundedIcon from "@mui/icons-material/RestaurantMenuRounded";
import KitchenRoundedIcon from "@mui/icons-material/KitchenRounded";
import PaidOutlinedIcon from "@mui/icons-material/PaidOutlined";
import React from "react";

// types =
//   (("Other", "Other"),
//   ("Restaurant", "Restaurant"),
//   ("Transport", "Transport"),
//   ("Rent", "Rent"),
//   ("Alcohol", "Alcohol"),
//   ("Groceries", "Groceries"),
//   ("Tickets", "Tickets"));

const categoryIconSize = "60px";

export default function returnIcon(category) {
  switch (category) {
    case "Restaurant":
      return <RestaurantMenuRoundedIcon style={icon} sx={{ color: "gray" }} />;
    case "Transport":
      return <LocalTaxiIcon style={icon} sx={{ color: "#ffc107" }} />;
    case "Rent":
      return <HomeIcon style={icon} sx={{ color: "black" }} />;
    case "Alcohol":
      return <LiquorIcon style={icon} sx={{ color: "#28a745" }} />;
    case "Groceries":
      return <KitchenRoundedIcon style={icon} sx={{ color: "#17a2b8" }} />;
    case "Tickets":
      return (
        <ConfirmationNumberRoundedIcon style={icon} sx={{ color: "#007bff" }} />
      );
  }
  return <PaidOutlinedIcon style={icon} sx={{ color: "green" }} />;
}

const icon = {
  top: "0",
  left: "0",
  fontSize: "56",
  height: categoryIconSize,
  width: categoryIconSize,
  display: "table",
  margin: "auto",
};
