import express from "express";
import {
    index,
    show,
    store,
    update
} from "../controller/youth.controller.js";
import ProtectRoute from "../middleware/protectRoute.middleware.js";

const router = express.Router();

router.get("/youth", ProtectRoute(), index);
router.get("/youth/:id", ProtectRoute(), show);
router.post("/youth", ProtectRoute(), store);
router.put("/youth/:id", ProtectRoute({ allowedRoles: ["youth"] }), update);

export default router;