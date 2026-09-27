import { generateToken } from "../lib/uteis.js";
import Groq from "groq-sdk";
import Password from "../models/pass.model.js";
import { encryptText, decryptText } from "../lib/encryption.js";
import User from "../models/user.model.js";
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
    const { name, password, description, createdby, group, plainName, plainDescription } = req.body;

    if (!name || !password || !description) {
      return res.status(400).json({
        message: "All fields are required",
      });
    }

    let groupId = group;

    // AI AUTO-CATEGORIZATION logic if no group is provided
    if (!groupId && process.env.GROQ_API_KEY) {
      try {
        
        // Fetch user's existing groups
        const userGroups = await Group.find({ user: req.User._id });
        const existingGroupNames = userGroups.map(g => g.name);
        
        const prompt = `You are a smart password categorizer.
The user is saving a password with:
Name: "${plainName || name}"
Description: "${plainDescription || description}"

Their existing groups are: [${existingGroupNames.join(", ")}].
Based on the Name and Description, decide which existing group this belongs to. 
If none fit well, invent ONE short, logical new group name (e.g., "Finance", "Social", "Work", "Dev").
Reply with ONLY the exact group name. Nothing else, no quotes.`;

        const chatResponse = await fetch("https://api.groq.com/openai/v1/chat/completions", {
          method: "POST",
          headers: {
            "Authorization": `Bearer ${process.env.GROQ_API_KEY}`,
            "Content-Type": "application/json"
          },
          body: JSON.stringify({
            model: "openai/gpt-oss-120b", 
            messages: [{ role: "user", content: prompt }],
            temperature: 0.1,
            max_tokens: 1000
          })
        });
        
        const chatCompletion = await chatResponse.json();
        const suggestedGroup = chatCompletion.choices?.[0]?.message?.content?.trim();
        
        if (suggestedGroup) {
          // See if it exists
          let matchedGroup = await Group.findOne({
            user: req.User._id,
            name: { $regex: new RegExp(`^${suggestedGroup}$`, "i") }
          });
          
          if (!matchedGroup) {
            // Create the new group
            matchedGroup = await Group.create({
              user: req.User._id,
              name: suggestedGroup,
            });
          }
          groupId = matchedGroup._id;
        }
      } catch (aiError) {
        console.error("Groq AI categorization failed, falling back to General:", aiError);
      }
    }

    // Fallback if AI fails or no GROQ_API_KEY
    if (!groupId) {
      let generalGroup = await Group.findOne({
        user: req.User._id,
        name: "General",
      });

      if (!generalGroup) {
        generalGroup = await Group.create({
          user: req.User._id,
          name: "General",
        });
      }

      groupId = generalGroup._id;
    }

    // Check that the selected group belongs to the logged-in user
    const groupExists = await Group.findOne({
      _id: groupId,
      user: req.User._id,
    });

    if (!groupExists) {
      return res.status(404).json({
        message: "Invalid group",
      });
    }

    const newpass = await Password.create({
      name,
      password,
      description,
      group: groupId,
      createdby,
    });

    await AuditLog.create({
      user: req.User._id,
      action: "CREATE_PASSWORD",
      resourceId: newpass._id,
    });

    return res.status(201).json({
      _id: newpass._id,
      name: newpass.name,
      password: newpass.password,
      description: newpass.description,
      group: newpass.group,
      createdby: newpass.createdby,
    });
  } catch (error) {
    console.error("Error creating password:", error);

    return res.status(500).json({
      message: "Internal Server Error",
    });
  }
};

export const updatepass = async (req, res) => {
  const { name, password, description, group } = req.body;
  const { id } = req.params;

  try {
    if (!id) {
      return res.status(400).json({
        message: "No password selected",
      });
    }

    // Verify group belongs to the logged-in user
    if (group) {
      const exists = await Group.findOne({
        _id: group,
        createdBy: req.User._id,
      });

      if (!exists) {
        return res.status(404).json({
          message: "Invalid group",
        });
      }
    }

    // Verify password belongs to the logged-in user
    const existingPassword = await Password.findOne({
      _id: id,
      createdby: req.User._id,
    });

    if (!existingPassword) {
      return res.status(404).json({
        message: "Password not found",
      });
    }

    const updateData = {
      name,
      description,
      group,
      passwordUpdatedAt: new Date(),
    };
    if (password) {
      updateData.password = password;
    }

    const updatedPassword = await Password.findByIdAndUpdate(
      id,
      { $set: updateData },
      { new: true },
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
      message: "Internal Server Error",
    });
  }
};

export const deletepass = async (req, res) => {
  const { id } = req.params;
  try {
    const pass = await Password.findById(id);
    if (!pass) return res.status(400).json({ message: "Password not found" });

    pass.deleted = true;
    pass.deletedAt = new Date();
    await pass.save();

    await AuditLog.create({
      user: id,
      action: "PASSWORD DELETED SUCCESSFULLY",
      resourceId: id,
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
    console.log(pass);
    if (!pass) return res.status(400).json({ message: "Password not found" });

    const del = await Password.findByIdAndDelete(id);

    return res.status(200).json({ message: "Password deleted successfully" });
  } catch (error) {
    console.log("Error deleting password", error);
    res.status(500).json({ message: "Server error" });
  }
};

export const viewpass = async (req, res) => {
  const { id } = req.params;
  try {
    const pass = await Password.findById(id);

    if (!pass) {
      return res.status(400).json({ message: "click valid password" });
    }

    const decryptedPass = {
      ...pass.toObject(),
      password: decryptText(pass.password)
    };

    return res.status(200).json({ password: decryptedPass });
  } catch (error) {
    console.log("error in viewing password", error);
  }
};

export const Dashpage = async (req, res) => {
  const { userId } = req.params;
  // console.log(userId)
  try {
    if (!userId) return res.status(400).json({ message: "user id required" });

    const user = await User.findById(userId);
    if (!user) return res.status(400).json({ message: "invalid user" });

    const passwords = await Password.find({
      createdby: userId,
      deleted: false,
    }).populate("group", "name");

    // Count passwords per group
    const groupCounts = passwords.reduce((acc, pass) => {
      const groupId = pass.group?._id?.toString() || "general";
      const groupName = pass.group?.name || "General";

      if (!acc[groupId]) {
        acc[groupId] = {
          name: groupName,
          count: 0,
        };
      }

      acc[groupId].count += 1;

      return acc;
    }, {});

    // Recent passwords (last 5)
    const recentPasswords = passwords
      .sort((a, b) => b.createdAt - a.createdAt)
      .slice(0, 5)
      .map(p => {
        const pObj = p.toObject();
        pObj.password = decryptText(pObj.password);
        return pObj;
      });

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
  // console.log(id)
  try {
    const pass = await Password.findById(id);

    if (!pass) return res.status(400).json({ message: "Password not found" });

    pass.deleted = false;
    pass.deletedAt = null;
    await pass.save();

    // await AuditLog.create({
    //   user: req.user._id,
    //   action: "RESTORED_PASSWORD",
    //   resourceId: id,
    // });

    res.status(200).json({ message: "Password restored" });
  } catch (error) {
    console.log("Error restoring password", error);
    res.status(500).json({ message: "Server error" });
  }
};

export const getpass = async (req, res) => {
  const { groupId } = req.params;
  console.log("rew", req.User);
  console.log(groupId);
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

    const decryptedPasswords = passwords.map(p => {
      const pObj = p.toObject();
      pObj.password = decryptText(pObj.password);
      return pObj;
    });

    const total = await Password.countDocuments({
      createdby: req.User._id,
      group: groupId,
      deleted: false,
    });

    res.status(200).json({
      passwords: decryptedPasswords,
      totalPages: Math.ceil(total / limit),
      currentPage: page,
    });
  } catch (error) {
    console.log(error);

    res.status(500).json({
      message: "Internal Server Error",
    });
  }
};

export const downloadpass = async (req, res) => {
  try {
    const { userId } = req.params;
    const passwords = await fetchPasswords(userId);
    console.log(passwords);
    const doc = new PDFDocument();

    res.setHeader("Content-Type", "application/pdf");
    res.setHeader(
      "Content-Disposition",
      'attachment; filename="passwords.pdf"',
    );

    doc.pipe(res);

    doc.fontSize(20).text("Saved Passwords", {
      align: "center",
    });

    doc.moveDown();

    passwords.forEach((pass, index) => {
      doc.text(`${index + 1}. Name: ${pass.name}`);
      doc.text(`Password: ${decryptText(pass.password)}`);
      doc.text(`Description: ${pass.description}`);
      doc.moveDown();
    });

    doc.end();

    await AuditLog.create({
      user: req.User._id,
      action: "DOWNLOADED_PASSWORD",
      resourceId: userId,
    });
  } catch (error) {
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
        const lastUpdated = password.passwordUpdatedAt || password.createdAt;

        const age = Math.floor(
          (today - new Date(lastUpdated)) / (1000 * 60 * 60 * 24),
        );

        return age >= THRESHOLD_DAYS;
      })
      .map((password) => ({
        _id: password._id,
        website: password.website,
        username: password.username,
        age: Math.floor(
          (today - new Date(password.passwordUpdatedAt || password.createdAt)) /
            (1000 * 60 * 60 * 24),
        ),
      }));

    console.log(alerts);
    return res.status(200).json(alerts);
  } catch (err) {
    console.log(err);
    return res.status(500).json({
      message: "Internal Server Error",
    });
  }
};

export const generateRoast = async (req, res) => {
  const { score } = req.body; 
  
  if (score === undefined) {
    return res.status(400).json({ message: "Score is required" });
  }

  try {
    if (!process.env.GROQ_API_KEY) {
      return res.status(200).json({ roast: "Add your OpenRouter key to .env to unlock AI roasts!", emoji: "🤖" });
    }
    
    let instructions = "";
    if (score === 0) instructions = "The password is weak like '123456'. Roast them brutally.";
    else if (score === 1) instructions = "The password is weak. Sarcastic roast.";
    else if (score === 2) instructions = "The password is okay, but mediocre. Backhanded compliment.";
    else if (score === 3) instructions = "The password is strong. Reluctant praise.";
    else if (score === 4) instructions = "The password is very strong. Act intimidated.";

    const prompt = `You are a sarcastic AI password meter.
${instructions}
Return ONLY a valid JSON object with EXACTLY two string fields: "roast" (a short 1-sentence funny comment) and "emoji" (a single relevant emoji). Do not wrap in markdown tags like \`\`\`json.`;

    const chatResponse = await fetch("https://api.groq.com/openai/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${process.env.GROQ_API_KEY}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        model: "openai/gpt-oss-120b", 
        messages: [{ role: "user", content: prompt }],
        temperature: 0.8,
        max_tokens: 1000
      })
    });
    
    const chatCompletion = await chatResponse.json();
    const content = chatCompletion.choices?.[0]?.message?.content?.trim() || '{"roast": "AI took a nap.", "emoji": "😴"}';
    const result = JSON.parse(content.replace(/```json/g, "").replace(/```/g, ""));
    return res.status(200).json(result);
  } catch (error) {
    console.error("Roast generation failed:", error);
    return res.status(500).json({ roast: "AI is speechless...", emoji: "🤖" });
  }
};
