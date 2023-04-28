import React from "react";
import { Button } from "antd";

import "./index.scss";

const BatchInsertRawBetButton = ({ disabled, onClickAdd }) => {
  return (
    <Button
      type={"primary"}
      ghost
      disabled={disabled}
      onClick={onClickAdd}
      className={"button-batch-insert-raw-bet"}
    >
      Thêm Nhanh
    </Button>
  );
};

export default BatchInsertRawBetButton;
