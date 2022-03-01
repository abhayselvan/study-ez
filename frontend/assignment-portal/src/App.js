import React, { useState } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./components/Login";
import Signup from "./components/Signup";
import Assignments from "./components/Assignments";
import AssignmentDescription from "./components/AssignmentDescription";
import Admin from "./components/Admin";
import "./App.css";

function App() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loginCredentials, setLoginCredentials] = useState({});
  return (
    <Router>
      <Routes>
        <Route
          exact
          path="/"
          element={
            <Login
              email={email}
              setEmail={setEmail}
              password={password}
              setPassword={setPassword}
              loginCredentials={loginCredentials}
              setLoginCredentials={setLoginCredentials}
            />
          }
        />
        <Route
          path="signup"
          element={
            <Signup
              email={email}
              setEmail={setEmail}
              password={password}
              setPassword={setPassword}
            />
          }
        />
        <Route
          path="assignments"
          element={
            <Assignments
              loginCredentials={loginCredentials}
              setLoginCredentials={setLoginCredentials}
            />
          }
        />
        <Route
          path="assignments/:id"
          element={
            <AssignmentDescription
              loginCredentials={loginCredentials}
              setLoginCredentials={setLoginCredentials}
            />
          }
        />
        <Route
          path="admin"
          element={
            <Admin
              loginCredentials={loginCredentials}
              setLoginCredentials={setLoginCredentials}
            />
          }
        />
      </Routes>
    </Router>
  );
}

export default App;
