import { Routes, Route } from "react-router-dom";
import SignUpPage from "../Pages/Auth/SignUpPage";
import LoginPage from "../Pages/Auth/LoginPage";
import ProfilePage from "../Pages/Dashboards/ProfilePage";
import HomeDashBoard from "../Pages/Dashboards/home";

const AuthRoutes = () => (
  <Routes>
    <Route path="/login" element={<LoginPage />} />
    <Route path="/signup" element={<SignUpPage />} />
    <Route path="/" element={<HomeDashBoard />} />
    <Route path="/profile" element={<ProfilePage />} />
  </Routes>
);

export default AuthRoutes;
