import { Navigate, Route, Routes } from "react-router-dom";
import HomePage from "./pages/HomePage";
import SignUpPage from "./pages/SignUpPage";
import LoginPage from "./pages/LoginPage";
import { Home } from "lucide-react";
import Navbar from "./componants/Navbar";
import { Toaster } from "react-hot-toast";
import { useUserStore } from "./store/useUserStore";
import { useEffect } from "react";
import LoadingSpinner from "./componants/LoadingSpinner"

function App() {
const {user,checkAuth,checkingAuth} = useUserStore();

useEffect(()=>{
  checkAuth();
},[checkAuth]);

if(checkingAuth) return <LoadingSpinner/>;
  return (
    <div className="min-h-screen bg-gray-900 text-white relative overflow-hidden">
      {/* Background gradient */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full bg-[radial-gradient(ellipse_at_top,rgba(16,185,129,0.3)_0%,rgba(10,80,60,0.2)_45%,rgba(0,0,0,0.1)_100%)]" />
        </div>
      </div>
      <div className="relative z-50 pt-20">
        <Navbar />
        <Routes>
          <Route path="/" element={<HomePage />}></Route>
          <Route path="/signup" element={!user?<SignUpPage />:<Navigate to='/'/>}></Route>
          <Route path="/login" element={!user?<LoginPage/>:<Navigate to='/'/>}></Route>
        </Routes>
      </div>
      <Toaster/>
    </div>
  );
}

export default App;