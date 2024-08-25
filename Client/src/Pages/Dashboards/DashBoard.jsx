import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import DashSidebar from "../../Components/Layout/DashSidebar";
import Users from "../../Components/Layout/Users";
import Course from "../../Components/Layout/Course";
import ProfileForm from "../../Components/Forms/ProfileForm";

export default function DashBoard() {
  const location = useLocation();
  const [tab, setTab] = useState("");
  useEffect(() => {
    const urlParams = new URLSearchParams(location.search);
    const tabFromUrl = urlParams.get("tab");
    if (tabFromUrl) {
      setTab(tabFromUrl);
    }
  }, [location.search]);
  return (
    <div className="flex h-screen min-h-0 flex-col md:flex-row">
      <div className="md:w-56">
        <DashSidebar />
      </div>
      <div className="w-full p-4">
        {tab === "courses" && <Course />}
        {tab === "users" && <Users />}
        {tab === "profile" && <ProfileForm />}
      </div>
    </div>
  );
}
