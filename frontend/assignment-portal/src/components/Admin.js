import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const Admin = ({ loginCredentials, setLoginCredentials }) => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const getUnverifiedUsers = async () => {
      const unverifiedUsers = await axios.get(`http://localhost:8000/admin/`, {
        headers: { Authorization: `Bearer ${loginCredentials?.token}` },
      });
      setUsers(unverifiedUsers.data);
      setLoading(false);
    };
    getUnverifiedUsers();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [loading]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post(
        `http://localhost:8000/admin/`,
        {
          users,
        },
        {
          headers: { Authorization: `Bearer ${loginCredentials?.token}` },
        }
      );
      setLoading(true);
      console.log(response.data);
    } catch (err) {
      console.error(err);
    }
  };

  const handleLogout = (e) => {
    e.preventDefault();
    setLoginCredentials({});
    navigate("/");
  };

  return (
    <div>
      {!loading && (
        <form>
          <h2>Verification</h2>
          <ul>
            {users &&
              users.map((user) => {
                return (
                  <li key={user.id}>
                    <span>{user.name}</span>
                    <span>{user.email}</span>
                    <input
                      type="radio"
                      value="approve"
                      name="approve"
                      onClick={() => (user.status = "approved")}
                    />
                    Approve
                    <input
                      type="radio"
                      value="reject"
                      name="reject"
                      onClick={() => (user.status = "rejected")}
                    />
                    Reject
                  </li>
                );
              })}
          </ul>
          <input type="submit" onClick={handleSubmit} />
        </form>
      )}
      <button onClick={handleLogout}>Log out</button>
    </div>
  );
};

export default Admin;
