import { Sidebar } from "flowbite-react";
import {
  HiUser,
  HiArrowSmRight,
  HiDocumentText,
  HiOutlineUserGroup,
  HiAnnotation,
  HiChartPie,
  HiHome,
  HiChartBar,
} from "react-icons/hi";

import { useNavigate, Link, useLocation } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { logoutUser } from "../../Redux/Auth/Auth_apiRequest";
import { useState, useEffect } from "react";

export default function DashSidebar() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const location = useLocation();
  const [tab, setTab] = useState("");
  const { currentUser, accessToken } = useSelector((state) => state.auth.login);

  const handleLogout = () => {
    logoutUser(accessToken, currentUser._id, dispatch, navigate);
  };

  useEffect(() => {
    const urlParams = new URLSearchParams(location.search);
    const tabFormUrl = urlParams.get("tab");
    if (tabFormUrl) {
      setTab(tabFormUrl);
    }
  }, [location.search]);

  return (
    <Sidebar className="md:w-56">
      <Sidebar.Items>
        <Sidebar.ItemGroup className="flex flex-col gap-1">
          {currentUser && currentUser.admin && (
            <Link to="/dashboard?tab=dash">
              <Sidebar.Item
                active={tab === "dash" || !tab}
                icon={HiChartPie}
                as="div"
              >
                DashBoard
              </Sidebar.Item>
            </Link>
          )}
          {!currentUser.admin && (
            <Link to="/dashboard?tab=home">
              <Sidebar.Item active={tab === "home"} icon={HiHome} as="div">
                Home
              </Sidebar.Item>
            </Link>
          )}

          <Link to="/dashboard?tab=profile">
            <Sidebar.Item
              active={tab === "profile"}
              icon={HiUser}
              label={currentUser.admin ? "Admin" : "User"}
              labelColor="dark"
              as="div"
            >
              Profile
            </Sidebar.Item>
          </Link>

          {!currentUser.admin && (
            <Link to="/dashboard?tab=my-course">
              <Sidebar.Item
                active={tab === "my-course"}
                icon={HiDocumentText}
                as="div"
              >
                My Course
              </Sidebar.Item>
            </Link>
          )}

          {!currentUser.admin && (
            <Link to="/dashboard?tab=chat">
              <Sidebar.Item active={tab === "chat"} icon={HiChartBar} as="div">
                Chat
              </Sidebar.Item>
            </Link>
          )}

          {currentUser.admin && (
            <Link to="/dashboard?tab=courses">
              <Sidebar.Item
                active={tab === "courses"}
                icon={HiDocumentText}
                as="div"
              >
                Courses
              </Sidebar.Item>
            </Link>
          )}
          {currentUser.admin && (
            <>
              <Link to="/dashboard?tab=users">
                <Sidebar.Item
                  active={tab === "users"}
                  icon={HiOutlineUserGroup}
                  as="div"
                >
                  Users
                </Sidebar.Item>
              </Link>
              <Link to="/dashboard?tab=comments">
                <Sidebar.Item
                  active={tab === "comments"}
                  icon={HiAnnotation}
                  as="div"
                >
                  Comments
                </Sidebar.Item>
              </Link>
            </>
          )}
          <Sidebar.Item
            icon={HiArrowSmRight}
            className="cursor-pointer"
            onClick={handleLogout}
          >
            Sign Out
          </Sidebar.Item>
        </Sidebar.ItemGroup>
      </Sidebar.Items>
    </Sidebar>
  );
}
