import { BrowserRouter as Router } from "react-router-dom";
import AuthRoutes from "./authRoutes";

const AppRoutes = () => (
  <Router>
    <AuthRoutes />
  </Router>
);

export default AppRoutes;
