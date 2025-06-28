import React, { useEffect, useState } from "react";
import ChatContainer from "../components/ChatContainer";
import RightSlidebar from "../components/RightSlidebar";
import Slidebar from "../components/Slidebar";
import { useAuthContext } from "../context/AuthContext";
import { useNavigation } from "react-router-dom";
import { useChatContext } from "../context/ChatContext";

const Home = () => {
  const { isUser, navigate } = useAuthContext();

  const { selectedUser, setSelectedUser } = useChatContext();

  return (
    isUser && (
      <div className="border text-white w-full h-screen sm:px-[15%] sm:py-[5%]">
        <div
          className={`  ${
            selectedUser
              ? "md:grid-cols-[1fr_1.5fr_1fr] xl:grid-cols-[1fr_2fr_1fr]"
              : "md:grid-cols-2"
          } backdrop-blur-xl border-2 border-gray-600 rounded-2xl overflow-hidden h-[100%] grid grid-cols-1`}
        >
          <Slidebar />
          <ChatContainer />
          <RightSlidebar />
        </div>
      </div>
    )
  );
};

export default Home;
