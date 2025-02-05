import { BarChartOutlined, DownloadOutlined, ProfileOutlined } from '@ant-design/icons'
import { Button, Col, DatePicker, Form, message, Row, Select } from 'antd'
import dayjs from 'dayjs'
import React, { useCallback } from 'react'

import styles from './index.module.css'

import type { HistoryFilterFormValues } from '@/types/history'

import { QueryHistoryAction } from '@/constants'
import { MESSAGES, STORAGE_KEYS } from '@/constants/common'
import { usePlayerQuery } from '@/hooks'

const dateFormat = 'DD/MM/YYYY'

const { Option } = Select

interface BetHistoryFilterProps {
  onSubmitFilter: (values: HistoryFilterFormValues, mode: string) => void
  onClickExport: () => void
}

export const BetHistoryFilter: React.FC<BetHistoryFilterProps> = ({ onSubmitFilter, onClickExport }) => {
  const disabledDate = (current: dayjs.Dayjs) => current && current >= dayjs().endOf('day')

  const [form] = Form.useForm<HistoryFilterFormValues>()
  const { players } = usePlayerQuery()
  const playerList = Object.values(players)
  const isAdmin = !!localStorage.getItem(STORAGE_KEYS.IS_ADMIN)

  const handleSubmitViewHistory = useCallback(
    (values: HistoryFilterFormValues, mode: QueryHistoryAction = QueryHistoryAction.VIEW) => {
      const { startDate, endDate } = values
      if (startDate.isAfter(endDate)) {
        message.error(MESSAGES.START_DATE_MUST_BE_BEFORE_OR_EQUAL_ERROR, 4)
        return
      }
      onSubmitFilter(values, mode)
    },
    [onSubmitFilter]
  )

  const handleSubmitStatistic = useCallback(() => {
    handleSubmitViewHistory(form.getFieldsValue(), QueryHistoryAction.STATISTIC)
  }, [form, handleSubmitViewHistory])

  const playerId = Form.useWatch('playerId', form)

  return (
    <Form
      form={form}
      layout='vertical'
      onFinish={handleSubmitViewHistory}
      className={styles['bet-history-filter-form']}
      initialValues={{
        startDate: dayjs().subtract(1, 'day'),
        endDate: dayjs()
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
        <Form.Item name='startDate' label='Thời Gian:'>
          <Row gutter={8}>
            <Col span={12}>
              <DatePicker
                format={dateFormat}
                disabledDate={disabledDate}
                allowClear={false}
                placeholder='Ngày bắt đầu'
                style={{
                  width: '100%'
                }}
              />
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
                color="cyan" 
                variant="solid"
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
        {isAdmin && (
          <Form.Item>
            <Button
              type='primary'
              className={styles['button-export']}
              onClick={onClickExport}
              icon={<DownloadOutlined style={{ fontSize: '16px' }} />}
              disabled={!playerId}
            >
              Xuất Ảnh
            </Button>
          </Form.Item>
        )}
      </Col>
    </Form>
  )
}
