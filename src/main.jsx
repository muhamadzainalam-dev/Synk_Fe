import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";

import { HashRouter } from "react-router-dom";

import { store } from "../store/store.js";
import { Provider } from "react-redux";
import CheckAuth from "./components/custom/CheckAuth.jsx";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <HashRouter>
      <Provider store={store}>
        <CheckAuth>
          <App />
        </CheckAuth>
      </Provider>
    </HashRouter>
  </StrictMode>,
);
