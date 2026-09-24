import {create} from 'zustand';
import { axiosinstance } from '../lib/axios.js';
import { toast } from 'react-hot-toast';    
import { deriveKey, hashPasswordForBackend } from '../lib/crypto.js';


export const useAuthStore = create((set,get) => ({


  authUser:null,
  masterKey: null, // Store the derived encryption key in memory

  signup: async(data) => {

    try{
        // Zero-Knowledge Architecture setup
        const masterKey = await deriveKey(data.password, data.emailid);
        const hashedPassword = await hashPasswordForBackend(data.password);
        
        const payload = { ...data, password: hashedPassword };

        const res=await axiosinstance.post("/auth/signup",payload)
        console.log(res)
        set({authUser:res.data, masterKey})
        toast.success("signed up successfully")
    }
    catch(error){
        toast.error(error.response?.data?.message || "Signup failed")
    }

  },

  login: async(data)=>{
    try{
        // Zero-Knowledge Architecture setup
        const masterKey = await deriveKey(data.password, data.emailid);
        const hashedPassword = await hashPasswordForBackend(data.password);
        
        const payload = { ...data, password: hashedPassword };

        const res=await axiosinstance.post("/auth/login",payload)
        set({authUser:res.data, masterKey})

        toast.success("logged in successfully")
    }
    catch(error){
        toast.error(error.response?.data?.message || "Login failed")
    }
  },

  logout: async() =>{
      try{
         await axiosinstance.post("/auth/logout")
         set({authUser:null, masterKey: null})
         toast.success("logged out successfully")
      }
      catch(error){
        toast.error(error.response?.data?.message || "Logout failed")
      }
  },

  checkauth: async() =>{
      try{
         const res=await axiosinstance.get("/auth/check")
         set({authUser:res.data})

      }
      catch(error){
        set({authUser:null, masterKey: null})
      }
  },

  deleteaccount: async() =>{
      try{
       const {authUser} = get()
        console.log(authUser)
         await axiosinstance.delete(`/auth/deleteaccount/${authUser._id}`)
         set({authUser:null, masterKey: null})

         toast.success("Account deleted successfully")
      }
      catch(error){
        toast.error(error.response?.data?.message || "Failed to delete account")
      }
  }

}));

