
export const Firstpage =() =>{
    

    return (
  <div>
    <div className="flex justify-center items-center bg-gray-800 p-6 text-amber-100">
    <h1 className="text-3xl font-bold mb-6">Welcome to Random Password Generator</h1>
    </div>
    <div className="flex flex-col justify-center items-center h-screen bg-gray-900 text-white">
    <p className="mb-2 text-lg">Don't have an account?</p>
    <button
      className="border-2 border-gray-500 rounded-md px-6 py-2 bg-blue-500 hover:bg-blue-600 transition duration-300 mb-4"
      onClick={() => window.location.href = "/signup"}
    >
      Signup
    </button>

    <p className="mb-2 text-lg">Already have an account?</p>
    <button
      className="border-2 border-gray-500 rounded-md px-6 py-2 bg-green-500 hover:bg-green-600 transition duration-300"
      onClick={() => window.location.href = "/login"}
    >
      Login
    </button>
    </div>
  </div>
);

}