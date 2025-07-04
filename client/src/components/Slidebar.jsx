import React, { use, useEffect, useState } from "react";
import assets, { userDummyData } from "../assets/assets";
import { useAuthContext } from "../context/AuthContext";
import { useChatContext } from "../context/ChatContext";

const Slidebar = () => {
  const { navigate, onlogoutHandler, onlineUsers } = useAuthContext();
  const {
    selectedUser,
    setSelectedUser,
    getUsers,
    usersForSlidebar,
    unseenMessage,
    setUnseenMessages,
  } = useChatContext();

  const [search, setSearch] = useState("");

  useEffect(() => {
    getUsers();
  }, [onlineUsers]);

  const filterUser =
    search.length > 0
      ? usersForSlidebar.filter((user) =>
          user?.fullName.toLowerCase().includes(search.toLocaleLowerCase())
        )
      : usersForSlidebar;

  return (
    <div
      className={`bg-[#8185B2]/10 h-full p-5 rounded-r-xl overflow-y-scroll text-white ${
        selectedUser ? "max-md:hidden" : ""
      }`}
    >
      <div className="pb-5">
        <div className="flex justify-between item-center">
          <img src={assets.logo} className="max-w-40" alt="" />
          <div className="relative py-2 group">
            <img
              src={assets.menu_icon}
              alt=""
              className="max-h-5 cursor-pointer"
            />
            <div className="absolute top-full right-0  z-20 w-32 p-5 rounded-md bg-[#282142] border border-gray-600 text-gray-100 hidden group-hover:block">
              <p
                onClick={() => navigate("/profile")}
                className="cursor-pointer text-sm"
              >
                Edit Profile
              </p>
              <hr className="my-2 border-t border-gray-500" />
              <p onClick={onlogoutHandler} className="cursor-pointer text-sm">
                Logout
              </p>
            </div>
          </div>
        </div>
        {/* serach bar */}
        <div className="bg-[#282142] rounded-full flex items-center gap-2 py-3 px-4 mt-5">
          <img src={assets.search_icon} alt="Search" className="w-3" />
          <input
            onChange={(e) => setSearch(e.target.value)}
            value={search}
            type="text"
            className="bg-transparent border-none outline-none text-white text-xs placeholder-[#c8c8c8] flex-1"
            placeholder="Search User..."
          />
        </div>
      </div>

      {/* user */}
      <div className="flex flex-col">
        {filterUser.map((user, index) => (
          <div
            onClick={() => {
              setSelectedUser(user);
              setUnseenMessages((prev) => ({ ...prev, [user._id]: 0 }));
            }}
            key={index}
            className={`relative flex items-center gap-2 p-2 pl-4 rounded cursor-pointer max-sm:text-sm ${
              selectedUser?._id == user._id && "bg-[#282142]/50"
            }`}
          >
            <img
              src={user?.profilePic || assets.avatar_icon}
              alt=""
              className="w-[35px] aspect-[1/1] rounded-full"
            />
            <div className="flex flex-col leading-5">
              <p className="text-white text-sm">{user.fullName}</p>
              {onlineUsers.includes(user._id) ? (
                <span className="text-green-400 text-xs">Online</span>
              ) : (
                <span className="text-neutral-400 text-xs">Offline</span>
              )}
            </div>
            {unseenMessage[user._id] > 0 && (
              <p className="absolute top-4 right-4 text-xs h-5 w-5 flex justify-center items-center rounded-full bg-violet-500/50 text-white">
                {unseenMessage[user._id]}
              </p>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default Slidebar;
