import React from "react";

const SubmissionLine = ({ submission, editSubmission }) => {
  return (
    <tr>
      <td>{submission.user_id}</td>
      <td>{submission.answer}</td>
      <td>{submission.score}</td>
      <td>{submission.feedback}</td>
      <td>
        <button
          className="edit"
          onClick={(e) => {
            editSubmission(e, submission.submission_id);
          }}
        >
          Edit
        </button>
      </td>
    </tr>
  );
};

export default SubmissionLine;
