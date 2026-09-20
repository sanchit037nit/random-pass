import express from "express";
import {registerOptions,registerVerify,loginOptions,loginVerify} from "../controllers/webauthncontroller.js";

import { protectroute } from "../middleware/authmiddleware.js";

const router = express.Router();
router.post("/register/options", protectroute,registerOptions);
router.post("/register/verify",protectroute,registerVerify);
router.post("/login/options",protectroute,loginOptions);
router.post("/login/verify",protectroute,loginVerify);

export default router;