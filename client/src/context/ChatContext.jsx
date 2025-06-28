import { createContext, useState, useEffect, useContext } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { io } from "socket.io-client";
import { useAuthContext } from "./AuthContext";

const ChatContext = createContext();

export function useChatContext() {
  return useContext(ChatContext);
}

export const ChatProvider = ({ children }) => {
  const [messages, setMessages] = useState([]);
  const [usersForSlidebar, setUsersForSlidebar] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [unseenMessage, setUnseenMessages] = useState({});

  const { axios, socket } = useAuthContext();

  const getUsers = async () => {
    try {
      const { data } = await axios.get("/api/message/users");
      if (data.success) {
        setUsersForSlidebar(data.users);
        setUnseenMessages(data.unseen);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const getMessage = async (userId) => {
    try {
      const { data } = await axios.get(`/api/message/${userId}`);
      if (data.success) {
        setMessages(data.messages);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const sendMessage = async (messageData) => {
    try {
      const { data } = await axios.post(
        `/api/message/send/${selectedUser._id}`,
        messageData
      );
      if (data.success) {
        setMessages((prev) => [...prev, data.message]);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const subscribeToUser = async () => {
    if (!socket) return;

    socket.on("newMessage", async(newMessage) => {
      if (selectedUser && newMessage.senderId === selectedUser._id) {
        newMessage.seen = true;
        setMessages((prev) => [...prev, newMessage]);
        await axios.put(`/api/message/mark/${newMessage._id}`);
      } else {
        setUnseenMessages((prevUnseenMessages) => ({
          ...prevUnseenMessages,
          [newMessage.senderId]: prevUnseenMessages[newMessage.senderId]
            ? prevUnseenMessages[newMessage.senderId] + 1
            : 1,
        }));
      }
    });
  };

  const unsubscribeToUser = () => {
    if (socket) socket.off("newMessage");
  };

  useEffect(() => {
    subscribeToUser();

    return () => unsubscribeToUser();
  }, [socket, selectedUser]);

  const value = {
    messages,
    usersForSlidebar,
    selectedUser,
    getUsers,
    getMessage,
    sendMessage,
    setSelectedUser,
    setUnseenMessages,
    unseenMessage,
  };

  return <ChatContext.Provider value={value}>{children}</ChatContext.Provider>;
};
