import express from "express";
import cors from "cors";
import postsRoute from "./src/Routes/posts.js";

const port = process.env.PORT || 4000;
const app = express();
app.use(cors());
app.use(express.json());
app.use(postsRoute);

app.listen(port, () => {
  console.log(`Server is running successfully!`);
});
