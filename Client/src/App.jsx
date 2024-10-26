import { BrowserRouter, Routes, Route } from "react-router-dom";
import SignUpPage from "./Pages/Auth/SignUpPage";
import LoginPage from "./Pages/Auth/LoginPage";
import ChangePassWordPage from "./Pages/Auth/ChangePassPage";
import Home from "./Pages/Dashboards/home";
import DashBoard from "./Pages/Dashboards/DashBoard";
import Header from "./Components/Layout/header";
import Scroll from "./Components/Common/Scroll";
import PrivateRoute from "./Components/Layout/PrivateRoute";
import CreatePost from "./Pages/Post/createPost";
import ViewPost from "./Pages/Post/ViewPost";
import UpdatePost from "./Pages/Post/UpdatePost";
import Search from "./Pages/Dashboards/Search";
import PersonalPage from "./Pages/Dashboards/PersonalPage";
function App() {
  return (
    <BrowserRouter>
      <Scroll />
      <Header />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignUpPage />} />
        <Route element={<PrivateRoute />}>
          <Route path="change-password" element={<ChangePassWordPage />} />
          <Route path="/dashboard" element={<DashBoard />} />
          <Route path="/create-post" element={<CreatePost />} />
          <Route path="/update-post/:postId" element={<UpdatePost />} />
        </Route>
        <Route path="/post/:postSlug" element={<ViewPost />} />
        <Route path="/search" element={<Search />} />
        <Route path="/personal-page/:id" element={<PersonalPage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
