import React, {useCallback, useContext} from 'react'
import {Button, Col, DatePicker, Form, message, Row, Select} from 'antd';
import moment from 'moment';
import PlayersContext from "../../common/PlayersContext";

import './index.scss'

const dateFormat = 'DD/MM/YYYY';

const {Option} = Select

const BetHistoryFilter = ({onSubmit, onClickExport, isExportButtonActive}) => {
    const disabledDate = (current) => {
        return current && current >= moment().endOf('day');
    };

    const [form] = Form.useForm();
    const playerContext = useContext(PlayersContext)
    const {players} = playerContext
    const playerList = Object.values(players)

    const handleSubmitFilter = useCallback((values) => {
        const {startDate, endDate} = values
        if (startDate && endDate) {
            if (startDate.isAfter(endDate)) {
                message.error('Ngày bắt đầu phải trước ngày kết thúc', 4)
                return
            }
        }
        onSubmit(values)
    }, [onSubmit])

    return (
        <Form
            form={form}
            layout={'vertical'}
            onFinish={handleSubmitFilter}
            className={"bet-history-filter-form"}
            initialValues={{
                startDate: moment().subtract(1, 'day'),
                endDate: moment(),
                playerId: playerList.length > 0 ? playerList[0].playerId : null
            }}>
            <Col lg={{
                span: 8
            }} md={{
                span: 8
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
                    name="startDate"
                    label="Ngày Cược"
                >
                    <DatePicker
                        format={dateFormat}
                        disabledDate={disabledDate}
                        allowClear
                        placeholder={'Ngày bắt đầu'}
                        style={{
                            width: '100%',
                        }}
                    />
                </Form.Item>
                <Form.Item
                    name="endDate"
                >
                    <DatePicker
                        format={dateFormat}
                        disabledDate={disabledDate}
                        allowClear
                        placeholder={'Ngày kết thúc'}
                        style={{
                            width: '100%',
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
                            >
                                Xem Lịch Sử
                            </Button>
                        </Col>
                        <Col span={12}>
                            <Button
                                type="primary"
                                disabled={!isExportButtonActive}
                                className={"button-submit-filter"}
                                ghost
                                style={{float: 'right'}}
                                onClick={onClickExport}
                            >
                                Xuất Thống Kê
                            </Button>
                        </Col>
                    </Row>
                </Form.Item>
            </Col>
        </Form>
    )
}

export default BetHistoryFilter;