import "antd/dist/antd.min.css";
import { HashRouter as Router, Route, Routes } from "react-router-dom";
import { ROUTES } from "./common/Constant";
import React from "react";
import MainLayout from "./layout/MainLayout";
import HistoryPage from "./pages/HistoryPage";
import AdminPage from "./pages/AdminPage";
import NotFound from "./pages/ErrorPage/NotFound";

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path={ROUTES.Admin.path} element={<AdminPage />} />
        <Route path={ROUTES.Base.path} exact element={<HistoryPage />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Router>
  );
};

const AppWrapper = () => {
  return <MainLayout component={<App />} />;
};

export default AppWrapper;
