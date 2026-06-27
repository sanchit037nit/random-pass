import {create} from 'zustand';
import { axiosinstance } from '../lib/axios.js';
import { toast } from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';
  

export const usePasStore = create((set,get) => ({
    
   passes: [],
   selectedpass: null,
   createdpass:null,
   generatedPassword: '',
    setGeneratedPassword: (pwd) => set({ generatedPassword: pwd }),
  totalPages: 1,


    createpass: async(data) =>{
        try{
            const {passes} = get();
            // console.log(passes)
            const newpass=await axiosinstance.post("/pass/create",data)
            set({passes:[...passes,newpass.data]})
            toast.success("password created successfully")
        }
        catch(error){
            toast.error(error.response.data.message)
        }
    },

    updatepass: async(data,id) =>{
       
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
            toast.success("password moved to recycle bin!")
        }
        catch(error){
            toast.error(error.response.data.message)
        }
    },

    viewpass: async(id,navigate) =>{
        try{
          
            const res = await axiosinstance.get(`/pass/view/${id}`)
            console.log(res)
            set({selectedpass:res.data})
            navigate('/view');
            // toast.success("password retrieved successfully")
        }
        catch(error){
            console.log(error)
            toast.error("error occurred")
        }
    },

    getpass: async (userId, page = 1) => {
        const res = await axiosinstance.get(
            `/pass/get/${userId}?page=${page}&limit=10`
        );

        set({
            passes: res.data.passwords,
            totalPages: res.data.totalPages,
        });
    },

    downloadpass: async (id) => {
        try {
    const response = await axiosinstance.get(
      `/pass/download/${id}`,
      {
        responseType: "blob",
      }
    );

    const blob = new Blob([response.data], {
      type: "application/pdf",
    });

    const url = window.URL.createObjectURL(blob);

    const link = document.createElement("a");
    link.href = url;
    link.download = "passwords.pdf";

    document.body.appendChild(link);
    link.click();

    link.remove();
    window.URL.revokeObjectURL(url);
  } catch (error) {
    console.error(error);
  }
    },
}))