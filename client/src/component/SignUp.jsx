import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAppState } from "../appState";

export default function SignUp() {
  const [, dispatch] = useAppState();

  const navigate = useNavigate();
  const [createUserData, setCreateUserData] = useState({
    email: "",
    password: "",
    confirm: "",
  });

  async function handleSignUp(e) {
    e.preventDefault();
    const response = await fetch("http://localhost:4000/user/create", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(createUserData),
    });
    const { data, token } = await response.json();
    console.log({ data, token });
    if (token) {
      localStorage.setItem("authToken", JSON.stringify(token));
      dispatch({
        type: "SET_USER",
        payload: {
          id: data.id,
          email: data.email,
          loggedIn: true,
        },
      });
      navigate("/dashboard");
    }
  }
  return (
    <div id="create_form">
      <h1>Sign Up</h1>
      <form>
        <label id="email_label">Email</label>
        <input
          id="email_input"
          type="text"
          autoComplete="email"
          onChange={(e) =>
            setCreateUserData((prev) => {
              return { ...prev, email: e.target.value };
            })
          }
        />
        <label id="pass_label">Password</label>
        <input
          id="pass_input"
          type="password"
          autoComplete="new-password"
          onChange={(e) =>
            setCreateUserData((prev) => {
              return { ...prev, password: e.target.value };
            })
          }
        />
        <label id="confirm_input">Confirm Password</label>
        <input
          id="confirm_input"
          type="password"
          autoComplete="off"
          onChange={(e) =>
            setCreateUserData((prev) => {
              return { ...prev, confirm: e.target.value };
            })
          }
        />
        <button type="submit" onClick={(e) => handleSignUp(e)}>
          Sign Up
        </button>
      </form>
    </div>
  );
}
