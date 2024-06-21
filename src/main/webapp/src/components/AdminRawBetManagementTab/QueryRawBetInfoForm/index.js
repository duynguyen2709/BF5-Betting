import React from "react";
import moment from "moment";
import { Button, DatePicker, Form, Input } from "antd";
import { LOCAL_STORAGE_KEY } from "../../../common/Constant";

const { RangePicker } = DatePicker;

const rangeConfig = {
  rules: [
    {
      type: "array",
      required: true,
      message: "Vui lòng chọn ngày",
    },
  ],
};

const disabledDate = (current) => {
  // Can not select days after today
  return current && current > moment().endOf("day");
};

const getLastQuerySessionToken = () => {
  const data = localStorage.getItem(LOCAL_STORAGE_KEY.RawBetQueryParams);
  return data ? JSON.parse(data).sessionToken : "";
};

const QueryRawBetInfoForm = ({ onSubmit, onQuickQuery, form }) => {
  return (
    <Form
      style={{ marginBottom: "1rem" }}
      layout={"inline"}
      form={form}
      onFinish={onSubmit}
      initialValues={{
        sessionToken: getLastQuerySessionToken(),
        dateRange: [moment().subtract(1, "day"), moment()],
      }}
    >
      <Form.Item label="Nhập Token: " name={"sessionToken"}>
        <Input style={{ width: 300 }} />
      </Form.Item>
      <Form.Item
        name="dateRange"
        label="Chọn Ngày: "
        {...rangeConfig}
        format="YYYY-MM-DD"
      >
        <RangePicker disabledDate={disabledDate} allowClear={false} />
      </Form.Item>
      <Form.Item>
        <Button type="primary" htmlType="submit">
          Lấy Dữ Liệu
        </Button>
        <Button
          type="primary"
          ghost
          onClick={onQuickQuery}
          style={{ marginLeft: "16px" }}
        >
          Tìm Nhanh
        </Button>
      </Form.Item>
    </Form>
  );
};

export default QueryRawBetInfoForm;
