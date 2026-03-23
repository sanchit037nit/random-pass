import mongoose from "mongoose"

const passchema=new mongoose.Schema({
    name:{
        type:String,
        required:true,
        
    },
    password:{
        type:String,
        required:true,
        unique: true,
    },
    description:{
        type:String,
        required:true,
        unique: true,
    },

    group: {
    type: String,
    default: "General"
    },
    
    createdby:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User",
        required: true,
    },
    deleted: { type: Boolean, default: false },
},
{timestamps:true})

const pass=mongoose.model("Password",passchema)
export default pass