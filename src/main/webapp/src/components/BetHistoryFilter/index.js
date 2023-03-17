import React, {useContext} from 'react'
import {Button, DatePicker, Form, Row, Select} from 'antd';
import moment from 'moment';
import PlayersContext from "../../common/PlayersContext";

import './index.scss'

const dateFormat = 'DD/MM/YYYY';

const {Option} = Select

const BetHistoryFilter = ({onSubmit}) => {
    const disabledDate = (current) => {
        return current && current >= moment().endOf('day');
    };

    const [form] = Form.useForm();
    const playerContext = useContext(PlayersContext)
    const {players} = playerContext
    const playerList = Object.values(players)

    return (
        <Form
            form={form}
            onFinish={onSubmit}
            className={"bet-history-filter-form"}
            initialValues={{
                date: moment().subtract(1, 'day'),
                playerId: playerList.length > 0 ? playerList[0].playerId : null
            }}>
            <Form.Item
                name="playerId"
                label="Chọn Tên:"
                rules={[
                    {
                        required: true,
                        message: 'Vui lòng chọn tên'
                    },
                ]}
            >
                <Select
                    style={{
                        width: '100%',
                    }}
                    allowClear={false}
                    loading={playerList.length === 0}
                >
                    {playerList.map(ele => {
                        return <Option key={ele.playerId} value={ele.playerId}>
                            <Row>
                                {ele.playerName}
                            </Row>
                        </Option>
                    })}
                </Select>

            </Form.Item>
            <Form.Item
                name="date"
                label="Ngày Cược"
            >
                <DatePicker
                    format={dateFormat}
                    disabledDate={disabledDate}
                    allowClear
                    style={{
                        width: '100%',
                    }}
                />
            </Form.Item>
            <Form.Item>
                <Button
                    type="primary"
                    htmlType="submit"
                    className={"button-submit-filter"}
                >
                    Xem Lịch Sử
                </Button>
            </Form.Item>
        </Form>
    )
}

export default BetHistoryFilter;