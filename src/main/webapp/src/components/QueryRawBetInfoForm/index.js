import React from 'react';
import moment from "moment";
import {Button, DatePicker, Form, Input} from 'antd';

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

const QueryRawBetInfoForm = ({onSubmit}) => {
    const [form] = Form.useForm();
    return (
        <Form
            style={{marginBottom: '1rem'}}
            layout={"inline"}
            form={form}
            onFinish={onSubmit}
            initialValues={{
                dateRange: [moment().subtract(1, 'day'), moment()],
            }}
        >
            <Form.Item label="Nhập Token: " name={"sessionToken"}
                       rules={[{required: true, message: 'Vui lòng nhập token'}]}>
                <Input style={{width: 300}}/>
            </Form.Item>
            <Form.Item name="dateRange" label="Chọn Ngày: " {...rangeConfig} format="YYYY-MM-DD">
                <RangePicker disabledDate={disabledDate} allowClear={false}/>
            </Form.Item>
            <Form.Item>
                <Button type="primary" htmlType="submit">Lấy Dữ Liệu</Button>
            </Form.Item>
        </Form>
    );
};
export default QueryRawBetInfoForm;