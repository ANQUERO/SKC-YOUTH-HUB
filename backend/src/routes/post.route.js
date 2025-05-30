import express from "express";
import { 
    createPost,
    getPosts,
    addComment,
    addReaction 

} from "../controllers/post.controller.js"

const postRouter = express.Router();

postRouter.post("/post", createPost);
postRouter.get("/post", getPosts);
postRouter.post("/posts/:post_id/comments", addComment);
postRouter.post("/posts/:post_id/reactions", addReaction);


export default postRouter;