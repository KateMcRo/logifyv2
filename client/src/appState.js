import { createContext, useReducer, useContext, useEffect } from "react";

const initialState = {
  id: "",
  email: "",
  loggedIn: false,
};

const AppStateContext = createContext(initialState);

// Creates reducer
const appStateReducer = (state, action) => {
  switch (action.type) {
    case "SET_USER": {
      return {
        ...state,
        id: action.payload.id,
        email: action.payload.email,
        loggedIn: action.payload.loggedIn,
      };
    }
    case "SET_LOGGED_IN": {
      return {
        ...state,
        loggedIn: action.payload.loggedIn,
      };
    }
    case "SET_LOGGED_OUT": {
      return initialState;
    }
    default:
      return initialState;
  }
};

export const AppStateProvider = ({ children }) => {
  // Custom hook to use reducer
  const [appState, dispatch] = useReducer(appStateReducer, initialState);
  useEffect(() => {
    async function checkToken() {
      const token = JSON.parse(localStorage.getItem("authToken"));
      const response = await fetch("http://localhost:4000/user/validate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: token,
        },
      });
      if (response.ok) {
        const {
          valid: { data },
        } = await response.json();

        dispatch({
          type: "SET_USER",
          payload: {
            id: data.id,
            email: data.email,
            loggedIn: true,
          },
        });
      }
    }
    checkToken();
  }, []);
  // Passes along appState and dispatcher to provider for children to use
  return (
    <AppStateContext.Provider value={[appState, dispatch]}>
      {children}
    </AppStateContext.Provider>
  );
};

export const useAppState = () => useContext(AppStateContext);
