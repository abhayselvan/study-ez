import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const Admin = ({ loginCredentials, setLoginCredentials }) => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    var myHeaders = new Headers();
    myHeaders.append("Authorization", `Bearer ${loginCredentials.token}`);

    var requestOptions = {
      method: "POST",
      headers: myHeaders,
      redirect: "follow",
    };

    fetch("http://localhost:8000/admin/list/profs", requestOptions)
      .then((response) => response.json())
      .then((result) => {
        setUsers(result.profs);
        setLoading(false);
      })
      .catch((error) => console.log("error", error));
  }, [loading]);

  const handleSubmit = (e) => {
    e.preventDefault();

    var myHeaders = new Headers();
    myHeaders.append("Authorization", `Bearer ${loginCredentials?.token}`);
    myHeaders.append("Content-Type", "application/json");

    var raw = JSON.stringify({
      id: 2,
      approved: true,
    });

    var requestOptions = {
      method: "POST",
      headers: myHeaders,
      body: raw,
      redirect: "follow",
    };

    fetch("http://localhost:8000/admin/update/prof", requestOptions)
      .then((response) => response.text())
      .then((result) => {
        console.log(result);
        setLoading(true);
      })
      .catch((error) => console.log("error", error));
  };

  const handleLogout = (e) => {
    e.preventDefault();
    setLoginCredentials({});
    navigate("/");
  };

  return (
    <div>
      {!loading && (
        <form>
          <h2>Verification</h2>
          <ul>
            {users &&
              users.map((user) => {
                return (
                  <li key={user.id}>
                    <span>{user.email}</span>
                    <input
                      type="radio"
                      value="approve"
                      name="approve"
                      onClick={() => (user.approved = true)}
                    />
                    Approve
                    <input
                      type="radio"
                      value="reject"
                      name="reject"
                      onClick={() => (user.approved = false)}
                    />
                    Reject
                  </li>
                );
              })}
          </ul>
          <input type="submit" onClick={handleSubmit} />
        </form>
      )}
      <button onClick={handleLogout}>Log out</button>
    </div>
  );
};

export default Admin;
