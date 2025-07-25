import express from "express"
import { createpass,updatepass,deletepass, viewpass, getpass } from "../controllers/passcontroller.js"
import { protectroute } from "../middleware/authmiddleware.js"

const router = express.Router();

router.post("/create", protectroute, createpass);

router.post("/get/:userId", protectroute, getpass);

router.post("/delete/:id", protectroute, deletepass);

router.post("/view/:id", protectroute, viewpass);

router.patch("/update/:id", protectroute, updatepass);


export default  router;