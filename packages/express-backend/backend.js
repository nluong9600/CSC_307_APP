// backend.js
import express from "express";
import cors from "cors";
import userService from "./services/user-service.js"
import dotenv from "dotenv";
import mongoose from "mongoose";

dotenv.config();

const { MONGO_CONNECTION_STRING } = process.env;

mongoose.set("debug", true);
mongoose
  .connect(MONGO_CONNECTION_STRING + "users")
  .catch((error) => console.log(error));

const app = express();
const port = 8000;

app.use(cors());

app.use(express.json());

app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.listen(port, () => {
  console.log(
    `Example app listening at http://localhost:${port}`
  );
});

// Get user by name and/or job or just get all users 
app.get("/users", (req, res) => {
    const name = req.query.name;
    const job = req.query.job;

    userService.getUsers(name, job)
      .then(result => {
        res.send({users_list : result})
      })
      .catch(error => {
        res.status(500).send("Error fetching: " + error.message);
      })
});

// Get user by id
app.get("/users/:id", (req, res) => {
  const id = req.params.id; 
  userService.findUserById(id)
  .then(result => {
    if (result) {
      res.send(result)
    } else {
      res.status(404).send("User not found");
    }
  })
  .catch(error => {
    console.error("Error fetching user:", error);
    res.status(500).send("Internal Server Error")
  });
});

// Add a user
app.post("/users", (req, res) => {
  const userToAdd = req.body;
  userService.addUser(userToAdd)
    .then(result => {
      res.status(201).json(result);
    })
    .catch(error => {
      res.status(500).send("Error adding user", error);
    })
});

// Delete user by id 
app.delete("/users/:id", (req, res) => {
  const id = req.params.id;  
  
  userService.delUserById(id)
    .then(result => {
      res.status(204).end();
    })
    .catch(error => {
      res.status(404).send('Resource Not Found');
    });    
});