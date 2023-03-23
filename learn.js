import express from "express";
import { postsCollectionRef, db } from "./dbConnections/firebaseDBCon.js";
const postsRoute = new express.Router();
import {
  getDocs,
  addDoc,
  doc,
  deleteDoc,
  updateDoc,
  query,
  where,
  onSnapshot,
} from "@firebase/firestore";

const retrievePosts = async (request, response) => {
  console.log("Retrieve Post API accessed");
  try {
    const result = await getDocs(postsCollectionRef);
    const availablePosts = result.docs.map((doc) => ({
      ...doc.data(),
      id: doc.id,
      date: new Date(doc.data().date.seconds),
    }));
    // Retriving based on condition
    // const q = query(
    //   postsCollectionRef,
    //   where("author", "!=", "srinusri76585@gmail.com")
    // );
    // onSnapshot(q, (snapshot) => {
    //   const availablePosts = snapshot.docs.map((doc) => ({
    //     ...doc.data(),
    //     id: doc.id,
    //     date: new Date(doc.data().date.seconds),
    //   }));
    //   console.log(availablePosts);
    // });
    response.status(200);
    response.send(availablePosts);
  } catch (error) {
    response.status(500);
    response.send({ msg: "Something went wrong." });
    console.log(error);
  }
};

const publishPost = async (request, response) => {
  console.log("Publish Post API accessed");
  try {
    const post = request.body;

    const result = await addDoc(postsCollectionRef, post);
    response.status(200);
    response.send({ msg: "Posted successfully" });
  } catch (error) {
    response.status(500);
    response.send({ msg: "Something went wrong." });
    console.log(error);
  }
};

const deletePost = async (request, response) => {
  console.log("Delete Post API accessed");
  try {
    const { postId } = request.query;
    const docRef = doc(db, "posts", postId);
    const result = await deleteDoc(docRef);
    console.log(result);
    response.status(200);
    response.send({ msg: "Deleted successfully" });
  } catch (error) {
    response.status(500);
    response.send({ msg: "Something went wrong." });
    console.log(error);
  }
};

const updatePost = async (request, response) => {
  console.log("Update Post API accessed");
  try {
    const updatedObj = request.body;
    const { postId } = request.query;
    const docRef = doc(db, "posts", postId);
    const result = await updateDoc(docRef, { ...updatedObj });
    console.log(result);
    response.status(200);
    response.send({ msg: "Updated successfully" });
  } catch (error) {
    response.status(500);
    response.send({ msg: "Something went wrong." });
    console.log(error);
  }
};

// Routes
postsRoute.get("/", retrievePosts);
postsRoute.post("/post", publishPost);
postsRoute.delete("/post/delete", deletePost);
postsRoute.put("/post/update", updatePost);

export default postsRoute;




GET http://localhost:4000/


###
POST http://localhost:4000/post
Content-Type: application/json

{
    "comments":"commentOne",
    "author":"krishna@gmail.com",
    "sourceUrl":"https://img.freepik.com/free-vector/happy-janmashtami-with-lord-krishna-hand-playing-bansuri-card-background_1035-24230.jpg?size=338&ext=jpg&uid=R96247835&ga=GA1.1.2024764164.1678773257&semt=sph",
    "date":"1970-01-20T10:31:23.632Z",
    "content":"newly added content"
}

###
DELETE http://localhost:4000/post/delete?postId=Vp5Xa4vTkHciqVhGVvXg

###
PUT http://localhost:4000/post/update?postId=zpNHXk7ZYf0UMain8l4L
Content-Type: application/json

{
    "comments":"commentTwo"
}