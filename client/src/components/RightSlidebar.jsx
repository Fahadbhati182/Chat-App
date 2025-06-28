import React, { useEffect, useState } from "react";
import assets, { imagesDummyData } from "../assets/assets";
import { useChatContext } from "../context/ChatContext";
import { useAuthContext } from "../context/AuthContext";

const RightSlidebar = () => {
  const { selectedUser, messages } = useChatContext();
  const { onlogoutHandler, onlineUsers } = useAuthContext();

  const [msgImages, setMsgImage] = useState([]);

  useEffect(() => {
    setMsgImage(
      messages.filter((message) => message.image).map((msg) => msg.image)
    );
  }, [selectedUser,messages,onlineUsers]);

  return (
    selectedUser && (
      <div
        className={`bg-[#8185B2]/10 text-white w-full relative overflow-y-scroll ${
          selectedUser ? "max-md:hidden" : ""
        }`}
      >
        <div className="pt-16 flex flex-col items-center gap-2 text-xs font-light mx-auto">
          <img
            className="w-20 aspect-[1/1] rounded-full"
            src={selectedUser?.profilePic || assets.avatar_icon}
            alt=""
          />
          <h1 className="px-10 text-xl font-medium mx-auto flex items-center gap-2">
            {onlineUsers.includes(selectedUser._id) && (
              <p className="w-2 h-2 rounded-full bg-green-500"></p>
            )}
            {selectedUser.fullName}
          </h1>
          <p>{selectedUser.bio}</p>
        </div>
        <hr className="border-[#ffffff50] my-4" />
        <div className="px-5 text-xs">
          <p>Media</p>
          <div className="mt-2 grid grid-cols-2 gap-3 opacity-80 overflow-y-scroll">
            {msgImages.map((url, index) => (
              <div
                className="cursor-pointer rounded"
                key={index}
                onClick={() => window.open(url)}
              >
                <img src={url} alt="" className="h-full  rounded-md" />
              </div>
            ))}
          </div>
        </div>
        <button
          onClick={onlogoutHandler}
          className="absolute  w-full bottom-5 left-1/2 transform -translate-x-1/2 bg-gradient-to-r  from-purple-400 to-violet-600 text-white border-none text-sm font-light py-2 px-20 rounded-full cursor-pointer"
        >
          Logout
        </button>
      </div>
    )
  );
};

export default RightSlidebar;
