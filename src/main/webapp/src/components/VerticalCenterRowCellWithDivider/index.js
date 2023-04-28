import React from "react";
import { Divider, Row } from "antd";

import "./index.scss";

const VerticalCenterRowCellWithDivider = ({
  children,
  arrayLength,
  index,
  margin = "0.5rem",
}) => {
  const isFirstEle = index === 0 && arrayLength > 0;
  const isNonLastEle = index < arrayLength - 1;
  let style;
  if (isFirstEle) {
    style = { marginBottom: margin };
  } else if (isNonLastEle) {
    style = { marginBottom: margin, marginTop: margin };
  } else {
    style = { marginTop: margin };
  }

  return (
    <>
      <Row className={"vertical-center-row"} style={style}>
        {children}
      </Row>
      {isNonLastEle && <Divider style={{ margin: "0.25rem" }} />}
    </>
  );
};

export default VerticalCenterRowCellWithDivider;
