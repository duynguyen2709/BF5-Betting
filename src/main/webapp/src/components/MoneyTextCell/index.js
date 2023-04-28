import React from "react";

const MoneyTextCell = ({ value }) => {
  if (value === null || value === undefined) return "";
  if (value > 0)
    return <span style={{ color: "green" }}>{value.toLocaleString()}đ</span>;
  if (value < 0)
    return <span style={{ color: "red" }}>{value.toLocaleString()}đ</span>;
  return <span>{`${value.toLocaleString()}đ`}</span>;
};

export default MoneyTextCell;
