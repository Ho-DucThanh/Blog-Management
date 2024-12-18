import {
  Disclosure,
  DisclosureButton,
  DisclosurePanel,
  Menu,
  MenuButton,
  MenuItem,
  MenuItems,
} from "@headlessui/react";
import { Bars3Icon, BellIcon, XMarkIcon } from "@heroicons/react/24/outline";
import { UserCircleIcon } from "@heroicons/react/24/solid";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate, Link } from "react-router-dom";
import { logoutUser } from "../../Redux/Auth/Auth_apiRequest";
import { getNotifications } from "../../Redux/Page/Follow_Api";
import { useState, useEffect } from "react";
import { formatDistanceToNow } from "date-fns";
const menuItemsUser = [
  { name: "Login", href: "/login" },
  { name: "Settings", href: "#" },
  { name: "Policy", href: "#" },
];

function classNames(...classes) {
  return classes.filter(Boolean).join(" ");
}

export default function Header() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { currentUser, accessToken } = useSelector((state) => state.auth.login);
  const [notifications, setNotifications] = useState([]);
  const [showNotifications, setShowNotifications] = useState(false);
  const [hasNewNotifications, setHasNewNotifications] = useState(false);

  const avatar = useSelector(
    (state) => state.profile.createProfile.currentUser?.avatar,
  );

  useEffect(() => {
    const fetchNotifications = async () => {
      const notifications = await getNotifications(currentUser?._id);
      setNotifications(notifications);
      setHasNewNotifications(notifications.length > 0);
    };
    fetchNotifications();
  }, [currentUser?._id]);

  const navigation = [
    { name: "Home", href: "/", current: false },
    { name: "Manage", href: "/dashboard?tab=profile", current: false },
    { name: "NewsFeed", href: `/newsfeed/${currentUser?._id}`, current: false },
  ];

  const menuItemsUserLogin = [
    { name: "Personal Page", href: `/personal-page/${currentUser?._id}` },
    { name: "Change Password", href: "/change-password" },
    { name: "Logout", href: "#" },
  ];

  const handleLogout = () => {
    logoutUser(accessToken, currentUser._id, dispatch, navigate);
  };

  const handleBellClick = () => {
    setShowNotifications((prev) => !prev);
    if (hasNewNotifications) {
      setHasNewNotifications(false);
    }
  };

  return (
    <Disclosure as="nav" className="bg-white shadow-md">
      {({ open }) => (
        <>
          <div className="mx-auto max-w-7xl px-2 sm:px-6 lg:px-8">
            <div className="relative flex h-16 items-center justify-between">
              <div className="absolute inset-y-0 left-0 flex items-center sm:hidden">
                {/* Mobile menu button */}
                <DisclosureButton className="inline-flex items-center justify-center rounded-md p-2 text-gray-400 hover:bg-gray-100 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-indigo-500">
                  <span className="sr-only">Open main menu</span>
                  {open ? (
                    <XMarkIcon className="block h-6 w-6" aria-hidden="true" />
                  ) : (
                    <Bars3Icon className="block h-6 w-6" aria-hidden="true" />
                  )}
                </DisclosureButton>
              </div>
              <div className="flex flex-1 items-center justify-center sm:items-stretch sm:justify-start">
                <div className="flex flex-shrink-0 items-center">
                  <Link to="/" className="text-sm font-semibold sm:text-xl">
                    <span className="rounded-lg bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 px-2 py-1 text-white">
                      Welcome
                    </span>
                  </Link>
                </div>
                <div className="hidden sm:ml-6 sm:block">
                  <div className="flex space-x-4">
                    {navigation.map((item) => (
                      <a
                        key={item.name}
                        href={item.href}
                        className={classNames(
                          item.current
                            ? "bg-gray-900 text-white"
                            : "text-gray-900 hover:bg-gray-700 hover:text-white",
                          "rounded-md px-3 py-2 text-sm font-medium",
                        )}
                        aria-current={item.current ? "page" : undefined}
                      >
                        {item.name}
                      </a>
                    ))}
                  </div>
                </div>
              </div>
              <div className="absolute inset-y-0 right-0 flex items-center pr-2 sm:static sm:inset-auto sm:ml-6 sm:pr-0">
                <div className="relative">
                  <button
                    type="button"
                    className="relative rounded-full bg-gray-800 p-1 text-gray-400 hover:text-white focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-gray-800"
                    onClick={() => setShowNotifications((prev) => !prev)}
                  >
                    <span className="absolute -inset-1.5" />
                    <span className="sr-only">View notifications</span>
                    <BellIcon aria-hidden="true" className="h-6 w-6" />
                    {notifications.length > 0 && (
                      <span className="absolute right-0 top-0 inline-flex h-2 w-2 rounded-full bg-red-500"></span>
                    )}
                  </button>

                  {showNotifications && (
                    <Menu
                      as="div"
                      className="absolute right-0 z-10 mt-2 w-48 origin-top-right rounded-md bg-white py-1 shadow-lg ring-1 ring-black ring-opacity-5"
                    >
                      <div className="max-h-60 overflow-y-auto">
                        {notifications.length > 0 ? (
                          notifications.map((notification) => (
                            <MenuItem key={notification.user_id}>
                              <a
                                href={`/newsfeed/${notification.user_receive}`}
                                className="flex flex-col px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                              >
                                {notification.message}
                                <a
                                  href={`/personal-page/${notification.user_receive}`}
                                  className="text-xs text-gray-500"
                                >
                                  {formatDistanceToNow(
                                    new Date(notification.createdAt),
                                    {
                                      addSuffix: true,
                                    },
                                  )}
                                </a>
                              </a>
                            </MenuItem>
                          ))
                        ) : (
                          <MenuItem>
                            <span className="block px-4 py-2 text-sm text-gray-700">
                              No notifications
                            </span>
                          </MenuItem>
                        )}
                      </div>
                    </Menu>
                  )}
                </div>

                {/* Profile dropdown */}
                <Menu as="div" className="relative ml-3">
                  <div>
                    <MenuButton className="relative flex rounded-full bg-gray-800 text-sm focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-gray-800">
                      <span className="absolute -inset-1.5" />
                      <span className="sr-only">Open user menu</span>
                      {currentUser && currentUser._id && avatar ? (
                        <img
                          src={avatar}
                          alt="User Avatar"
                          className="h-8 w-8 rounded-full object-cover"
                        />
                      ) : (
                        <UserCircleIcon
                          aria-hidden="true"
                          className="h-8 w-8 rounded-full bg-slate-100"
                        />
                      )}
                    </MenuButton>
                  </div>
                  <MenuItems
                    transition
                    className="absolute right-0 z-10 mt-2 w-48 origin-top-right rounded-md bg-white py-1 shadow-lg ring-1 ring-black ring-opacity-5 transition focus:outline-none data-[closed]:scale-95 data-[closed]:transform data-[closed]:opacity-0 data-[enter]:duration-100 data-[leave]:duration-75 data-[enter]:ease-out data-[leave]:ease-in"
                  >
                    {currentUser?._id
                      ? menuItemsUserLogin.map((item) => {
                          return (
                            <MenuItem key={item.name}>
                              <a
                                href={item.href}
                                className="block px-4 py-2 text-sm text-gray-700 data-[focus]:bg-gray-100"
                                onClick={
                                  item.name === "Logout" ? handleLogout : null
                                }
                              >
                                {item.name}
                              </a>
                            </MenuItem>
                          );
                        })
                      : menuItemsUser.map((item) => {
                          return (
                            <MenuItem key={item.name}>
                              <a
                                href={item.href}
                                className="block px-4 py-2 text-sm text-gray-700 data-[focus]:bg-gray-100"
                              >
                                {item.name}
                              </a>
                            </MenuItem>
                          );
                        })}
                  </MenuItems>
                </Menu>
              </div>
            </div>
          </div>

          <DisclosurePanel className="sm:hidden">
            <div className="space-y-1 px-2 pb-3 pt-2">
              {navigation.map((item) => (
                <DisclosureButton
                  key={item.name}
                  as="a"
                  href={item.href}
                  className={classNames(
                    item.current
                      ? "bg-gray-900 text-white"
                      : "text-gray-900 hover:bg-gray-700 hover:text-white",
                    "block rounded-md px-3 py-2 text-base font-medium",
                  )}
                  aria-current={item.current ? "page" : undefined}
                >
                  {item.name}
                </DisclosureButton>
              ))}
            </div>
          </DisclosurePanel>
        </>
      )}
    </Disclosure>
  );
}
