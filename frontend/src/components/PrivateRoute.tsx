import { Navigate, Outlet } from "react-router-dom";
import React from "react";

export default function PrivateRoute() {
  let isAuth = Boolean(localStorage.getItem("token"));
  return isAuth ? <Outlet /> : <Navigate to="/login" />;
}
