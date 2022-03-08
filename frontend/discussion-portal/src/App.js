import React, { useState } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./components/Login";
import Signup from "./components/Signup";
import Admin from "./components/Admin";
import "./App.css";
import Discussions from "./components/Discussions";
import DiscussionDetails from "./components/DiscussionDetails";

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
          path="discussions"
          element={
            <Discussions
              loginCredentials={loginCredentials}
              setLoginCredentials={setLoginCredentials}
            />
          }
        />
        <Route
          path="discussions/:id"
          element={
            <DiscussionDetails
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
