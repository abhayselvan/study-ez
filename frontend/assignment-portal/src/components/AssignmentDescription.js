import axios from "axios";
import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Submissions from "./Submissions";
import { decodeToken } from "react-jwt";

function AssignmentDescription({ loginCredentials, setLoginCredentials }) {
  const [assignment, setAssignment] = useState({});
  const [submissions, setSubmissions] = useState([]);
  const [answer, setAnswer] = useState("");
  const [authorized, setAuthorized] = useState(true);
  const [role, setRole] = useState(2);
  const { id } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    const decode = async () => {
      const decodedToken = await decodeToken(loginCredentials?.token);
      setRole(parseInt(decodedToken.role));
      console.log(decodedToken);
    };
    decode();
  }, []);

  useEffect(() => {
    var myHeaders = new Headers();
    myHeaders.append("Authorization", `Bearer ${loginCredentials.token}`);

    var requestOptions = {
      method: "POST",
      headers: myHeaders,
      redirect: "follow",
    };

    fetch(`http://localhost:8000/assignments/list/${id}`, requestOptions)
      .then((response) => response.json())
      .then((result) => setAssignment(result))
      .catch((error) => console.log("error", error));
  }, []);

  useEffect(() => {
    var myHeaders = new Headers();
    myHeaders.append("Authorization", `Bearer ${loginCredentials.token}`);

    var requestOptions = {
      method: "POST",
      headers: myHeaders,
      redirect: "follow",
    };

    fetch(
      `http://localhost:8000/assignments/list/${id}/submissions`,
      requestOptions
    )
      .then((response) => response.json())
      .then((result) => setSubmissions(result.submissions))
      .catch((error) => console.log("error", error));
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    var myHeaders = new Headers();
    myHeaders.append("Authorization", `Bearer ${loginCredentials.token}`);
    myHeaders.append("Content-Type", "application/json");

    var raw = JSON.stringify({
      answer,
    });

    var requestOptions = {
      method: "POST",
      headers: myHeaders,
      body: raw,
      redirect: "follow",
    };

    fetch(
      `http://localhost:8000/assignments/${id}/submissions/add`,
      requestOptions
    )
      .then((response) => response.text())
      .then((result) => {
        console.log(result);
        setAnswer("");
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
      {authorized ? (
        <section className="assignments">
          <h2>{assignment.title}</h2>
          {role === 2 ? (
            <div>
              <div>{assignment.body}</div>
              <textarea onChange={(e) => setAnswer(e.target.value)} />
              <button onClick={handleSubmit}>Submit assignment</button>
            </div>
          ) : (
            <div>
              <Submissions
                submissions={submissions}
                setSubmissions={setSubmissions}
                loginCredentials={loginCredentials}
                id={id}
              />
            </div>
          )}
          <button className="logoutButton" onClick={handleLogout}>
            Log out
          </button>
        </section>
      ) : (
        <b>Unauthorized User</b>
      )}
    </div>
  );
}

export default AssignmentDescription;
