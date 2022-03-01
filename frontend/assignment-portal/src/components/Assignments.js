import axios from "axios";
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";

function Assignments({ loginCredentials, setLoginCredentials }) {
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [assignments, setAssignments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [authorized, setAuthorized] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchAssignments = async () => {
      try {
        const fetchedAssignments = await axios.get(
          "http://localhost:8000/assignments",
          {
            headers: { Authorization: `Bearer ${loginCredentials?.token}` },
          }
        );
        console.log(fetchedAssignments);
        setAssignments(fetchedAssignments.data);
        setLoading(false);
      } catch (err) {
        setAuthorized(false);
      }
    };

    fetchAssignments();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const newAssignment = {
      id: assignments.length + 1,
      professorId: loginCredentials.id,
      title: title,
      body: body,
    };

    setAssignments([...assignments, newAssignment]);

    const response = await axios.post(
      "http://localhost:8000/assignments/create",
      newAssignment,
      {
        headers: { Authorization: `Bearer ${loginCredentials?.token}` },
      }
    );

    console.log(response);
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
        <section>
          <h2>ASSIGNMENTS</h2>
          <ul>
            {!loading &&
              assignments.map((item) => {
                return (
                  <li key={item.id}>
                    <Link to={`/assignments/${item.id}`} key={item.id}>
                      {item.title}
                    </Link>
                  </li>
                );
              })}
          </ul>
          {loginCredentials.role !== 1 && (
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
