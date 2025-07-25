import express from "express"
import { login,logout,signup,checkauth } from "../controllers/authcontroller.js";
import { protectroute } from "../middleware/authmiddleware.js"

const router = express.Router();


router.post("/signup",signup)
router.post("/login",login)
router.post("/logout",logout)
router.get("/check",protectroute,checkauth)

export default  router;