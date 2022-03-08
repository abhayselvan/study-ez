import React from "react";

const SubmissionLine = ({ submission, editSubmission }) => {
  return (
    <tr>
      <td>{submission.name}</td>
      <td>{submission.answer}</td>
      <td>{submission.score}</td>
      <td>{submission.feedback}</td>
      <td>
        <button
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
