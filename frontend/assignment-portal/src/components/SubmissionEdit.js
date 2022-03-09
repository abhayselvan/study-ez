import React from "react";
import "../submissions.css";

const SubmissionEdit = ({
  submission,
  score,
  setScore,
  feedback,
  setFeedback,
  saveSubmission,
}) => {
  return (
    <tr>
      <td>{submission.user_id}</td>
      <td>{submission.answer}</td>
      <td>
        <input value={score} onChange={(e) => setScore(e.target.value)} />
      </td>
      <td>
        <input value={feedback} onChange={(e) => setFeedback(e.target.value)} />
      </td>
      <td>
        <button
          onClick={(e) => {
            saveSubmission(e, submission.submission_id);
          }}
        >
          Save
        </button>
      </td>
    </tr>
  );
};

export default SubmissionEdit;
