import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import "./styles.css";

import { AuthProvider } from "./context/authContext.jsx";
import RequireAuth from "./components/RequireAuth.jsx";

import ReservationsHome from "./pages/ReservationsHome.jsx";
import ReservationDetail from "./pages/ReservationDetail.jsx";
import Login from "./pages/Login.jsx";
import Register from "./pages/Register.jsx";

// (Optional) expose env for debugging
if (import.meta.env && import.meta.env.DEV) {
  window.__ENV__ = import.meta.env;
  // console.log("Env:", window.__ENV__);
}

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route
            path="/"
            element={
              <RequireAuth>
                <ReservationsHome />
              </RequireAuth>
            }
          />
          <Route
            path="/reservation/:id"
            element={
              <RequireAuth>
                <ReservationDetail />
              </RequireAuth>
            }
          />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  </React.StrictMode>
);
