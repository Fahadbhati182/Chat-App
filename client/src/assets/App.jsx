import React from "react";
import { Route, Routes } from "react-router-dom";
import Login from "./pages/Login";
import Chat from "./pages/Chat";
import Profile from "./pages/Profile";
import Home from "./pages/Home";

const App = () => {
  return (
    <div className="bg-[url('/bgImage.svg')]  bg-cover">
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/chat" element={<Chat />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/login" element={<Login />} />
      </Routes>
    </div>
  );
};

export default App;
