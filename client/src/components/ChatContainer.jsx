import React, { useEffect, useRef, useState } from "react";
import assets, { messagesDummyData } from "../assets/assets";
import { formatMessageTime } from "../lib/utils";
import { useChatContext } from "../context/ChatContext";
import { useAuthContext } from "../context/AuthContext";
import toast from "react-hot-toast";

const ChatContainer = () => {
  const {
    selectedUser,
    setSelectedUser,
    getUsers,
    messages,
    sendMessage,
    getMessage,
  } = useChatContext();

  const { onlineUsers, userData } = useAuthContext();

  const scrollEnd = useRef();

  const [input, setInput] = useState("");

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (input.trim() == "") return null;
    await sendMessage({ text: input.trim() });
    setInput("");
  };

  const handleImageSubmit = async (e) => {
    e.preventDefault();
    const file = e.target.files[0];

    if (!file || !file.type.startsWith("image/")) {
      toast.error("select an image file");
    }

    const reader = new FileReader();
    reader.onloadend = async () => {
      await sendMessage({ image: reader.result });
      e.target.value = "";
    };
    reader.readAsDataURL(file);
  };

  useEffect(() => {
    if (scrollEnd.current && messages) {
      scrollEnd.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  useEffect(() => {
    if (selectedUser) {
      getMessage(selectedUser._id);
    }
  }, [selectedUser]);

  return selectedUser ? (
    <div className="h-full overflow-scroll relative backdrop-blur-lg">
      {/* Header */}
      <div className="flex items-center gap-3 py-3 mx-4 border-b border-stone-500">
        <img
          src={selectedUser.profilePic || assets.avatar_icon}
          className="w-8 h-8 rounded-full"
          alt=""
        />
        <p className="flex-1 text-lg text-white flex itec  gap-2">
          {selectedUser.fullName}
          {onlineUsers.includes(selectedUser._id) && (
            <span className="w-2 h-2 rounded-full bg-green-500"></span>
          )}
        </p>
        <img
          onClick={() => setSelectedUser(null)}
          src={assets.arrow_icon}
          className="md:hidden max-w-7"
          alt=""
        />
        <img src={assets.help_icon} className="max-md:hidden max-w-5" alt="" />
      </div>

      {/* Chat Area */}
      <div className="flex flex-col h-[calc(100%-120px)] overflow-y-scroll p-3 pb-6">
        {messages.map((msg, index) => (
          <div
            key={index}
            className={`flex items-end gap-2 justify-end ${
              msg.senderId !== userData._id && "flex-row-reverse"
            }`}
          >
            {msg.image ? (
              <img
                src={msg.image}
                className="max-w-[230px] border border-gray-700 rounded-lg overflow-hidden mb-8 "
              />
            ) : (
              <p
                className={`p-2 max-w-[200px] md:text-sm font-light rounded-lg mb-8 break-all bg-violet-500/30 text-white  ${
                  msg.senderId === userData._id
                    ? "rounded-br-none"
                    : "rounded-bl-none"
                }`}
              >
                {msg.text}
              </p>
            )}
            <div>
              <img
                src={
                  msg.senderId === userData._id
                    ? userData?.profilePic || assets.avatar_icon
                    : selectedUser?.profilePic || assets.avatar_icon
                }
                alt=""
                className="w-7 rounded-full"
              />
              <p className="text-gray-500">
                {formatMessageTime(msg.createdAt)}
              </p>
            </div>
          </div>
        ))}
        <div ref={scrollEnd}></div>
      </div>

      {/* Search Bar */}

      <div className="absolute bottom-0 left-0 right-0 flex items-center gap-3 p-3">
        <div className="flex flex-1 bg-gray-100/12 w-full mx-10 p-3 rounded-full justify-between">
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => (e.key == "Enter" ? handleSendMessage(e) : null)}
            className="flex text-sm border-none rounded-lg outline-none placeholder-gray-400"
            type="text"
            placeholder="Send a message"
          />
          <input
            onChange={handleImageSubmit}
            type="file"
            name="image"
            id="image"
            accept="image/png, image/jped"
            hidden
          />
          <label htmlFor="image">
            <img
              src={assets.gallery_icon}
              className="w-5 mr-2 cursor-pointer"
              alt=""
            />
          </label>
        </div>
        <img
          onClick={handleSendMessage}
          src={assets.send_button}
          className="w-7 cursor-pointer"
          alt=""
        />
      </div>
    </div>
  ) : (
    <div className="flex flex-col items-center justify-center gap-2 text-gray-500 bg-white/10 max-md:hidden">
      <img src={assets.logo_icon} className="max-w-16" alt="" />
      <p className="text-lg font-medium text-white">Chat anytime,anywhere</p>
    </div>
  );
};

export default ChatContainer;
