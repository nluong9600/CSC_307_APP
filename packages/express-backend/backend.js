// backend.js
import express from "express";
import cors from "cors";
//import userService from "./services/user-service";
import mongoose from "mongoose";
import * as userService from "./services/user-service.js";

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

const users = {
    users_list: [
      {
        id: "xyz789",
        name: "Charlie",
        job: "Janitor"
      },
      {
        id: "abc123",
        name: "Mac",
        job: "Bouncer"
      },
      {
        id: "ppp222",
        name: "Mac",
        job: "Professor"
      },
      {
        id: "yat999",
        name: "Dee",
        job: "Aspring actress"
      },
      {
        id: "zap555",
        name: "Dennis",
        job: "Bartender"
      }
    ]
  };

app.get("/users", (req, res) => {
    const name = req.query.name;
    
    if (name != undefined) {
        let result = findUserByName(name);
        result = { users_list: result };
        res.send(result);
    } else {
        res.send(users);
    }
});

// Needs to be deprecated
const findUserByName = (name) => {
    return users["users_list"].filter(
      (user) => user["name"] === name
    );
  };

//Get users by name and job DONE
app.get("/users", (req, res) => {
    const { name, job } = req.query;  
    
    userService.getUsers(name, job)
      .then(users => {
        if (!users.length) {
          return res.status(404).json({message: 'No users found'});
        }
        res.json(users);
      })
      .catch(
        error => res.status(500).json({ error: error.message})
      );
  });


// Get users by ID DONE
app.get("/users/:id", (req, res) => {
  const { id } = req.params;
  userService.findUserById(id)
    .then(user => {
      if (user) res.json(user);
      else res.status(404).json({ error: "User not found" });
    })
    .catch(error => res.status(500).json({ error: error.message }));
});

const getRandomLetter = () => {
  let letter = String.fromCharCode(97 + Math.floor(Math.random() * 26));
  return letter;
}

const genId = () => {
  let idLtrs = getRandomLetter() + getRandomLetter() + getRandomLetter();
  let idNums = Math.floor(Math.random() * (999 - 100 +1) + 100);
  return String(idLtrs) + String(idNums);
};



  
app.post("/users", (req, res) => {
  const userToAdd = req.body;
  const addedUser = addUser(userToAdd);
  console.log(addedUser);

  if (addedUser) {
    //was originally res.status(201).json(addedUser)
    res.status(201).json(addedUser);
  } else {
    res.status(500).send("Error adding user");
  }
  res.send();
});

// Need to deprecate
const delUser = (id) => {
    const index = users["users_list"].findIndex(user => user.id === id);
    if (index !== -1) {
      return users["users_list"].splice(index, 1); 
    }
    return null; 
  };
  
app.delete("/users/:id", (req, res) => {
  const id = req.params.id;  
  const deletedUser = delUser(id);
  if (deletedUser) {
      res.status(204).end();
    } else {
      res.status(404).send('Resource Not Found');
    }      
});
