import { generateToken } from "../lib/uteis.js";
import User from "../models/user.model.js";
import Password from "../models/pass.model.js";
import bcrypt from "bcryptjs";
import AuditLog from "../models/auditlogs.model.js";
import { Group } from "../models/group.model.js";

export const signup = async (req, res) => {
  const { name, emailid, password } = req.body;
  try {
    if (!name || !emailid || !password) {
      return res
        .status(400)
        .json({ success: false, message: "all fields required" });
    }
    if (password.length < 6) {
      return res
        .status(400)
        .json({
          success: false,
          message: "password must be atleast 6 characters",
        });
    }
    const user = await User.findOne({ emailid });

    if (user) {
      return res
        .status(400)
        .json({ success: false, message: "user already exists" });
    }

    const salt = await bcrypt.genSalt(10);
    const hashpass = await bcrypt.hash(password, salt);

    const newuser = new User({
      name: name,
      emailid: emailid,
      password: hashpass,
    });

    if (newuser) {
      generateToken(newuser._id, res);
      await newuser.save();
      await Group.create({
        name: "General",
        user: newuser._id,
      });
      res.status(201).json({
        _id: newuser._id,
        name: newuser.name,
        emailid: newuser.emailid,
      });
    } else {
      res.status(400).json({ message: "Invalid user data" });
    }
  } catch (error) {
    console.log("error in signup controller", error.message);
    res.status(500).json({ message: "internal server error" });
  }
};

export const login = async (req, res) => {
  const { emailid, password } = req.body;
  try {
    const user = await User.findOne({ emailid });
    if (!user) {
      return res.status(400).json({ message: "invalid credentials" });
    }

    // Check if account is locked
    if (user.lockUntil && user.lockUntil > Date.now()) {
      return res.status(403).json({ 
        message: "Account is temporarily locked due to too many failed login attempts. Please try again later." 
      });
    }

    const ispassc = await bcrypt.compare(String(password), user.password);

    if (!ispassc) {
      // Increment login attempts
      user.loginAttempts += 1;
      let message = "invalid credentials";

      // Lock out if 5 or more failed attempts
      if (user.loginAttempts >= 5) {
        user.lockUntil = Date.now() + 15 * 60 * 1000; // 15 minutes
        message = "Account locked due to 5 failed login attempts. Try again in 15 minutes.";
        
        // Log the lockout
        await AuditLog.create({
          user: user._id,
          action: "ACCOUNT LOCKED",
        });
      }
      await user.save();
      return res.status(400).json({ message });
    }

    // Successful login: reset attempts and lock
    user.loginAttempts = 0;
    user.lockUntil = undefined;
    await user.save();

    generateToken(user._id, res);

    await AuditLog.create({
      user: user._id,
      action: "LOGIN SUCCESSFUL",
    });

    return res.status(200).json({
      _id: user._id,
      fullName: user.name,
      email: user.emailid,
    });
  } catch (error) {
    console.log("error in login controller", error.message);
    res.status(500).json({ message: "internal server error" });
  }
};

export const logout = (req, res) => {
  try {
    res.cookie("jwt", "", { maxAge: 0 });
    res.status(200).json({ message: "logged out successfully" });
  } catch (error) {
    console.log("error in logout controller", error.message);
    res.status(500).json({ message: "internal server error" });
  }
};

export const checkauth = (req, res) => {
  try {
    res.status(200).json(req.user);
  } catch (error) {
    console.log("error in checkauth controller", error.message);
    res.status(500).json({ message: "internal server error" });
  }
};

export const deleteaccount = async (req, res) => {
  const { userid } = req.params;
  if (!userid) {
    return res.status(400).json({ message: "user id is required" });
  }

  try {
    await User.findByIdAndDelete(userid);
    await Password.deleteMany({ createdby: userid });
    await AuditLog.create({
      user: req.user._id,
      action: "ACCOUNT DELETION SUCCESSFULL",
      resourceId: id,
    });
    res.status(200).json({ message: "account deleted successfully" });
  } catch (error) {
    console.log("error in deleteaccount controller", error.message);
    res.status(400).json({ message: "internal server error" });
  }
};
