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
  });

  useEffect(() => {
    const fetchAssignment = async () => {
      try {
        const fetchedAssignment = await axios.get(
          `http://localhost:8000/assignments/list/${id}`,
          {
            headers: { Authorization: `Bearer ${loginCredentials?.token}` },
          }
        );
        console.log(fetchedAssignment);
        setAssignment(fetchedAssignment.data);
      } catch (err) {
        setAuthorized(false);
      }
    };
    fetchAssignment();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    const fetchSubmissions = async () => {
      try {
        const fetchedSubmissions = await axios.post(
          `http://localhost:8000/assignments/list/${id}/submissions`,
          {
            headers: { Authorization: `Bearer ${loginCredentials?.token}` },
          }
        );
        console.log("Submissions");
        console.log(fetchedSubmissions);
        console.log(fetchedSubmissions.data);
        setSubmissions(fetchedSubmissions.data);
      } catch (err) {
        console.error(err);
      }
    };
    fetchSubmissions();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post(
        `http://localhost:8000/assignments/list/${id}/submissions/add`,
        {
          answer: answer,
        },
        {
          headers: { Authorization: `Bearer ${loginCredentials?.token}` },
        }
      );
      console.log(response.data);
      alert("Assignment submitted successfully!");
      setAnswer("");
    } catch (err) {
      console.error(err);
      alert("Submission failed");
    }
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
          {loginCredentials.role === 1 ? (
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
          <button onClick={handleLogout}>Log out</button>
        </section>
      ) : (
        <b>Unauthorized User</b>
      )}
    </div>
  );
}

export default AssignmentDescription;
