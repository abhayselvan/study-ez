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

  const saveSubmission = (e) => {
    e.preventDefault();
    const currentEntry = submissions.filter(
      (submission) => submission.submission_id === editId
    )[0];
    currentEntry.score = score;
    currentEntry.feedback = feedback;
    setEditId(null);

    var myHeaders = new Headers();
    myHeaders.append("Authorization", `Bearer ${loginCredentials.token}`);
    myHeaders.append("Content-Type", "application/json");

    var raw = JSON.stringify({
      submission_id: currentEntry.submission_id,
      score: parseInt(currentEntry.score),
      feedback: currentEntry.feedback,
    });

    var requestOptions = {
      method: "POST",
      headers: myHeaders,
      body: raw,
      redirect: "follow",
    };

    fetch(
      `http://localhost:8000/assignments/${id}/submissions/update`,
      requestOptions
    )
      .then((response) => response.text())
      .then((result) => console.log(result))
      .catch((error) => console.log("error", error));
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
              <Fragment key={submission.submission_id}>
                {editId !== submission.submission_id ? (
                  <SubmissionLine
                    key={submission.submission_id}
                    submission={submission}
                    editSubmission={editSubmission}
                  />
                ) : (
                  <SubmissionEdit
                    key={submission.submission_id}
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
    </div>
  );
};

export default Submissions;
