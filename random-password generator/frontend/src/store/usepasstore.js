import {create} from 'zustand';
import { axiosinstance } from '../lib/axios.js';
import { toast } from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';
  

export const usePasStore = create((set,get) => ({

    
   passes: [],
//    selecteduser:null,

    // setselecteduser:(selecteduser) =>set({selecteduser}),

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

    updatepass: async(data) =>{
        try{
            await axiosinstance.patch(`/pass/update/${data.id}`,data)
            
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

    viewpass: async(id) =>{
        try{
            const navigate = useNavigate();
            const res = await axiosinstance.get(`/pass/view/${id}`)
            // if(res){
            // navigate('/view');
            // }
            // console.log(res)
            toast.success("password retrieved successfully")
        }
        catch(error){
            toast.error(error.response.data.message)
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