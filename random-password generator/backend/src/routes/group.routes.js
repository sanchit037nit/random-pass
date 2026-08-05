import express from "express";
import { protectroute } from "../middleware/authmiddleware.js"
import { createGroup,getGroups,getPasswordsByGroup } from "../controllers/group.controller.js";

const router = express.Router();

router.post("/", protectroute, createGroup);
router.get("/", protectroute, getGroups);
router.get("/:groupId/passwords",protectroute,getPasswordsByGroup);

export default router;