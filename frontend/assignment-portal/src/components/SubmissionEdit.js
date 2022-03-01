import React from "react";

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
      <td>{submission.name}</td>
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
            saveSubmission(e, submission.id);
          }}
        >
          Save
        </button>
      </td>
    </tr>
  );
};

export default SubmissionEdit;
