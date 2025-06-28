import { createContext, useState, useEffect, useContext } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { io } from "socket.io-client";

const backendUrl = import.meta.env.VITE_BACKEND_URL;
axios.defaults.baseURL = backendUrl;
axios.defaults.withCredentials = true;

const AuthContext = createContext();

export function useAuthContext() {
  return useContext(AuthContext);
}

export const AuthProvider = ({ children }) => {
  const navigate = useNavigate();
  const [userData, setUserData] = useState(null);
  const [isUser, isSetUser] = useState(null);
  const [onlineUsers, setOnlineUsers] = useState([]);
  const [socket, setSocket] = useState(null);

  const connectSocket = (userDatas) => {
    const newSocket = io(backendUrl, {
      query: {
        userId: userDatas._id,
      },
    });
    newSocket.connect();
    setSocket(newSocket);

    newSocket.on("getOnlineUsers", (userIds) => {
      setOnlineUsers(userIds);
    });
  };

  const isUserAuthenticated = async () => {
    try {
      const { data } = await axios.get("/api/user/is-auth");
      console.log(data);
      if (data.success) {
        isSetUser(true);
        navigate("/");
      }
    } catch (error) {
      console.log(error.message);
    }
  };

  const toGetUserDetails = async () => {
    try {
      const { data } = await axios.get("/api/user/get-data");
      console.log(data);
      if (data.success) {
        isSetUser(true);
        setUserData(data.user);
        connectSocket(data.user);
      }
    } catch (error) {
      console.log(error.message);
    }
  };

  const updateProfile = async (body) => {
    try {
      const { data } = await axios.put("/api/user/update", body);
      console.log(data);
      if (data.success) {
        toast.success(data.message);
        setUserData(data.user);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const onlogoutHandler = async () => {
    try {
      const { data } = await axios.get("/api/user/logout");
      console.log(data);
      if (data.success) {
        isSetUser(false);
        setUserData(null);
        navigate("/login");
        socket.disconnect();
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  useEffect(() => {
    toGetUserDetails();
    isUserAuthenticated();
  }, []);

  const value = {
    axios,
    connectSocket,
    navigate,
    userData,
    setUserData,
    isUser,
    isSetUser,
    onlineUsers,
    setOnlineUsers,
    socket,
    setSocket,
    onlogoutHandler,
    updateProfile,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
