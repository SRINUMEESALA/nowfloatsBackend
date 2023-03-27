import express from "express";
import { postsCollectionRef, db } from "../dbConnections/firebaseDBCon.js";
const postsRoute = new express.Router();
import {
  addDoc,
  doc,
  query,
  getDoc,
  where,
  onSnapshot,
  orderBy,
  serverTimestamp,
} from "@firebase/firestore";

const retrievePosts = async (request, response) => {
  console.log("Retrieve Post API accessed");
  let { user, onlyCurrentUserPosts } = request.query;

  try {
    // Retriving based on condition
    switch (true) {
      case onlyCurrentUserPosts !== undefined && user !== undefined:
        const userposts = query(postsCollectionRef, orderBy("date", "desc"));
        onSnapshot(userposts, (snapshot) => {
          let availableUserPosts = snapshot.docs.map((doc) => ({
            ...doc.data(),
            id: doc.id,
          }));
          availableUserPosts = availableUserPosts.filter(
            (doc) => doc.author === user
          );
          response.status(200);
          response.send(availableUserPosts);
        });
        break;

      case user !== undefined:
        let availablePosts = [];
        let q = query(postsCollectionRef, orderBy("date", "desc"));

        onSnapshot(q, (snapshot) => {
          availablePosts = snapshot.docs.map((doc) => ({
            ...doc.data(),
            id: doc.id,
          }));
          response.status(200);
          response.send(availablePosts);
        });
        break;

      default:
        break;
    }
  } catch (error) {
    response.status(500);
    response.send({ msg: "Something went wrong." });
    console.log(error);
  }
};

const getPostDetails = async (request, response) => {
  console.log("Post details API accessed");
  const { id } = request.params;

  try {
    const docRef = doc(db, "posts", id);
    const userPostDetails = await getDoc(docRef);
    response.status(200);
    response.send({
      msg: "Post details fetched successfully",
      data: userPostDetails.data(),
    });
  } catch (error) {
    response.status(500);
    response.send({ msg: "Something went wrong." });
    console.log(error);
  }
};

const publishPost = async (request, response) => {
  console.log("Publish Post API accessed");
  try {
    const post = { ...request.body, date: serverTimestamp() };
    console.log(serverTimestamp());
    console.log(post);
    const result = await addDoc(postsCollectionRef, post);
    console.log(result);
    response.status(200);
    response.send({ msg: "Posted successfully" });
  } catch (error) {
    response.status(500);
    response.send({ msg: "Something went wrong." });
    console.log(error);
  }
};

postsRoute.get("/getFeed", retrievePosts);
postsRoute.get("/posts/:id", getPostDetails);
postsRoute.post("/post", publishPost);

export default postsRoute;
