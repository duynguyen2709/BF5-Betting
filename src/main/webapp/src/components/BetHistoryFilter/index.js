import React, { useCallback } from "react";
import { Button, Col, DatePicker, Form, message, Row, Select } from "antd";
import {
  BarChartOutlined,
  DownloadOutlined,
  ProfileOutlined,
} from "@ant-design/icons";
import moment from "moment";
import {
  LOCAL_STORAGE_KEY,
  MESSAGE,
  QUERY_HISTORY_ACTION,
} from "../../common/Constant";
import { usePlayerContextHook } from "../../hooks";

import "./index.scss";

const dateFormat = "DD/MM/YYYY";

const { Option } = Select;

const BetHistoryFilter = ({ onSubmitFilter, onClickExport }) => {
  const disabledDate = (current) => {
    return current && current >= moment().endOf("day");
  };

  const [form] = Form.useForm();
  const { players } = usePlayerContextHook();
  const playerList = Object.values(players);
  const isAdmin = !!localStorage.getItem(LOCAL_STORAGE_KEY.IsAdmin);

  const handleSubmitViewHistory = useCallback(
    (values, mode = QUERY_HISTORY_ACTION.View) => {
      const { startDate, endDate } = values;
      if (startDate.isAfter(endDate)) {
        message.error(MESSAGE.StartDateMustBeBeforeOrEqualError, 4);
        return;
      }
      onSubmitFilter(values, mode);
    },
    [onSubmitFilter]
  );

  const handleSubmitStatistic = useCallback(() => {
    handleSubmitViewHistory(
      form.getFieldsValue(),
      QUERY_HISTORY_ACTION.Statistic
    );
  }, [form, handleSubmitViewHistory]);

  const playerId = Form.useWatch("playerId", form);

  return (
    <Form
      form={form}
      layout={"vertical"}
      onFinish={handleSubmitViewHistory}
      className={"bet-history-filter-form"}
      initialValues={{
        startDate: moment().subtract(1, "day"),
        endDate: moment(),
      }}
    >
      <Col
        lg={{
          span: 8,
        }}
        md={{
          span: 8,
        }}
      >
        <Form.Item
          name="playerId"
          label="Chọn Tên:"
          rules={[
            {
              required: true,
              message: "Vui lòng chọn tên",
            },
          ]}
        >
          <Select
            style={{
              width: "100%",
            }}
            allowClear={false}
            loading={playerList.length === 0}
          >
            {playerList.map((ele) => {
              return (
                <Option key={ele.playerId} value={ele.playerId}>
                  <Row>{ele.playerName}</Row>
                </Option>
              );
            })}
          </Select>
        </Form.Item>
        <Form.Item name="startDate" label="Thời Gian:">
          <DatePicker
            format={dateFormat}
            disabledDate={disabledDate}
            allowClear={false}
            placeholder={"Ngày bắt đầu"}
            style={{
              width: "100%",
            }}
          />
        </Form.Item>
        <Form.Item name="endDate">
          <DatePicker
            format={dateFormat}
            disabledDate={disabledDate}
            allowClear={false}
            placeholder={"Ngày kết thúc"}
            style={{
              width: "100%",
            }}
          />
        </Form.Item>
        <Form.Item>
          <Row>
            <Col span={12}>
              <Button
                type="primary"
                htmlType="submit"
                className={"button-submit-filter"}
                icon={<ProfileOutlined style={{ fontSize: "16px" }} />}
                disabled={!playerId}
              >
                Danh Sách Cược
              </Button>
            </Col>
            <Col span={12}>
              <Button
                type="primary"
                className={"button-submit-statistic"}
                style={{
                  float: "right",
                  ...(playerId
                    ? {
                        borderColor: "#52c41a",
                        background: "#389e0d",
                      }
                    : {}),
                }}
                onClick={handleSubmitStatistic}
                icon={<BarChartOutlined style={{ fontSize: "16px" }} />}
                disabled={!playerId}
              >
                Thống Kê
              </Button>
            </Col>
          </Row>
        </Form.Item>
        {isAdmin && (
          <Form.Item>
            <Button
              type="primary"
              block
              onClick={onClickExport}
              icon={<DownloadOutlined style={{ fontSize: "16px" }} />}
            >
              Tải Lịch Sử
            </Button>
          </Form.Item>
        )}
      </Col>
    </Form>
  );
};

export default BetHistoryFilter;
