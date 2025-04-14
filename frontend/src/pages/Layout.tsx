import { Outlet } from "react-router-dom";
import Navbar from "../components/Navbar";

const Layout = () => {
  return (
    <div className="min-h-screen bg-gradient-to-r from-[#0f2027] via-[#203a43] to-[#2c5364] text-white">
      <Navbar />
      <main className="pt-20 px-4">
        <Outlet />
      </main>
    </div>
  );
};

export default Layout;
