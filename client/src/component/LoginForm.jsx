import React, { useState } from "react";
import { useAppState } from "../appState";
import { useNavigate } from "react-router-dom";

export default function LoginForm() {
  const navigate = useNavigate();

  const [verifyUser, setVerifyUser] = useState({
    email: "",
    password: "",
  });

  const [appState, dispatch] = useAppState();

  console.log(appState);

  async function handleLogin(e) {
    e.preventDefault();
    const response = await fetch("http://localhost:4000/user/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(verifyUser),
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
    <div id="login_form">
      <h1>Log In</h1>
      <form>
        <label id="login_email_label">Email</label>
        <input
          id="login_email_input"
          type="text"
          autoComplete="email"
          onChange={(e) =>
            setVerifyUser((prev) => {
              return { ...prev, email: e.target.value };
            })
          }
        />

        <label id="login_pass_label">Password</label>
        <input
          id="login_pass_input"
          type="password"
          autoComplete="off"
          onChange={(e) =>
            setVerifyUser((prev) => {
              return { ...prev, password: e.target.value };
            })
          }
        />
        <button type="submit" onClick={(e) => handleLogin(e)}>
          Login
        </button>
      </form>
    </div>
  );
}
