import "antd/dist/antd.min.css";
import {BrowserRouter as Router, Navigate, Route, Routes,} from "react-router-dom";
import {ROUTES} from "./common/Constant";
import React from "react";
import MainLayout from "./layout/MainLayout";
import HistoryPage from "./pages/HistoryPage";
import AdminPage from "./pages/AdminPage";
import NotFound from "./pages/ErrorPage/NotFound";

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
          element={<HistoryPage/>}
        />
        <Route
          path={ROUTES.ADMIN.path}
          element={<AdminPage/>}
        />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Router>
  );
};

const AppWrapper = () => {
  return <MainLayout component={<App />} />
}

export default AppWrapper;
