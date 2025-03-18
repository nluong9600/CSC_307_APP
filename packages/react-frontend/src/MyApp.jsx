// src/MyApp.jsx
import React, { useState, useEffect } from "react";
import Table from "./Table";
import Form from "./Form";

const characters = [
  {
    name: "Charlie",
    job: "Janitor"
  },
  {
    name: "Mac",
    job: "Bouncer"
  },
  {
    name: "Dee",
    job: "Aspring actress"
  },
  {
    name: "Dennis",
    job: "Bartender"
  }
];

function MyApp() {
  const [characters, setCharacters] = useState ([]);

  function removeOneCharacter(index) {
    const userToDelete = characters[index];
    console.log(userToDelete);
    fetch(`http://localhost:8000/users/${userToDelete._id}`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: userToDelete.name }) // Send user name to delete
    })
    .then(res => {
      const updated = characters.filter((character, i) => {
        return i !== index;
      });
      setCharacters(updated);
    })
  }

  function updateList(person) {
    //old function used for adding characters?: setCharacters([...characters, person])
    postUser(person)
    .then(res => {
      if (res.status === 201) {
        console.log(`Success: ${res.status}`);
        return res.json();
      } 
      else {
        throw new Error("Failed to add user");
      }
    })
    .then(data => setCharacters([...characters, data]))
    .catch((error) => {
      console.log(error);
    });
  }

  function fetchUsers() {
    const promise = fetch("http://localhost:8000/users");
    return promise;
  } //Promises are the basis of asynchronous processing in Javascript

  function postUser(person) {
    const promise = fetch("Http://localhost:8000/users", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(person)
    });
  
    return promise;
  }

  useEffect(() => {
    fetchUsers()
      .then((res) => res.json())
      .then((json) => setCharacters(json["users_list"]))
      .catch((error) => {
        console.log(error);
      });
    }, []);

  return (
    <div className = "container">
      <Table 
        characterData={characters}
        removeCharacter={removeOneCharacter}
      />
      <Form handleSubmit = {updateList}/> 
    </div>
  );
}
export default MyApp;