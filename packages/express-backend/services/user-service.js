import mongoose from "mongoose";
import userModel from "../models/user.js";

// To convert your existing backend.js code, replace
// the helper functions which manipulated the users 
// data with functions imported from user-services.js. 
// Note that the new functions return a Promise so be 
// sure to modify their call sites to use .then and 
// .catch. You should then be able to remove the users 
// data structure from the backend entirely—from now on 
// the data will live in MongoDB.


mongoose.set("debug", true);

mongoose
  .connect("mongodb://localhost:27017/users", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .catch((error) => console.log(error));

function getUsers(name, job) {
  let promise;
  if (name === undefined && job === undefined) {
    promise = userModel.find();
  } else if (name && !job) {
    promise = findUserByName(name);
  } else if (job && !name) {
    promise = findUserByJob(job);
  }
  return promise;
}

function findUserById(id) {
  return userModel.findById(id);
} 

function addUser(user) {
  const userToAdd = new userModel(user);
  const promise = userToAdd.save();
  return promise;
} 

function findUserByName(name) {
  return userModel.find({ name: name });
} 

function findUserByJob(job) {
  return userModel.find({ job: job });
}

export default {
  addUser,
  getUsers,
  findUserById,
  findUserByName,
  findUserByJob,
};