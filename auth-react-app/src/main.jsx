import React from "react";
import "./index.css";
import App from "./App";
import { AuthProvider } from "./AuthContext";
import { createRoot } from "react-dom/client";

const root = document.getElementById("root");
const rootInstance = createRoot(root);
rootInstance.render(
  <AuthProvider>
    <App />
  </AuthProvider>
);
