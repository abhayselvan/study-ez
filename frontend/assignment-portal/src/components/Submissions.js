import axios from "axios";
import { Fragment, useState } from "react";
import SubmissionEdit from "./SubmissionEdit";
import SubmissionLine from "./SubmissionLine";

const Submissions = ({ submissions, setSubmissions, loginCredentials, id }) => {
  const [editId, setEditId] = useState(null);
  const [score, setScore] = useState(0);
  const [feedback, setFeedback] = useState("");

  const editSubmission = (e, id) => {
    e.preventDefault();
    setEditId(id);
  };

  const saveSubmission = (e, id) => {
    e.preventDefault();
    const currentEntry = submissions.filter(
      (submission) => submission.id === editId
    )[0];
    currentEntry.score = score;
    currentEntry.feedback = feedback;
    setEditId(null);
  };

  const handleUpdate = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post(
        `http://localhost:8000/assignments/submissions/update/`,
        {
          submissions,
          id,
        },
        {
          headers: { Authorization: `Bearer ${loginCredentials?.token}` },
        }
      );
      alert(response.data);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div>
      <table>
        <thead>
          <tr>
            <th>Name</th>
            <th>Answer</th>
            <th>Score</th>
            <th>Feedback</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {submissions.map((submission) => {
            return (
              <Fragment key={submission.id}>
                {editId !== submission.id ? (
                  <SubmissionLine
                    key={submission.id}
                    submission={submission}
                    editSubmission={editSubmission}
                  />
                ) : (
                  <SubmissionEdit
                    key={submission.id}
                    submission={submission}
                    score={score}
                    setScore={setScore}
                    feedback={feedback}
                    setFeedback={setFeedback}
                    saveSubmission={saveSubmission}
                  />
                )}
              </Fragment>
            );
          })}
        </tbody>
      </table>
      <button onClick={handleUpdate}>Update</button>
    </div>
  );
};

export default Submissions;
