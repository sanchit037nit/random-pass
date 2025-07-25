import {generateToken} from "../lib/uteis.js"
import Password from "../models/pass.model.js"
import User from "../models/user.model.js"


export const createpass = async(req,res)=>{
      const {name,password,description,createdby}=req.body
    //   const {userid}=req.params

      try {
        if(!name || !password || !description){
            return res.status(400).json({message:"all fields required"})
        }
        // const user=await User.findById(userid)
        // if(!user){
        //     return res.status(400).json({message:"invalid user"})
        // }

        const newpass=new Password({
            name,
            password,
            description,
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
      const {data}=req.body
      const {passid}=req.params

      try {
           if(!passid){
            return res.status(400).json({
                message:"no todo selected"
            })
           }

        const newpass=await Password.findByIdAndUpdate(
            passid,
            data,
            {new:true}
        )

        return res.status(200).json({message:"password updated"})
      } catch (error) {
        console.log("error in updating password",error)
      }

}

export const deletepass = async(req,res)=>{
      const {passid}=req.params

      try {
           if(!passid){
            return res.status(400).json({
                message:"no todo selected"
            })
           }

        const delpass=await Password.findByIdAndDelete(passid)
        return res.status(200).json({message:"password updated"})

      } catch (error) {
        console.log("error in updating password",error)
      }

}

export const getpass= async(req,res)=>{
    const {userid}=req.params

   
    try {
        const user=await User.findOne(userid)
        if(!user){
         return res.status(400).json({message:"invalid user"})
        }

        const passwords=await Password.find({createdby:userid})

        if(!passwords){
              return res.status(200).json({message:"no passwords available"})
        }
        
        return res.status(200).json({passwords})

    } catch (error) {
        console.log("error in getting passwords",error)
    }
}

export const viewpass= async(req,res)=>{
    const {passid}=req.params
    try {
        const password=await Password.findById(passid)

        if(!password){
              return res.status(200).json({message:"click valid password"})
        }

        return res.status(200).json({password})

    } catch (error) {
        console.log("error in viewing password",error)
    }
}