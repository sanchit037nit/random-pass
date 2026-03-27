import express from "express"
import { createpass,updatepass,deletepass, viewpass, getpass,Dashpage,getRecycleBin,restorePass,deleteforever } from "../controllers/passcontroller.js"
import { protectroute } from "../middleware/authmiddleware.js"

const router = express.Router();

router.post("/create", protectroute, createpass);

router.get("/get/:userId", protectroute, getpass);

router.delete("/delete/:id", protectroute, deletepass);

router.delete("/deleteforever/:id", protectroute, deleteforever);

router.get("/view/:id", protectroute, viewpass);

router.patch("/update/:id", protectroute, updatepass);

router.get("/dashboard/:userId", protectroute, Dashpage);

router.get("/recycle/:userId", protectroute, getRecycleBin);

router.patch("/restore/:id", protectroute, restorePass);


export default  router;