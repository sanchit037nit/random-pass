import express from "express"
import { createpass,updatepass,deletepass, viewpass, getpass } from "../controllers/passcontroller.js"
import { protectroute } from "../middleware/authmiddleware.js"

const router = express.Router();

router.post("/create", protectroute, createpass);

router.get("/get/:userId", protectroute, getpass);

router.delete("/delete/:id", protectroute, deletepass);

router.get("/view/:id", protectroute, viewpass);

router.patch("/update/:id", protectroute, updatepass);


export default  router;