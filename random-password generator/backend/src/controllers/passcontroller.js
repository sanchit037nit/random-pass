import {generateToken} from "../lib/uteis.js"
import Password from "../models/pass.model.js"
import User from "../models/user.model.js"


export const createpass = async(req,res)=>{
      const {name,password,description,createdby,group}=req.body

      try {
        if(!name || !password || !description){
            return res.status(400).json({message:"all fields required"})
        }

        const newpass=new Password({
            name,
            password,
            description,
            group,
            createdby
        })

        if(newpass){
            await newpass.save()
               res.status(201).json({
                _id:newpass._id,
                name:newpass.name,
                password:newpass.password,
            })
        }
        else { res.status(400).json({ message: "password cannot be created" });}

      } catch (error) {
        console.log("error in creating password",error)
      }

}

export const updatepass = async(req,res)=>{
      const {name,password,description,group}=req.body
      const {id}=req.params
   
      try {
           if(!id){
            return res.status(400).json({
                message:"no todo selected"
            })
           }

        const newpass=await Password.findByIdAndUpdate(
            id,
            { $set:{
                name:name,
                password:password,
                description: description,
                group:group
              }
            },
            {new:true}
        )

        return res.status(200).json({message:"password updated"})
      } catch (error) {
        console.log("error in updating password",error)
      }

}

export const deletepass = async (req, res) => {
  const { id } = req.params;
  try {
    const pass = await Password.findById(id);
    if (!pass) return res.status(400).json({ message: "Password not found" });

    pass.deleted = true; 
    pass.deletedAt= new Date()
    await pass.save();

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
    if (!pass) return res.status(400).json({ message: "Password not found" });

    const del = await Password.findByIdAndDelete(id);
    
    return res.status(200).json({ message: "Password deleted successfully" });
  } catch (error) {
    console.log("Error deleting password", error);
    res.status(500).json({ message: "Server error" });
  }
};

export const getpass= async(req,res)=>{
    const {userId}=req.params
   
    try {
        const user=await User.findById(userId)
        if(!user){
         return res.status(400).json({message:"invalid user"})
        }

        const passwords=await Password.find({createdby:userId,deleted:false,})

        if(!passwords){
              return res.status(200).json({message:"no passwords available"})
        }
        
        return res.status(200).json({passwords})

    } catch (error) {
        console.log("error in getting passwords",error)
    }
}

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

    const passwords = await Password.find({ createdby: userId });

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
  console.log(id)
  try {
    const pass = await Password.findById(id);
    if (!pass) return res.status(400).json({ message: "Password not found" });

    pass.deleted = false;
    pass.deletedAt = null;
    await pass.save();

    res.status(200).json({ message: "Password restored" });
  } catch (error) {
    console.log("Error restoring password", error);
    res.status(500).json({ message: "Server error" });
  }
};