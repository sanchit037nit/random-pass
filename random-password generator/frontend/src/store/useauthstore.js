import {create} from 'zustand';
import { axiosinstance } from '../lib/axios.js';
import { toast } from 'react-hot-toast';    



export const useAuthStore = create((set) => ({
  authUser:null,

  signup: async(data) => {

    // try{
    //     const res=await axiosinstance.post("/auth/signup",data)
    //     console.log(res)
    //     set({authUser:res.data})
    //     toast.success("signed up successfully")
    // }
    // catch(error){
    //     toast.error(error.response.data.message)
    // }
    
    try {
        const res = await axiosinstance.post("/auth/signup", data);

        console.log("RESPONSE RECEIVED:", res);
        console.log("STATUS:", res.status);

        // Force success only on 201
        if (res.status === 201) {
            set({ authUser: res.data });
            toast.success("Signed up successfully");
        } else {
            console.log("UNEXPECTED STATUS:", res.status);
            toast.error("Unexpected status received: " + res.status);
        }
    } catch (error) {
        console.log("CAUGHT IN CATCH 🔥:", error);
        console.log("Error response:", error?.response);
        const message = error?.response?.data?.message || "Signup failed";
        toast.error(message);
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

