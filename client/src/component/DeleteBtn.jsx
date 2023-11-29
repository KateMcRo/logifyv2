import React from "react";
import { useNavigate } from "react-router-dom";
import { useAppState } from "../appState";

export default function DeleteBtn() {
  const navigate = useNavigate();
  const [appState, dispatch] = useAppState();
  async function handleDelete() {
    await fetch(`http://localhost:4000/user/delete/${appState.id}`, {
      method: "DELETE",
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

  return <button onClick={handleDelete}>Delete</button>;
}
