import React, { useState } from "react";
import { useAppState } from "../appState";
import SignUp from "../component/SignUp";
import LoginForm from "../component/LoginForm";

export default function Home() {
  const [appState] = useAppState();

  return (
    <div id="home_container">
      {appState.loggedIn ? <h1>Logged In</h1> : <h1>Logged Out</h1>}
      <SignUp />
      <LoginForm />
    </div>
  );
}
