import { ArrowDownOutlined, ArrowUpOutlined } from '@ant-design/icons'
import { Col, Row, Table, Tooltip, Typography } from 'antd'

import type { BetHistory } from '@/types'

import { ChartTitle } from '@/components/PlayerBetStatisticChart/ChartTitle'
import { BET_RESULT } from '@/constants'
import { filterBetResult } from '@/utils/betHistory'

import './styles.css'

const { Text } = Typography

const COLORS = {
  win: '#00b96b',
  draw: '#1677ff',
  lost: '#ff4d4f',
  unfinished: '#faad14',
  border: '#4cd693',
  text: '#004a2c',
  textSecondary: '#00915a',
  warning: '#d48806',
  danger: '#cf1322',
  hover: '#e6fff2',
  header: '#b3ffd9'
} as const

export interface BetStatisticGroupProps {
  data: BetHistory[]
  title: string
}

export function BetStatisticGroup({ data, title }: BetStatisticGroupProps) {
  const totalWin = filterBetResult(data, [BET_RESULT.Win, BET_RESULT.HalfWin]).length
  const totalDraw = filterBetResult(data, [BET_RESULT.Draw]).length
  const totalLost = filterBetResult(data, [BET_RESULT.Lost, BET_RESULT.HalfLost]).length
  const totalUnfinished = filterBetResult(data, [BET_RESULT.Unfinished]).length
  const totalBetAmount = data.map((ele) => ele.betAmount).reduce((prev, next) => prev + next, 0)
  const totalWithoutDraw = data.length - totalDraw - totalUnfinished
  const winRate = totalWithoutDraw > 0 ? Math.round((totalWin * 100) / totalWithoutDraw) : undefined
  const actualProfit = data.map((ele) => ele.actualProfit ?? 0).reduce((prev, next) => prev + next, 0)

  const getWinRateColor = (rate: number | undefined) => {
    if (!rate) {
      return COLORS.text
    }
    if (rate >= 50) {
      return COLORS.win
    }
    if (rate >= 30) {
      return COLORS.warning
    }
    return COLORS.danger
  }

  const tableColumns = [
    {
      title: 'Chỉ Số',
      dataIndex: 'metric',
      key: 'metric',
      render: (text: string, record: any) => (
        <Tooltip title={record.tooltip}>
          <Text strong>{text}</Text>
        </Tooltip>
      )
    },
    {
      title: '',
      dataIndex: 'value',
      key: 'value',
      align: 'right' as const,
      className: 'value-column'
    }
  ]

  const mainTableData = [
    {
      key: '1',
      metric: 'Tổng Số Trận',
      value: <Text strong>{data.length}</Text>,
      tooltip: 'Tổng số trận đã cược'
    },
    {
      key: '2',
      metric: 'Tỉ Lệ Thắng',
      value: (
        <div className='win-rate' style={{ color: getWinRateColor(winRate) }}>
          <Text strong style={{ color: 'inherit' }}>
            {winRate}
          </Text>
          <span className='percentage'>%</span>
        </div>
      ),
      tooltip: 'Tỉ lệ thắng không tính các trận hoà và chưa hoàn tất'
    },
    {
      key: '7',
      metric: 'Tổng Tiền Cược',
      value: <Text strong>{totalBetAmount.toLocaleString()}đ</Text>,
      tooltip: 'Tổng số tiền đã đặt cược'
    },
    {
      key: '8',
      metric: 'Lợi Nhuận',
      value: (
        <div className={`profit ${actualProfit > 0 ? 'positive' : actualProfit < 0 ? 'negative' : ''}`}>
          <Text strong style={{ color: 'inherit' }}>
            {actualProfit.toLocaleString()}đ
          </Text>
          {actualProfit > 0 ? (
            <ArrowUpOutlined className='trend-icon' />
          ) : actualProfit < 0 ? (
            <ArrowDownOutlined className='trend-icon' />
          ) : null}
        </div>
      ),
      tooltip: 'Lợi nhuận thực tế từ các cược'
    }
  ]

  return (
    <div className='bet-statistic-group'>
      <ChartTitle text={title} />
      <div className='statistics-container'>
        <div className='table-section'>
          <Table
            columns={tableColumns}
            dataSource={mainTableData}
            pagination={false}
            size='small'
            className='statistics-table'
          />
          <Row gutter={[16, 16]} className='bet-results-grid'>
            <Col xs={12} sm={6}>
              <div className='bet-result-item win'>
                <div className='label'>Thắng</div>
                <div className='value'>{totalWin}</div>
              </div>
            </Col>
            <Col xs={12} sm={6}>
              <div className='bet-result-item draw'>
                <div className='label'>Hoà</div>
                <div className='value'>{totalDraw}</div>
              </div>
            </Col>
            <Col xs={12} sm={6}>
              <div className='bet-result-item lost'>
                <div className='label'>Thua</div>
                <div className='value'>{totalLost}</div>
              </div>
            </Col>
            <Col xs={12} sm={6}>
              <div className='bet-result-item unfinished'>
                <div className='label'>Chưa Hoàn Tất</div>
                <div className='value'>{totalUnfinished}</div>
              </div>
            </Col>
          </Row>
        </div>
      </div>
    </div>
  )
}
