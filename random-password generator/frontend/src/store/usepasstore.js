import {create} from 'zustand';
import { axiosinstance } from '../lib/axios.js';
import { toast } from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';
  

export const usePasStore = create((set,get) => ({
    
   passes: [],
   selectedpass: null,

    createpass: async(data) =>{
        try{
            const {passes} = get();
            console.log(passes)
            const newpass=await axiosinstance.post("/pass/create",data)
            set({passes:[...passes,newpass.data]})
            toast.success("password created successfully")
        }
        catch(error){
            toast.error(error.response.data.message)
        }
    },

    updatepass: async(data,id) =>{
        // const {id}=req.params
        // console.log(id)
        try{
            await axiosinstance.patch(`/pass/update/${id}`,data)
            
            toast.success("password updated successfully")
        }
        catch(error){
            toast.error(error.response.data.message)
        }
    },

    deletepass: async(id) =>{
        try{
            const {passes} = get();
            await axiosinstance.delete(`/pass/delete/${id}`)
            const npas=passes.filter((pass) => pass._id !== id)
            set({ passes: npas })
            toast.success("password deleted successfully")
        }
        catch(error){
            toast.error(error.response.data.message)
        }
    },

    viewpass: async(id,navigate) =>{
        try{
          
            const res = await axiosinstance.get(`/pass/view/${id}`)
            set({selectedpass:res.data})
            navigate('/view');
            toast.success("password retrieved successfully")
        }
        catch(error){
            console.log(error)
            toast.error("error occurred")
        }
    },

    getpass: async(id) =>{
        try{
            const res = await axiosinstance.get(`/pass/get/${id}`)
            // console.log(res.data.passwords)
            set({ passes: res.data.passwords })
            toast.success("password retrieved successfully")
        }
        catch(error){
            toast.error(error.response.data.message)
        }
    }
}))

    // Uncomment if you want to manage selected user state
    // selecteduser: null,
//    selecteduser:null,

    // setselecteduser:(selecteduser) =>set({selecteduser}),