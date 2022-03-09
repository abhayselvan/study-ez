import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { decodeToken } from "react-jwt";

function DiscussionDetails({ loginCredentials, setLoginCredentials }) {
  const [discussion, setDiscussion] = useState({});
  const [comments, setComments] = useState([]);
  const [comment, setComment] = useState("");
  const [authorized, setAuthorized] = useState(true);
  const [userId, setUserId] = useState(0);
  const [role, setRole] = useState(2);
  const { id } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    const decode = async () => {
      const decodedToken = await decodeToken(loginCredentials?.token);
      setRole(parseInt(decodedToken.role));
      setUserId(parseInt(decodedToken.id));
      console.log(decodedToken);
    };
    decode();
  }, []);

  useEffect(() => {
    var myHeaders = new Headers();
    myHeaders.append("Authorization", `Bearer ${loginCredentials.token}`);

    var requestOptions = {
      method: "POST",
      headers: myHeaders,
      redirect: "follow",
    };

    fetch(`http://localhost:8000/discussions/list/${id}`, requestOptions)
      .then((response) => response.json())
      .then((result) => setDiscussion(result))
      .catch((error) => console.log("error", error));
  }, []);

  useEffect(() => {
    var myHeaders = new Headers();
    myHeaders.append("Authorization", `Bearer ${loginCredentials.token}`);

    var requestOptions = {
      method: "POST",
      headers: myHeaders,
      redirect: "follow",
    };

    fetch(
      `http://localhost:8000/discussions/list/${id}/comments`,
      requestOptions
    )
      .then((response) => response.json())
      .then((result) => setComments(result.comments))
      .catch((error) => console.log("error", error));
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    var myHeaders = new Headers();
    myHeaders.append("Authorization", `Bearer ${loginCredentials.token}`);
    myHeaders.append("Content-Type", "application/json");

    var raw = JSON.stringify({
      content: comment,
    });

    var requestOptions = {
      method: "POST",
      headers: myHeaders,
      body: raw,
      redirect: "follow",
    };

    fetch(
      `http://localhost:8000/discussions/${id}/comments/add`,
      requestOptions
    )
      .then((response) => response.text())
      .then((result) => {
        console.log(result);
        setComment("");
      })
      .catch((error) => console.log("error", error));

    setComments([
      ...comments,
      {
        comment_id: comments.length + 1,
        discussion_id: id,
        user_id: userId,
        content: comment,
      },
    ]);

    setComment("");
  };

  const handleLogout = (e) => {
    e.preventDefault();
    setLoginCredentials({});
    navigate("/");
  };

  return (
    <div>
      {authorized ? (
        <section className="discussions">
          <h2>{discussion.title}</h2>
          <div>{discussion.body}</div>
          <ul className="itemList">
            {comments.map((comment) => {
              return (
                <li key={comment.comment_id}>
                  <span className="userId">{`${comment.user_id} : `}</span>
                  <span className="content">{comment.content}</span>
                </li>
              );
            })}
          </ul>
          <div>
            <textarea
              className="comment"
              value={comment}
              onChange={(e) => setComment(e.target.value)}
            />
            <button onClick={handleSubmit}>Add Comment</button>
          </div>

          <button className="logoutButton" onClick={handleLogout}>
            Log out
          </button>
        </section>
      ) : (
        <b>Unauthorized User</b>
      )}
    </div>
  );
}

export default DiscussionDetails;
