import "antd/dist/antd.min.css";
import {
  BrowserRouter as Router,
  Navigate,
  Route,
  Routes,
} from "react-router-dom";
import { ROUTES } from "./common/Constant";
import React from "react";
import MainLayout from "./layout/MainLayout";
import DashboardPage from "./pages/dashboard/DashboardPage";
import NotFound from "./pages/errors/NotFound";

const App = () => {
  return (
    <Router>
      <Routes>
        <Route
          path={ROUTES.INDEX.path}
          element={<Navigate to={ROUTES.BASE.path} />}
        />
        <Route
          path={ROUTES.BASE.path}
          element={<MainLayout component={<DashboardPage/>} />}
        />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Router>
  );
};

export default App;
