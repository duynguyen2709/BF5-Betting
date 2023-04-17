import React from "react";
import {Button, DatePicker, Form} from "antd";
import moment from "moment";

const {RangePicker} = DatePicker;

const rangeConfig = {
    rules: [
        {
            type: 'array',
            required: true,
            message: 'Vui lòng chọn ngày',
        },
    ],
};

const disabledDate = (current) => {
    // Can not select days after today
    return current && current > moment().endOf('day');
}

const AssetHistoryStatisticForm = ({onSubmit}) => {
    const [form] = Form.useForm();
    return (
        <Form
            style={{marginBottom: '1rem'}}
            layout={"inline"}
            form={form}
            onFinish={onSubmit}
            initialValues={{
                dateRange: [moment().subtract(1, 'day'), moment().subtract(1, 'day')],
            }}
        >
            <Form.Item name="dateRange" label="Chọn Ngày: " {...rangeConfig} format="YYYY-MM-DD">
                <RangePicker disabledDate={disabledDate} allowClear={false}/>
            </Form.Item>
            <Form.Item>
                <Button type="primary" htmlType="submit" ghost>Chạy Thống Kê</Button>
            </Form.Item>
        </Form>
    );
}

export default AssetHistoryStatisticForm