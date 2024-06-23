import React, { useState } from "react";
import { Button, Form, Input, message } from "antd";
import { unlock } from "../../apis/UnlockApi";
import { MESSAGE, UNLOCK_DATA_KEY } from "../../common/Constant";

export default function UnlockPage({ onUnlock }) {
  const [loading, setLoading] = useState(false);
  const [form] = Form.useForm();

  const handleSubmitForm = (values) => {
    setLoading(true);
    unlock({ key: values.key })
      .then((data) => {
        if (!data) {
          message.error(MESSAGE.DefaultErrorMessage);
          return;
        }
        if (data.code && data.code !== 200) {
          message.error(data.message);
          return;
        }

        localStorage.setItem(UNLOCK_DATA_KEY, data);
        message.success("Đăng nhập thành công");
        onUnlock(data);
      })
      .catch((error) => {
        console.error(error);
        message.error(MESSAGE.DefaultErrorMessage);
      })
      .finally(() => setLoading(false));
  };

  return (
    <Form
      layout="horizontal"
      form={form}
      size="large"
      onFinish={handleSubmitForm}
    >
      <Form.Item
        name="key"
        label="Nhập mật khẩu:"
        rules={[
          {
            required: true,
            message: "Vui lòng nhập mật khẩu",
          },
        ]}
      >
        <Input />
      </Form.Item>
      <Form.Item>
        <Button
          block
          loading={loading}
          type="primary"
          htmlType="submit"
          style={{
            marginTop: "16px",
          }}
        >
          Đăng nhập
        </Button>
      </Form.Item>
    </Form>
  );
}
