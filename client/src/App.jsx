import React from "react";
import { Navigate, Route, Routes } from "react-router-dom";
import Login from "./pages/Login";
import Profile from "./pages/Profile";
import Home from "./pages/Home";
import { Toaster } from "react-hot-toast";
import { useAuthContext } from "./context/AuthContext";

const App = () => {
  const { isUser } = useAuthContext();
  return (
    <div className="bg-[url('/bgImage.svg')]  bg-cover">
      <Toaster />
      <Routes>
        <Route
          path="/"
          element={isUser ? <Home /> : <Navigate to={"/login"} />}
        />

        <Route
          path="/profile"
          element={isUser ? <Profile /> : <Navigate to={"/login"} />}
        />
        <Route
          path="/login"
          element={!isUser ? <Login /> : <Navigate to={"/"} />}
        />
      </Routes>
    </div>
  );
};

export default App;
