import jwt from "jsonwebtoken";
import user from "../models/user.model.js"

export const protectroute = async(req,res,next) =>{
  try{
      const token = req.cookies.jwt

    if(!token){
        return res.status(401).json({message:"unauthorized - no token provided"})
    }

    const decoded=jwt.verify(token,process.env.JWT_SECRET)

    if(!decoded){
        return res.status(401).json({message:"unauthorized - invalid token"})
    }
    
    const User=await user.findById(decoded.userId).select("-password")

    if(!User){
        return res.status(401).json({message:"user not found"})
    }

    req.User=User
    next()
   }
    catch (error){
        console.log("error in protecteroute",error.message)
        res.status(500).json({message: "error in protecteroute"})
    }
}

export const protectVaultRoute = async (req, res, next) => {
    try {
        const token = req.cookies.vault_jwt;
        if (!token) {
            return res.status(403).json({ message: "Forbidden - Vault is locked. Biometric authentication required." });
        }
        
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        if (!decoded || !decoded.vaultUnlocked) {
            return res.status(403).json({ message: "Forbidden - Invalid vault token" });
        }
        
        // Ensure the vault token matches the main session
        if (decoded.userId !== req.User?._id?.toString()) {
             return res.status(403).json({ message: "Forbidden - Session mismatch" });
        }

        next();
    } catch (error) {
        console.log("error in protectVaultRoute", error.message);
        res.status(403).json({ message: "Forbidden - Vault access denied" });
    }
}