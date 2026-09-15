import {generateToken} from "../lib/uteis.js"
import Password from "../models/pass.model.js"
import User from "../models/user.model.js"
import PDFDocument from "pdfkit";
import AuditLog from "../models/auditlogs.model.js";
import { Group } from "../models/group.model.js";


const fetchPasswords = async (userId) => {
  return await Password.find({
    createdby: userId,
    deleted: false,
  });
};

export const createpass = async (req, res) => {
    try {

        const {
            name,
            password,
            description,
            createdby,
            group
        } = req.body;

        if (!name || !password || !description) {
            return res.status(400).json({
                message: "All fields are required"
            });
        }

        // If no group is selected, use the user's General group
        let groupId = group;

        if (!groupId) {

            const generalGroup = await Group.findOne({
                user: req.User._id,
                name: "General"
            });

            if (!generalGroup) {
                return res.status(404).json({
                    message: "Default group not found"
                });
            }

            groupId = generalGroup._id;
        }

        // Check that the selected group belongs to the logged-in user
        const groupExists = await Group.findOne({
            _id: groupId,
            user: req.User._id
        });

        if (!groupExists) {
            return res.status(404).json({
                message: "Invalid group"
            });
        }

        const newpass = await Password.create({
            name,
            password,
            description,
            group: groupId,
            createdby
        });

        await AuditLog.create({
            user: req.User._id,
            action: "CREATE_PASSWORD",
            resourceId: newpass._id
        });

        return res.status(201).json({
            _id: newpass._id,
            name: newpass.name,
            password: newpass.password,
            description: newpass.description,
            group: newpass.group,
            createdby: newpass.createdby
        });

    } catch (error) {

        console.error("Error creating password:", error);

        return res.status(500).json({
            message: "Internal Server Error"
        });
    }
};

export const updatepass = async (req, res) => {
    const { name, password, description, group } = req.body;
    const { id } = req.params;

    try {

        if (!id) {
            return res.status(400).json({
                message: "No password selected"
            });
        }

        // Verify group belongs to the logged-in user
        if (group) {

            const exists = await Group.findOne({
                _id: group,
                createdBy: req.User._id
            });

            if (!exists) {
                return res.status(404).json({
                    message: "Invalid group"
                });
            }
        }

        // Verify password belongs to the logged-in user
        const existingPassword = await Password.findOne({
            _id: id,
            createdby: req.User._id
        });

        if (!existingPassword) {
            return res.status(404).json({
                message: "Password not found"
            });
        }

        const updatedPassword = await Password.findByIdAndUpdate(
            id,
            {
                $set: {
                    name,
                    password,
                    description,
                    group,
                    passwordUpdatedAt: new Date(),
                },
            },
            { new: true }
        );

        await AuditLog.create({
            user: req.User._id,
            action: "UPDATE_PASSWORD",
            resourceId: id,
        });

        return res.status(200).json({
            message: "Password updated successfully",
            password: updatedPassword,
        });

    } catch (error) {
        console.error("Error updating password:", error);

        return res.status(500).json({
            message: "Internal Server Error"
        });
    }
};

export const deletepass = async (req, res) => {
  const { id } = req.params;
  try {
    const pass = await Password.findById(id);
    if (!pass) return res.status(400).json({ message: "Password not found" });

    pass.deleted = true; 
    pass.deletedAt= new Date()
    await pass.save();

    await AuditLog.create({
    user:id,
    action:"PASSWORD DELETED SUCCESSFULLY",
    resourceId:id
    });

    return res.status(200).json({ message: "Password moved to Recycle Bin" });
  } catch (error) {
    console.log("Error deleting password", error);
    res.status(500).json({ message: "Server error" });
  }
};

export const deleteforever = async (req, res) => {
  const { id } = req.params;
  try {
    const pass = await Password.findById(id);
    console.log(pass)
    if (!pass) return res.status(400).json({ message: "Password not found" });

    const del = await Password.findByIdAndDelete(id);



    return res.status(200).json({ message: "Password deleted successfully" });
  } catch (error) {
    console.log("Error deleting password", error);
    res.status(500).json({ message: "Server error" });
  }
};

export const viewpass= async(req,res)=>{
    const {id}=req.params
    try {
        const password=await Password.findById(id)

        if(!password){
              return res.status(400).json({message:"click valid password"})
        }

        return res.status(200).json({password})

    } catch (error) {
        console.log("error in viewing password",error)
    }
}

export const Dashpage = async (req, res) => {
  const { userId } = req.params;
  // console.log(userId)
  try {
    if (!userId) return res.status(400).json({ message: "user id required" });

    const user = await User.findById(userId);
    if (!user) return res.status(400).json({ message: "invalid user" });

    const passwords = await Password.find({ createdby: userId ,deleted:false});


    // Count passwords per group
    const groupCounts = passwords.reduce((acc, pass) => {
      const group = pass.group || "General";
      acc[group] = (acc[group] || 0) + 1;
      return acc;
    }, {});

    // Recent passwords (last 5)
    const recentPasswords = passwords
      .sort((a, b) => b.createdAt - a.createdAt)
      .slice(0, 5);

    return res.status(200).json({
      totalPasswords: passwords.length,
      groupCounts,
      recentPasswords,
    });
  } catch (error) {
    console.log("Dashboard error:", error);
    return res.status(500).json({ message: "Server error" });
  }
};

export const getRecycleBin = async (req, res) => {
  const { userId } = req.params;
  try {
    const passwords = await Password.find({ createdby: userId, deleted: true });
    res.status(200).json({ passwords });
  } catch (error) {
    console.log("Error fetching recycle bin", error);
    res.status(500).json({ message: "Server error" });
  }
};

export const restorePass = async (req, res) => {
  const { id } = req.params;
  
  try {
    const pass = await Password.findById(id);
    if (!pass) return res.status(400).json({ message: "Password not found" });

    pass.deleted = false;
    pass.deletedAt = null;
    await pass.save();

        await AuditLog.create({
    user:req.user._id,
    action:"RESTORED_PASSWORD",
    resourceId:id
        });
    
    res.status(200).json({ message: "Password restored" });
  } catch (error) {
    console.log("Error restoring password", error);
    res.status(500).json({ message: "Server error" });
  }
};

export const getpass = async (req, res) => {
  const { groupId } = req.params;
  console.log("rew",req.User)
    console.log(groupId)
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 10;

    try {

        const passwords = await Password.find({
            createdby: req.User._id,
            group: groupId,
            deleted: false,
        })
        .skip((page - 1) * limit)
        .limit(limit);

        const total = await Password.countDocuments({
            createdby: req.User._id,
            group: groupId,
            deleted: false,
        });

        res.status(200).json({
            passwords,
            totalPages: Math.ceil(total / limit),
            currentPage: page,
        });

    } catch (error) {
        console.log(error);

        res.status(500).json({
            message: "Internal Server Error"
        });
    }
};

export const downloadpass = async (req, res) => {

  try {
     const { userId } = req.params
     const passwords = await fetchPasswords(userId);
     console.log(passwords)
    const doc = new PDFDocument();

    res.setHeader("Content-Type", "application/pdf");
    res.setHeader(
      "Content-Disposition",
      'attachment; filename="passwords.pdf"'
    );

    doc.pipe(res);

    doc.fontSize(20).text("Saved Passwords", {
      align: "center",
    });

    doc.moveDown();

    passwords.forEach((pass, index) => {
      doc.text(`${index + 1}. Name: ${pass.name}`);
      doc.text(`Password: ${pass.password}`);
      doc.text(`Description: ${pass.description}`);
      doc.moveDown();
    });

    doc.end();

        await AuditLog.create({
    user:req.user._id,
    action:"DOWNLOADED_PASSWORD",
    resourceId:id
    });
    
  }catch (error) {
    console.log("Error downloading password", error);
    res.status(500).json({ message: "Server error" });
  }
};

export const getSecurityAlerts = async (req, res) => {
  try {
    const THRESHOLD_DAYS = 90;
  
    const passwords = await Password.find({
      createdby: req.User._id,
      deleted: false,
    });

    // console.log(passwords)
    const today = new Date();

    const alerts = passwords
      .filter((password) => {
        const lastUpdated =
          password.passwordUpdatedAt || password.createdAt;

        const age =
          Math.floor(
            (today - new Date(lastUpdated)) /
            (1000 * 60 * 60 * 24)
          );

        return age >= THRESHOLD_DAYS;
      })
      .map((password) => ({
        _id: password._id,
        website: password.website,
        username: password.username,
        age:
          Math.floor(
            (today - new Date(password.passwordUpdatedAt || password.createdAt)) /
            (1000 * 60 * 60 * 24)
          ),
      }));

    console.log(alerts)
    return res.status(200).json(alerts);

  } catch (err) {
    console.log(err);
    return res.status(500).json({
      message: "Internal Server Error",
    });
  }
};