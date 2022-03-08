import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const Admin = ({ loginCredentials, setLoginCredentials }) => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    var myHeaders = new Headers();
    myHeaders.append("Authorization", `Bearer ${loginCredentials.token}`);

    var requestOptions = {
      method: "POST",
      headers: myHeaders,
      redirect: "follow",
    };

    fetch("http://localhost:8000/admin/list/profs", requestOptions)
      .then((response) => response.text())
      .then((result) => console.log(result))
      .catch((error) => console.log("error", error));
    // console.log(loginCredentials);
    // const getUnverifiedUsers = async () => {
    //   const unverifiedUsers = await axios.post(
    //     `http://localhost:8000/admin/list/profs`,
    //     {
    //       headers: { Authorization: `Bearer ${loginCredentials.token}` },
    //     }
    //   );
    //   setUsers(unverifiedUsers.data);
    //   setLoading(false);
    // };
    // getUnverifiedUsers();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [loading]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post(
        `http://localhost:8000/admin/update/prof`,
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
                    <span>{user.email}</span>
                    <span>{user.status}</span>
                    <input
                      type="radio"
                      value="approve"
                      name="approve"
                      onClick={() => (user.status = 1)}
                    />
                    Approve
                    <input
                      type="radio"
                      value="reject"
                      name="reject"
                      onClick={() => (user.status = 0)}
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
