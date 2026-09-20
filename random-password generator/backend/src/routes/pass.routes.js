import express from "express"
import { createpass,updatepass,deletepass, viewpass, getpass,Dashpage,getRecycleBin,restorePass,deleteforever,downloadpass,getSecurityAlerts } from "../controllers/passcontroller.js"
import { protectroute } from "../middleware/authmiddleware.js"
import { createPasswordLimiter ,updatePasswordLimiter, deletePasswordLimiter, exportLimiter } from "../middleware/ratelimiter.js";


const router = express.Router();
router.post("/create", protectroute,createPasswordLimiter, createpass);
router.get("/get/:userId", protectroute, getpass);
router.delete("/delete/:id", protectroute,deletePasswordLimiter, deletepass);
router.delete("/deleteforever/:id", protectroute, deleteforever);
router.get("/view/:id", protectroute, viewpass);
router.patch("/update/:id", protectroute,updatePasswordLimiter, updatepass);
router.get("/dashboard/:userId", protectroute, Dashpage);
router.get("/recycle/:userId", protectroute, getRecycleBin);
router.patch("/restore/:id", protectroute, restorePass);
router.get("/download/:userId", protectroute, exportLimiter, downloadpass);
router.get("/security-alerts", protectroute, getSecurityAlerts);

export default  router;