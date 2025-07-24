import {create} from 'zustand';
import { axiosinstance } from '../lib/axios.js';
import { toast } from 'react-hot-toast';    



export const useAuthStore = create((set) => ({
  authUser:null,

  signup: async(data) => {

    try{
       toast.success("successfully")
        const res=await axiosinstance.post("/auth/signup",data)

        set({authUser:res.data})

        toast.success("signed up successfully")
    }
    catch(error){
        toast.error(error.response.data.message)
    }
  },

  login: async(data)=>{
    try{
        const res=await axiosinstance.post("/auth/login",data)
        set({authUser:res.data})

        toast.success("logged in successfully")
    }
    catch(error){
        toast.error(error.response.data.message)
    }
  },

  logout: async() =>{
      try{
         await axiosinstance.post("/auth/logout")
         set({authUser:null})
         toast.success("logged out successfully")
      }
      catch(error){
        toast.error(error.response.data.message)
      }
  },

  checkauth: async() =>{
      try{
         const res=await axiosinstance.get("/auth/check")
         set({authUser:res.data})
        //  toast.success("checked successfully")
      }
      catch(error){
        toast.error(error.message)
        set({authUser:null})
      }
  }

}));

