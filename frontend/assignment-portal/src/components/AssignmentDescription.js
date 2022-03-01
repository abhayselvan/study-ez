import axios from "axios";
import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { v4 as uuid } from "uuid";
import Submissions from "./Submissions";

function AssignmentDescription({ loginCredentials, setLoginCredentials }) {
  const [assignment, setAssignment] = useState({});
  const [submissions, setSubmissions] = useState([]);
  const [answer, setAnswer] = useState("");
  const [authorized, setAuthorized] = useState(true);
  const { id } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchAssignment = async () => {
      try {
        const fetchedAssignment = await axios.get(
          `http://localhost:8000/assignments/${id}`,
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
          `http://localhost:8000/assignments/submissions/`,
          {
            assignmentId: id,
          },
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
        `http://localhost:8000/assignments/submit/`,
        {
          id: uuid(),
          name: loginCredentials.name,
          answer: answer,
          assignmentId: id,
          studentId: loginCredentials.id,
          score: 0,
          feedback: "",
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
        <section>
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
