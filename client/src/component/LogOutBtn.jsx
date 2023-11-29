import React from "react";
import { useNavigate } from "react-router-dom";
import { useAppState } from "../appState";

export default function LogOutBtn() {
  const navigate = useNavigate();
  const [, dispatch] = useAppState();
  async function handleLogOut() {
    await fetch("http://localhost:4000/user/logout", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
    });
    localStorage.removeItem("authToken");
    dispatch({
      type: "SET_LOGGED_OUT",
    });
    navigate("/");
  }

  return <button onClick={handleLogOut}>Log Out</button>;
}
