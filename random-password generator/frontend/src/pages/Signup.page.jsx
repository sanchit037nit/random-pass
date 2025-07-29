import { useState } from "react";
import {useAuthStore} from "../store/useauthstore.js";
import { toast } from "react-hot-toast";


export const Signuppage = () => {

    const {signup} =useAuthStore()
    const [formdata,setformdata]=useState({
        name:"",
        emailid:"",
        password:"",
    })

    const validateformdata=()=>{
        if(!formdata.name || !formdata.emailid ||  !formdata.password){
            return toast.error("all fields required")
        }
        if(formdata.pass.length< 6){
            return toast.error("password length should be atleast 6")
        }
        if(!/\S+@\S+\.\S+/.test(formdata.email)){
            return toast.error("invalid email")
        }
    }

    const handleclick = async(e)=>{
        e.preventDefault()

        // const success=validateformdata()

        // if(success) {await }
         await signup(formdata)
            // return toast.success("signed up successfully")
    }

    return (
        // <form onSubmit={handleclick} className="space-y-7 text-white">
        //     <div className=" m-3 flex flex-col justify-evenly items-center h-100" >
        //     <div className="flex  space-y-2 w-fit m-5 justify-center items-center">
        //         <span>enter yor name
        //         <input 
        //         type="text"
        //         className={`input input-bordered w-full pl-10`}
        //         placeholder="enter your name"
        //         value={formdata.name}
        //         onChange={(e)=>setformdata({...formdata,name:e.target.value})}
        //          />
        //         </span>
           
        //     </div>
        //     <div className="flex  space-y-2 w-fit m-5 justify-center items-center">
        //         <span>enter yor email
        //         <input 
        //         type="email"
        //         className={`input input-bordered w-full pl-10`}
        //         placeholder="enter your email"
        //         value={formdata.email}
        //         onChange={(e)=>setformdata({...formdata,email:e.target.value})}
        //          />
        //         </span>
           
        //     </div>
        //     <div className="flex  space-y-2 w-fit m-5 justify-center items-center">
        //         <span>enter yor password
        //         <input 
        //         type="password"
        //         className={`input input-bordered w-full pl-10`}
        //         placeholder="enter your password"
        //         value={formdata.pass}
        //         onChange={(e)=>setformdata({...formdata,pass:e.target.value})}
        //          />
        //         </span>
           
        //     </div>
        //                <button type="submit" className="btn btn-primary text-white">Submit</button>
        //     </div>
 

        // </form>
  <div className="flex justify-center items-center min-h-screen bg-gray-900 p-4">
        <form 
  onSubmit={handleclick} 
  className="w-full max-w-md mx-auto bg-gray-800 p-8 rounded-lg shadow-lg text-white space-y-6"
>
  <h2 className="text-center text-2xl font-bold mb-4">Signup Form</h2>

  {/* Name Input */}
  <div className=" text-amber-50 flex flex-col space-y-2">
    <label htmlFor="name" className="text-lg">Enter Your Name</label>
    <input
      type="text"
      id="name"
      className="border border-gray-400 rounded-md px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
      placeholder="Enter your name"
      value={formdata.name}
      onChange={(e) => setformdata({ ...formdata, name: e.target.value })}
      required
    />
  </div>

  {/* Email Input */}
  <div className="flex flex-col space-y-2">
    <label htmlFor="email" className="text-lg">Enter Your Email</label>
    <input
      type="email"
      id="email"
      className="border border-gray-400 rounded-md px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
      placeholder="Enter your email"
      value={formdata.emailid}
      onChange={(e) => setformdata({ ...formdata, emailid: e.target.value })}
      required
    />
  </div>

  {/* Password Input */}
  <div className="flex flex-col space-y-2">
    <label htmlFor="password" className="text-lg">Enter Your Password</label>
    <input
      type="password"
      id="password"
      className="border border-gray-400 rounded-md px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
      placeholder="Enter your password"
      value={formdata.password}
      onChange={(e) => setformdata({ ...formdata, password: e.target.value })}
      required
    />
  </div>

   {/* Submit Button */}
  <button
    type="submit"
    className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-md transition duration-300"
  >
    Submit
  </button>
 </form>
</div>
    );
}
