import {create} from 'zustand';
import { axiosinstance } from '../lib/axios.js';
import { toast } from 'react-hot-toast';

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
            await axiosinstance.delete(`/pass/delete/${id}`)
            toast.success("password deleted successfully")
        }
        catch(error){
            toast.error(error.response.data.message)
        }
    },

    viewpass: async(id) =>{
        try{
            const res = await axiosinstance.get(`/pass/view/${id}`)
            toast.success("password retrieved successfully")
        }
        catch(error){
            toast.error(error.response.data.message)
        }
    },

    getpass: async(id) =>{
        try{
            const res = await axiosinstance.get(`/pass/${id}`)
            // console.log(res.data.userpasses)
            set({ passes: res.data.userpasses })
            toast.success("password retrieved successfully")
        }
        catch(error){
            toast.error(error.response.data.message)
        }
    }
}))