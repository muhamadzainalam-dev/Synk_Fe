import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";

import { HashRouter } from "react-router-dom";

import { GoogleOAuthProvider } from "@react-oauth/google";

import { Provider } from "react-redux";
import { store } from "../store/store.js";
import CheckAuth from "./components/custom/CheckAuth.jsx";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <HashRouter>
      <GoogleOAuthProvider clientId="828416886131-q4n0lndnrnu6qa2pnl34gh0uo9qvdi99.apps.googleusercontent.com">
        <Provider store={store}>
          <CheckAuth>
            <App />
          </CheckAuth>
        </Provider>
      </GoogleOAuthProvider>
    </HashRouter>
  </StrictMode>,
);
