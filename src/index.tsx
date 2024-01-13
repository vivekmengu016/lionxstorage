import React from "react";
import ReactDOM from "react-dom/client";

import LocalStorage from "./examples/LocalStorage";
import SessionStorage from "./examples/SessionStorage";
import CookieStorage from "./examples/Cookies";
import IndexedDBStorage from "./examples/IndexedDB";

const root = ReactDOM.createRoot(document.getElementById("root") as HTMLElement);
root.render(
  <React.StrictMode>
    <LocalStorage />
    <SessionStorage />
    <CookieStorage />
    <IndexedDBStorage />
  </React.StrictMode>
);