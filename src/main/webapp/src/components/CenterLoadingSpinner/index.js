import React from "react";
import { Spin } from "antd";

import "./index.scss";

const CenterLoadingSpinner = () => {
  return <Spin size="large" className={"center-loading-spinner"} />;
};

export default CenterLoadingSpinner;
