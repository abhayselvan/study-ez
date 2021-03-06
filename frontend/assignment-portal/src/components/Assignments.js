import axios from "axios";
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
import { decodeToken } from "react-jwt";

function Assignments({ loginCredentials, setLoginCredentials }) {
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [role, setRole] = useState(2);
  const [assignments, setAssignments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [authorized, setAuthorized] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const decode = async () => {
      const decodedToken = await decodeToken(loginCredentials?.token);
      setRole(parseInt(decodedToken.role));
      console.log(decodedToken);
    };
    decode();
  });

  useEffect(() => {
    const fetchAssignments = async () => {
      console.log("working", loginCredentials);
      try {
        var myHeaders = new Headers();
        myHeaders.append("Authorization", `Bearer ${loginCredentials.token}`);

        var requestOptions = {
          method: "POST",
          headers: myHeaders,
          redirect: "follow",
        };

        fetch("http://localhost:8000/assignments/list", requestOptions)
          .then((response) => response.text())
          .then((result) => console.log(result))
          .catch((error) => console.log("error", error));

        // const fetchedAssignments = await axios.post(
        //   "http://localhost:8000/assignments/list",
        //   {
        //     headers: {
        //       Authorization: `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXUyJ9.eyJlbWFpbCI6ImFiaGF5QGdtYWlsLmNvbSIsImlkIjoiMiIsImlzcyI6ImF1dGgwIiwicm9sZSI6IjEifQ.3jRfjUg-zF_Uzfyopr3D5uxTXM5jwu4RHaJSfHdEdTQ`,
        //     },
        //   }
        // );
        // console.log(fetchedAssignments);
        // setAssignments(fetchedAssignments.data);
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
      title: title,
      body: body,
    };

    setAssignments([...assignments, newAssignment]);

    const response = await axios.post(
      "http://localhost:8000/assignments/create",
      newAssignment,
      {
        headers: { authorization: `Bearer ${loginCredentials?.token}` },
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
        <section className="assignments">
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
