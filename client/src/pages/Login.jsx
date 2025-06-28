import React from "react";
import assets from "../assets/assets";
import { useAuthContext } from "../context/AuthContext";
import toast from "react-hot-toast";

const Login = () => {
  const { axios, setUserData, navigate, isSetUser, connectSocket } =
    useAuthContext();

  const [state, setState] = React.useState("login");
  const [name, setName] = React.useState("");
  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");

  const handleSubmit = async (e) => {
    console.log("clicked");
    try {
      e.preventDefault();
      const { data } = await axios.post(`/api/user/${state}`, {
        name,
        email,
        password,
      });
      console.log(data);
      if (data.success) {
        navigate("/");
        toast.success(data.message);
        setUserData(data.user);
        connectSocket(data.user);
        if (state == "login") {
          isSetUser(true);
        }
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  return (
    <div className="w-full h-screen flex items-center justify-between backdrop-blur-2xl text-white">
      <div className="flex justify-start items-center w-1/2 h-full pl-12 ">
        <img src={assets.logo_big} className="w-full h-1/3" alt="" />
      </div>
      <div className="flex justify-end items-center w-1/2 h-full pr-12">
        <form
          onSubmit={handleSubmit}
          className="flex flex-col gap-4 m-auto items-start p-8 py-12 w-80 sm:w-[352px] rounded-lg shadow-xl border border-gray-200 bg-[#2B2C69]"
        >
          <p className="text-2xl font-medium text-white m-auto">
            {state === "login" ? "Login" : "Sign Up"}
          </p>
          {state === "register" && (
            <div className="w-full">
              <p>Name</p>
              <input
                onChange={(e) => setName(e.target.value)}
                value={name}
                placeholder="type here"
                className="border border-gray-200 rounded w-full p-2 mt-1 outline-[#936EFF]"
                type="text"
                required
              />
            </div>
          )}
          <div className="w-full ">
            <p>Email</p>
            <input
              onChange={(e) => setEmail(e.target.value)}
              value={email}
              placeholder="type here"
              className="border border-gray-200 rounded w-full p-2 mt-1 outline-[#936EFF]"
              type="email"
              required
            />
          </div>
          <div className="w-full ">
            <p>Password</p>
            <input
              onChange={(e) => setPassword(e.target.value)}
              value={password}
              placeholder="type here"
              className="border border-gray-200 rounded w-full p-2 mt-1 outline-[#936EFF]"
              type="password"
              required
            />
          </div>
          {state === "register" ? (
            <p>
              Already have account?{" "}
              <span
                onClick={() => setState("login")}
                className="text-[#936EFF] cursor-pointer"
              >
                click here
              </span>
            </p>
          ) : (
            <p>
              Create an account?{" "}
              <span
                onClick={() => setState("register")}
                className="text-indigo-500 cursor-pointer"
              >
                click here
              </span>
            </p>
          )}
          <button
            type="submit"
            className="bg-[#9878f8] hover:bg-[#936EFF] transition-all text-white w-full py-2 rounded-md cursor-pointer"
          >
            {state === "register" ? "Create Account" : "Login"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;
