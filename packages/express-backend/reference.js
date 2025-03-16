//reference.js

import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import mongoose from "mongoose";

// Import the user service functions
import * as userService from "./services/user-service.js";

// Load environment variables from .env
dotenv.config();
const { MONGO_CONNECTION_STRING } = process.env;

// Connect to the MongoDB database named "users"
mongoose.set("debug", true);
mongoose.connect(MONGO_CONNECTION_STRING + "users")
  .catch(error => console.log(error));

const app = express();
const port = 8000;

// Enable CORS to allow frontend to communicate with backend
app.use(cors());

// Middleware to parse incoming JSON requests
app.use(express.json());

// Root Route
app.get("/", (req, res) => {
  res.send("Hello World!");
});

// GET /users: Retrieve all users with optional filtering by name and/or job
app.get("/users", (req, res) => {
  const { name, job } = req.query;
  
  if (name && job) {
    userService.findUserByNameAndJob(name, job)
      .then(users => res.json({ users_list: users }))
      .catch(error => res.status(500).json({ error: error.message }));
  } else if (name) {
    userService.findUserByName(name)
      .then(users => res.json({ users_list: users }))
      .catch(error => res.status(500).json({ error: error.message }));
  } else if (job) {
    userService.findUserByJob(job)
      .then(users => res.json({ users_list: users }))
      .catch(error => res.status(500).json({ error: error.message }));
  } else {
    userService.findAllUsers()
      .then(users => res.json({ users_list: users }))
      .catch(error => res.status(500).json({ error: error.message }));
  }
});

// GET /users/:id: Retrieve a user by _id
app.get("/users/:id", (req, res) => {
  const { id } = req.params;
  userService.findUserById(id)
    .then(user => {
      if (user) res.json(user);
      else res.status(404).json({ error: "User not found" });
    })
    .catch(error => res.status(500).json({ error: error.message }));
});

// POST /users: Create a new user
app.post("/users", (req, res) => {
  const userToAdd = req.body;
  userService.createUser(userToAdd)
    .then(user => res.status(201).json(user))
    .catch(error => res.status(500).json({ error: error.message }));
});

// DELETE /users/:id: Remove a user by _id
app.delete("/users/:id", (req, res) => {
  const { id } = req.params;
  userService.deleteUser(id)
    .then(user => {
      if (user) res.json({ message: "User deleted successfully" });
      else res.status(404).json({ error: "User not found" });
    })
    .catch(error => res.status(500).json({ error: error.message }));
});

// Start the server
app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
