import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import DashSidebar from "../../Components/Layout/DashSidebar";
import Users from "../../Components/Layout/Admin/DashUsers";
import Posts from "../../Components/Layout/Admin/DashPosts";
import ProfileForm from "../../Components/Forms/ProfileForm";
import Comments from "../../Components/Layout/Admin/DashComments";

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
    <div className="flex min-h-screen flex-col md:flex-row">
      <div className="md:w-56">
        <DashSidebar />
      </div>
      <div className="w-full p-4">
        {tab === "posts" && <Posts />}
        {tab === "users" && <Users />}
        {tab === "profile" && <ProfileForm />}
        {tab === "comments" && <Comments />}
      </div>
    </div>
  );
}
