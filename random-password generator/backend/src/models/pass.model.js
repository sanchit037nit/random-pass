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
    deletedAt: {
        type: Date,
        default: null,
    },
},
{timestamps:true})

passchema.index({ createdby: 1 });

passchema.index({
  createdby: 1,
  deleted: 1,
});

passchema.index({
  createdby: 1,
  createdAt: -1,
});

const pass=mongoose.model("Password",passchema)
export default pass