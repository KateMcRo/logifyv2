import React, { useState } from "react";
import SignUp from "./component/SignUp";
import { useAppState } from "./appState";

function App() {
  const [appState] = useAppState();
  console.log(appState);
  const [confirmUserData, setConfirmUserData] = useState({
    email: "",
    password: "",
  });
  const [updateUserData, setUpdateUserData] = useState({
    email: "",
    password: "",
  });
  const [validated, setValidated] = useState(false);

  async function handleConfirm(e) {
    e.preventDefault();
    const response = await fetch("http://localhost:4000/user/confirm", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(confirmUserData),
    });
    const data = await response.json();
    if (response.ok) {
      setValidated(true);
    } else {
      setValidated(false);
    }
    console.log(data, response.ok, response.status);
  }

  async function handleUpdate(e) {
    e.preventDefault();
    var userId = "6564ff40446c806f20213628";
    const response = await fetch(
      `http://localhost:4000/user/update/${userId}`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(updateUserData),
      }
    );
    const data = await response.json();
    console.log(data);
  }

  return (
    <div className="App">
      {appState.loggedIn ? <h1>Logged In</h1> : <h1>Logged Out</h1>}
      <SignUp />
      <div id="editForm">
        <form>
          {!validated && (
            <div id="confirm_dialogue">
              <h1>Confirm</h1>
              <label id="email_confirm_label">Enter Email</label>
              <input
                id="email_confirm_input"
                type="text"
                autoComplete="email"
                onChange={(e) =>
                  setConfirmUserData((prev) => {
                    return { ...prev, email: e.target.value };
                  })
                }
              />
              <label id="pass_confirm_label">Enter Password</label>
              <input
                id="pass_confirm_input"
                type="password"
                autoComplete="off"
                onChange={(e) =>
                  setConfirmUserData((prev) => {
                    return { ...prev, password: e.target.value };
                  })
                }
              />
              <button type="submit" onClick={(e) => handleConfirm(e)}>
                Confirm
              </button>
            </div>
          )}

          {validated && (
            <div id="reset_dialogue">
              <h1>Update</h1>
              <label id="email_edit_label">Enter New Email</label>
              <input
                id="email_edit_input"
                type="text"
                autoComplete="email"
                onChange={(e) =>
                  setUpdateUserData((prev) => {
                    return { ...prev, email: e.target.value };
                  })
                }
              />
              <label id="pass_edit_label">Enter New Password</label>
              <input
                id="pass_edit_input"
                type="password"
                autoComplete="new-password"
                onChange={(e) =>
                  setUpdateUserData((prev) => {
                    return { ...prev, password: e.target.value };
                  })
                }
              />
              <button type="submit" onClick={(e) => handleUpdate(e)}>
                Update
              </button>
            </div>
          )}
        </form>
      </div>
    </div>
  );
}

export default App;
