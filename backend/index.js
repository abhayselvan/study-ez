const express = require("express");
const cors = require("cors");
const mysql = require("mysql");
const bodyParser = require("body-parser");
const dotenv = require("dotenv");
const bcrypt = require("bcryptjs");
const { v4: uuid } = require("uuid");
const PORT = 8000;

const app = express();
dotenv.config();

const db = mysql.createConnection({
  user: "root",
  host: "localhost",
  password: "password",
  database: "studyEZ",
});

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

const submissions = [
  {
    id: uuid(),
    name: "Abhay",
    answer: "Best Answer",
    assignmentId: 1,
    studentId: 1,
    score: 0,
    feedback: "",
  },
  {
    id: uuid(),
    name: "Arthi",
    answer: "Mid Answer",
    assignmentId: 1,
    studentId: 3,
    score: 0,
    feedback: "",
  },
  {
    id: uuid(),
    name: "Valli",
    answer: "Decent Answer",
    assignmentId: 1,
    studentId: 4,
    score: 0,
    feedback: "",
  },
];

const assignments = [
  {
    id: 1,
    professorId: 1,
    title: "assignment 1",
    body: "body 1",
  },
  {
    id: 2,
    professorId: 1,
    title: "assignment 2",
    body: "body 2",
  },
  {
    id: 3,
    professorId: 2,
    title: "assignment 3",
    body: "body 3",
  },
];

const users = [
  {
    id: 1,
    name: "Abhay",
    email: "abhayselvan@gmail.com",
    password: "abhay1234",
    token: uuid(),
    role: 1,
    verified: "approved",
  },
  {
    id: 2,
    name: "Suneri",
    email: "suneri@gmail.com",
    password: "suneri1234",
    token: uuid(),
    role: 2,
    verified: "approved",
  },
  {
    id: 3,
    name: "Arthi",
    email: "arthi@gmail.com",
    password: "arthi1234",
    token: uuid(),
    role: 1,
    verified: "approved",
  },
  {
    id: 4,
    name: "Valli",
    email: "valli@gmail.com",
    password: "valli1234",
    token: uuid(),
    role: 1,
    verified: "approved",
  },
  {
    id: 99,
    name: "admin",
    email: "admin",
    password: "123456",
    token: uuid(),
    role: 3,
    verified: "approved",
  },
  {
    id: 5,
    name: "Sivan",
    email: "sivan@gmail.com",
    password: "sivan1234",
    token: uuid(),
    role: 2,
    verified: "pending",
  },
];

const verifyToken = (req, res, next) => {
  console.log(req.body, req.headers);
  const authHeader = req.headers["authorization"];
  if (!authHeader) return res.sendStatus(401);

  const token = authHeader.split(" ")[1];
  const user = users.filter((user) => user.token === token)[0];

  if (!user) return res.sendStatus(401);

  next();
};

app.get("/", (req, res) => {
  res.send("hello world");
});

app.get("/assignments/:id", verifyToken, (req, res) => {
  const id = parseInt(req.params.id);
  const requestedAssignment = assignments.filter((item) => item.id === id);
  res.send(requestedAssignment[0]);
});

app.get("/assignments", verifyToken, (req, res) => {
  res.send(assignments);
});

app.get("/admin", verifyToken, (req, res) => {
  console.log("admin request");
  const unverifiedUsers = users.filter((user) => user.verified === "pending");
  console.log(unverifiedUsers);
  res.send(unverifiedUsers);
});

app.post("/login", (req, res) => {
  const user = users.filter((user) => user.email === req.body.email)[0];
  if (
    user &&
    user.password === req.body.password &&
    user.verified === "approved"
  ) {
    return res.send({
      id: user.id,
      name: user.name,
      token: user.token,
      role: user.role,
    });
  }
  return res.sendStatus(401);

  // db.query(
  //   `SELECT email, password
  //   FROM ${type === "student" ? "student" : "professor"}
  //   WHERE email = ${email} AND password=${password}`,
  //   (err, result, fields) => {
  //     if (err) {
  //       throw err;
  //     }
  //     if (result.length !== 1) {
  //       res.send("Wrong email/password");
  //     } else {
  //       res.send("Correct login");
  //     }
  //   }
  // );
});

app.post("/signup", async (req, res) => {
  const user = users.filter((user) => user.email === req.body.email)[0];
  if (user) res.sendStatus(401);
  users.push({ ...req.body, id: users.length + 1, token: uuid() });
  res.send("Sign up successful!");

  // const salt = await bcrypt.genSalt(10);
  // const hashedPassword = await bcrypt.hash(password, salt);

  // db.query(
  //   `INSERT into ${
  //     type === "Student" ? "Student" : "Professor"
  //   } (id, name, email, password) VALUES (1, ${name}, ${email}, ${hashedPassword})`,
  //   (err, result) => {
  //     if (err) {
  //       throw err;
  //     }
  //     res.send("User added successfully!");
  //   }
  // );
});

app.post("/assignments/create", verifyToken, (req, res) => {
  assignments.push(req.body);
  res.send(assignments);
});

app.post("/assignments/submit", verifyToken, (req, res) => {
  submissions.push(req.body);
  console.log(submissions);
  res.send(submissions);
});

app.post("/assignments/submissions/", verifyToken, (req, res) => {
  console.log(req.body);
  const id = parseInt(req.body.assignmentId);
  const requestedSubmissions = submissions.filter(
    (item) => item.assignmentId === id
  );
  console.log(requestedSubmissions);
  res.send(requestedSubmissions);
});

app.post("/assignments/submissions/update/", verifyToken, (req, res) => {
  const id = parseInt(req.body.id);
  const updatedSubmissions = req.body.submissions;

  console.log(id, updatedSubmissions);

  for (let updatedSubmission of updatedSubmissions) {
    for (let submission of submissions) {
      if (updatedSubmission.id === submission.id) {
        submission.score = updatedSubmission.score;
        submission.feedback = updatedSubmission.feedback;
      }
    }
  }

  res.send("Assignment feedback updated");
});

app.post("/admin", verifyToken, (req, res) => {
  const unverifiedUsers = users.filter((user) => user.verified !== "approved");
  console.log(unverifiedUsers);

  for (let user of req.body.users) {
    for (let unverifiedUser of unverifiedUsers) {
      if (user.id === unverifiedUser.id) {
        unverifiedUser.verified = user.verified;
      }
    }
  }
  console.log(unverifiedUsers);
  res.send("Users verified");
});

app.listen(PORT);

module.exports = users;
