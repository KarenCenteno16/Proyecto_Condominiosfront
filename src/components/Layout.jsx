import { Outlet } from "react-router-dom";
import Sidebar from "./Sidebar";
import Navbar from "./Navbar";

export default function Layout() {
  return (
    <div className="dashboard">
      <Sidebar /> 
      <div className="content">
        <Navbar />
        <main className="main-area">
          {}
          <Outlet /> 
        </main>
      </div>
    </div>
  );
}