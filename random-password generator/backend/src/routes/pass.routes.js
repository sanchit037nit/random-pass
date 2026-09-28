import express from "express"
import { createpass,updatepass,deletepass, viewpass, getpass,Dashpage,getRecycleBin,restorePass,deleteforever,downloadpass,getSecurityAlerts,generateRoast } from "../controllers/passcontroller.js"
import { protectroute, protectVaultRoute } from "../middleware/authmiddleware.js"
import { createPasswordLimiter ,updatePasswordLimiter, deletePasswordLimiter, exportLimiter } from "../middleware/ratelimiter.js";


const router = express.Router();
router.post("/create", protectroute, protectVaultRoute, createPasswordLimiter, createpass);
router.get("/get/:userId", protectroute, protectVaultRoute, getpass);
router.delete("/delete/:id", protectroute, protectVaultRoute, deletePasswordLimiter, deletepass);
router.delete("/deleteforever/:id", protectroute, protectVaultRoute, deleteforever);
router.get("/view/:id", protectroute, protectVaultRoute, viewpass);
router.patch("/update/:id", protectroute, protectVaultRoute, updatePasswordLimiter, updatepass);
router.get("/dashboard/:userId", protectroute, protectVaultRoute, Dashpage);
router.get("/recycle/:userId", protectroute, protectVaultRoute, getRecycleBin);
router.patch("/restore/:id", protectroute, protectVaultRoute, restorePass);
router.get("/download/:userId", protectroute, protectVaultRoute, exportLimiter, downloadpass);
router.get("/security-alerts", protectroute, protectVaultRoute, getSecurityAlerts);
router.post("/roast", protectroute, generateRoast);

export default  router;