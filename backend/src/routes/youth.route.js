import express from "express";
import { index, show } from "../controllers/youth.controller.js";

const youthRouter = express.Router();

youthRouter.get("/", index);
youthRouter.get("/:youth_id", show);

export default youthRouter;


