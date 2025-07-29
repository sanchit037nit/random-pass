export const Firstpage = () => {
  return (
    <div className="min-h-screen font-sans bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white tracking-wide">
      {/* Header */}
      <div className="flex justify-center items-center bg-gray-800 py-8 px-6">
        <h1 className="text-4xl md:text-5xl font-extrabold text-amber-400 drop-shadow-lg">
          Welcome to Random Password Generator
        </h1>
      </div>

      {/* Signup/Login Section */}
      <div className="flex flex-col justify-center items-center py-20 space-y-6">
        <div className="text-center space-y-3">
          <p className="text-lg md:text-xl text-gray-300 font-medium">Don't have an account?</p>
          <button
            className="bg-blue-500 hover:bg-blue-600 text-white font-semibold px-6 py-3 rounded-md shadow-md transition-transform duration-300 hover:scale-105 border border-blue-300"
            onClick={() => window.location.href = "/signup"}
          >
            Sign Up
          </button>
        </div>

        <div className="text-center space-y-3">
          <p className="text-lg md:text-xl text-gray-300 font-medium">Already have an account?</p>
          <button
            className="bg-green-500 hover:bg-green-600 text-white font-semibold px-6 py-3 rounded-md shadow-md transition-transform duration-300 hover:scale-105 border border-green-300"
            onClick={() => window.location.href = "/login"}
          >
            Log In
          </button>
        </div>
      </div>
    </div>
  );
};