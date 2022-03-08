import axios from "axios";
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
import { decodeToken } from "react-jwt";

function Discussions({ loginCredentials, setLoginCredentials }) {
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [role, setRole] = useState(2);
  const [discussions, setDiscussions] = useState([]);
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
    const fetchDiscussions = async () => {
      try {
        const fetchedDiscussions = await axios.post(
          "http://localhost:8000/discussions/list",
          {
            headers: { Authorization: `Bearer ${loginCredentials?.token}` },
          }
        );
        console.log(fetchedDiscussions);
        setDiscussions(fetchedDiscussions.data);
        setLoading(false);
      } catch (err) {
        setAuthorized(false);
      }
    };

    fetchDiscussions();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const newDiscussion = {
      title: title,
      body: body,
    };

    setDiscussions([...discussions, newDiscussion]);

    const response = await axios.post(
      "http://localhost:8000/discussions/create",
      newDiscussion,
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
        <section className="discussions">
          <h2>DISCUSSIONS</h2>
          <ul>
            {!loading &&
              discussions.map((item) => {
                return (
                  <li key={item.id}>
                    <Link to={`/discussions/${item.id}`} key={item.id}>
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
              <button onClick={handleSubmit}>Create New Discussion</button>
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

export default Discussions;
