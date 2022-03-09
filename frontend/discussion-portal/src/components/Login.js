import React, { useState } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";

function Login({
  setLoginCredentials,
  email,
  setEmail,
  password,
  setPassword,
}) {
  const navigate = useNavigate();
  const [errorMessage, setErrorMessage] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!(email && password)) {
      setErrorMessage("Enter all fields");
      return;
    }

    try {
      const loginResponse = await axios.post(
        "http://localhost:8000/auth/login",
        {
          email: email,
          password: password,
        }
      );

      console.log(loginResponse);
      setLoginCredentials(loginResponse.data);

      if (email === "admin@domain.com") navigate("/admin");
      else navigate("/discussions");
    } catch (err) {
      console.log(err);
      setErrorMessage("Invalid Email/Password");
    }
  };

  return (
    <section>
      <h2>LOGIN</h2>
      <form onChange={() => setErrorMessage("")}>
        <div className="errmsg">{errorMessage}</div>
        <div className="loginDetails">
          <div className="text">Email</div>
          <input
            className="textbox"
            type="text"
            name="email"
            placeholder="Enter Email"
            autoComplete="off"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>
        <div className="loginDetails">
          <div className="text">Password</div>
          <input
            className="textbox"
            type="password"
            name="password"
            placeholder="Enter Password"
            autoComplete="off"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>
        <button className="submitButton" onClick={handleSubmit}>
          Login
        </button>
      </form>
      <Link to="/signup">
        <button className="registerButton">Register</button>
      </Link>
    </section>
  );
}

export default Login;
