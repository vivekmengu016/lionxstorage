import React from "react";
import ReactDOM from "react-dom/client";

import Basic from "./examples/Basic";

const root = ReactDOM.createRoot(document.getElementById("root") as HTMLElement);
root.render(
  <React.StrictMode>
    <Basic />
  </React.StrictMode>
);