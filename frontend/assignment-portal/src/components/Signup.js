import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

function Signup({ email, setEmail, password, setPassword }) {
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [role, setRole] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!(name && role && email && password)) {
      setErrorMessage("Enter all fields");
      return;
    }

    try {
      await axios.post("http://localhost:8000/auth/signup", {
        name,
        email,
        password,
        role: role === "faculty" ? 1 : 2,
      });
      return navigate("/");
    } catch (err) {
      setErrorMessage("Email already exists");
    }
  };

  return (
    <section>
      <h2>SIGN UP</h2>
      <form onChange={() => setErrorMessage("")}>
        <div className="errmsg">{errorMessage}</div>
        <div className="signupDetails">
          <div className="text">Name</div>
          <input
            type="text"
            name="name"
            autoComplete="off"
            placeholder="Enter Name"
            required
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </div>
        <div className="signupDetails">
          <div className="text">Email</div>
          <input
            type="text"
            name="email"
            autoComplete="off"
            placeholder="Enter Email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>
        <div className="signupDetails">
          <div className="text">Password</div>
          <input
            type="password"
            name="password"
            autoComplete="off"
            placeholder="Enter Password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <span
            className="radiobuttons"
            required
            onChange={(e) => setRole(e.target.value)}
          >
            <input
              className="studentButton"
              type="radio"
              checked={role === "student"}
              onChange={() => {}}
              value="student"
              name="student"
            />{" "}
            Student
            <input
              className="facultyButton"
              type="radio"
              checked={role === "faculty"}
              onChange={() => {}}
              value="faculty"
              name="faculty"
            />{" "}
            Faculty
          </span>
        </div>
        <button onClick={handleSubmit}>Register</button>
      </form>
    </section>
  );
}

export default Signup;
