import express from "express";
import { protectroute, protectVaultRoute } from "../middleware/authmiddleware.js"
import { createGroup,getGroups,getPasswordsByGroup,deleteGroup } from "../controllers/group.controller.js";

const router = express.Router();

router.post("/", protectroute, protectVaultRoute, createGroup);
router.get("/", protectroute, protectVaultRoute, getGroups);
router.get("/:groupId/passwords",protectroute, protectVaultRoute, getPasswordsByGroup);
router.delete("/:groupId", protectroute, protectVaultRoute, deleteGroup);

export default router;