import { Navigate, Route, Routes } from "react-router";
import { useEffect } from "react";
import { Toaster } from "react-hot-toast";

import ChatPage from "./pages/ChatPage.jsx";
import LoginPage from "./pages/LoginPage.jsx";
import SignUpPage from "./pages/SignUpPage.jsx";

import PageLoader from "./components/PageLoader.jsx";

import { useAuthStore } from "./store/useAuthStore.js";

function App() {
  const { checkAuth, authUser, isCheckingAuth } = useAuthStore();

  useEffect(()=>{
    checkAuth();
  }, []);

  //Loader - while it's checking if user is authenicated or not
  if(isCheckingAuth) return <PageLoader />

  return (
    <div className="min-h-screen relative bg-slate-900 flex items-center justify-center p-4 overflow-hidden">

      {/* DECORATORS - GRID BG & GLOW SHAPES */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#4f4f4f2e_1px,transparent_1px),linear-gradient(to_bottom,#4f4f4f2e_1px,transparent_1px)] bg-[size:14px_24px]" />
      <div className="absolute top-0 -left-4 size-96 bg-pink-500 opacity-20 blur-[100px]" />
      <div className="absolute bottom-0 -right-4 size-96 bg-cyan-500 opacity-20 blur-[100px]" />

      <Routes>
        <Route path="/" element={authUser?<ChatPage />: <Navigate to={"/login"}/>}/>
        <Route path="/login" element={authUser? <Navigate to={"/"}/> : <LoginPage />}/>
        <Route path="/signup" element={authUser? <Navigate to={"/"}/>: <SignUpPage />} />
      </Routes>

      <Toaster />
    </div>
  );
}

export default App;
