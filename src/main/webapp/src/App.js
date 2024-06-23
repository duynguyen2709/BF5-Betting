import "antd/dist/antd.min.css";
import { HashRouter as Router, Route, Routes } from "react-router-dom";
import { ROUTES } from "./common/Constant";
import React from "react";
import MainLayout from "./layout/MainLayout";
import AdminPage from "./pages/AdminPage";
import NotFound from "./pages/ErrorPage/NotFound";
import MainPageWrapper from "./pages/MainPageWrapper";

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path={ROUTES.Admin.path} exact element={<AdminPage />} />
        <Route path={ROUTES.Base.path} exact element={<MainPageWrapper />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Router>
  );
};

const AppWrapper = () => {
  return <MainLayout component={<App />} />;
};

export default AppWrapper;
