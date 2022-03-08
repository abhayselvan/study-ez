import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
import { decodeToken } from "react-jwt";

function Assignments({ loginCredentials, setLoginCredentials }) {
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [role, setRole] = useState(2);
  const [userId, setUserId] = useState(null);
  const [assignments, setAssignments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [authorized, setAuthorized] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const decode = async () => {
      const decodedToken = await decodeToken(loginCredentials?.token);
      setRole(parseInt(decodedToken.role));
      setUserId(parseInt(decodedToken.id));
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

    fetch("http://localhost:8000/assignments/list", requestOptions)
      .then((response) => response.json())
      .then((result) => {
        setAssignments(result.assignments);
        setLoading(false);
      })
      .catch((error) => setAuthorized(false));
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();

    const newAssignment = {
      assignment_id: assignments.length + 1,
      user_id: userId,
      title: title,
      body: body,
    };

    setAssignments([...assignments, newAssignment]);

    var myHeaders = new Headers();
    myHeaders.append("Authorization", `Bearer ${loginCredentials.token}`);
    myHeaders.append("Content-Type", "application/json");

    var raw = JSON.stringify({ title, body });

    var requestOptions = {
      method: "POST",
      headers: myHeaders,
      body: raw,
      redirect: "follow",
    };

    fetch("http://localhost:8000/assignments/create/", requestOptions)
      .then((response) => response.text())
      .then((result) => console.log(result))
      .catch((error) => console.log("error", error));

    setTitle("");
    setBody("");
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
          <h2>ASSIGNMENTS</h2>
          <ul>
            {!loading &&
              assignments.map((item) => {
                return (
                  <li key={item.assignment_id}>
                    <Link
                      to={`/assignments/${item.assignment_id}`}
                      key={item.assignment_id}
                    >
                      {item.title}
                    </Link>
                  </li>
                );
              })}
          </ul>
          {role === 1 && (
            <div>
              <input
                type="text"
                value={title}
                placeholder="Enter title"
                onChange={(e) => setTitle(e.target.value)}
              />
              <textarea
                placeholder="Enter description"
                value={body}
                onChange={(e) => setBody(e.target.value)}
              />
              <button onClick={handleSubmit}>Create New Assignment</button>
            </div>
          )}
          <button onClick={handleLogout}>Log out</button>
        </section>
      ) : (
        <b>Unauthorized User</b>
      )}
    </div>
  );
}

export default Assignments;
