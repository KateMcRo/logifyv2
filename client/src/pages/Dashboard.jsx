import React from "react";
import EditUserForm from "../component/EditUserForm";
import { useAppState } from "../appState";
import LogOutBtn from "../component/LogOutBtn";
import DeleteBtn from "../component/DeleteBtn";

export default function Dashboard() {
  const [appState] = useAppState();
  console.log(appState);

  return (
    <div id="dash_container">
      <h1>Dashboard</h1>
      <p>Hello, {appState.email}</p>
      <EditUserForm />
      <LogOutBtn />
      <DeleteBtn />
    </div>
  );
}
