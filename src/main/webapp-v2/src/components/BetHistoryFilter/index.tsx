import { BarChartOutlined, ProfileOutlined } from '@ant-design/icons'
import { Button, Col, DatePicker, Form, message, Row, Select } from 'antd'
import dayjs from 'dayjs'
import React from 'react'

import styles from './index.module.css'

import type { HistoryFilterFormValues } from '@/types/history'

import { QueryHistoryAction } from '@/constants'
import { MESSAGES } from '@/constants/common'
import { usePlayerQuery } from '@/hooks'

const { Option } = Select

const dateFormat = 'DD/MM/YYYY'

interface BetHistoryFilterProps {
  onSubmitFilter: (values: HistoryFilterFormValues, action: QueryHistoryAction) => void
  initialValues?: HistoryFilterFormValues
}

const disabledDate = (current: dayjs.Dayjs) => current && current >= dayjs().endOf('day')

export const BetHistoryFilter: React.FC<BetHistoryFilterProps> = ({ onSubmitFilter, initialValues }) => {
  const [form] = Form.useForm<HistoryFilterFormValues>()
  const { players } = usePlayerQuery()
  const playerList = Object.values(players)
  const playerId = Form.useWatch('playerId', form)

  const handleSubmitViewHistory = (
    values: HistoryFilterFormValues,
    viewAction: QueryHistoryAction = QueryHistoryAction.VIEW
  ) => {
    const { startDate, endDate } = values
    if (startDate.isAfter(endDate)) {
      message.error(MESSAGES.START_DATE_MUST_BE_BEFORE_OR_EQUAL_ERROR, 4)
      return
    }
    onSubmitFilter(values, viewAction)
  }

  const handleSubmitStatistic = () => handleSubmitViewHistory(form.getFieldsValue(), QueryHistoryAction.STATISTIC)

  return (
    <Form
      form={form}
      layout='vertical'
      onFinish={handleSubmitViewHistory}
      className={styles['bet-history-filter-form']}
      initialValues={{
        startDate: dayjs().subtract(1, 'day'),
        endDate: dayjs(),
        ...initialValues
      }}
    >
      <Col
        lg={{
          span: 8
        }}
        md={{
          span: 8
        }}
      >
        <Form.Item
          name='playerId'
          label='Chọn Tên:'
          rules={[
            {
              required: true,
              message: 'Vui lòng chọn tên'
            }
          ]}
        >
          <Select
            style={{
              width: '100%'
            }}
            allowClear={false}
            loading={playerList.length === 0}
          >
            {playerList.map((player) => (
              <Option key={player.playerId} value={player.playerId}>
                <Row>{player.playerName}</Row>
              </Option>
            ))}
          </Select>
        </Form.Item>
        <Form.Item>
          <div style={{ marginBottom: '8px' }}>
            <span>
              <span style={{ color: '#ef4444', fontSize: '11px' }}>*</span> Thời Gian:
            </span>
          </div>
          <Row gutter={8}>
            <Col span={12}>
              <Form.Item name='startDate' noStyle>
                <DatePicker
                  format={dateFormat}
                  disabledDate={disabledDate}
                  allowClear={false}
                  placeholder='Ngày bắt đầu'
                  style={{
                    width: '100%'
                  }}
                />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item name='endDate' noStyle>
                <DatePicker
                  format={dateFormat}
                  disabledDate={disabledDate}
                  allowClear={false}
                  placeholder='Ngày kết thúc'
                  style={{
                    width: '100%'
                  }}
                />
              </Form.Item>
            </Col>
          </Row>
        </Form.Item>
        <Form.Item>
          <Row>
            <Col span={12}>
              <Button
                type='primary'
                htmlType='submit'
                className={styles['button-submit-filter']}
                icon={<ProfileOutlined style={{ fontSize: '16px' }} />}
                disabled={!playerId}
              >
                Danh Sách Cược
              </Button>
            </Col>
            <Col span={12}>
              <Button
                color='cyan'
                variant='solid'
                className={styles['button-submit-statistic']}
                style={{
                  float: 'right'
                }}
                onClick={handleSubmitStatistic}
                icon={<BarChartOutlined style={{ fontSize: '16px' }} />}
                disabled={!playerId}
              >
                Thống Kê
              </Button>
            </Col>
          </Row>
        </Form.Item>
      </Col>
    </Form>
  )
}
