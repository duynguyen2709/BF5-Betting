import { Table, Typography } from 'antd'
import dayjs from 'dayjs'
import React from 'react'

import styles from './index.module.css'

import type { AssetByDate } from '@/types'

import { PaymentAction } from '@/constants/enums'
const { Text } = Typography

const COLORS = {
  positive: '#00b96b',
  negative: '#ff4d4f'
} as const

export const PaymentHistoryActionTable: React.FC<{ cashoutActions: AssetByDate[] }> = ({ cashoutActions }) => {
  const columns = [
    {
      title: 'Thời Gian',
      dataIndex: 'paymentTime',
      key: 'paymentTime',
      render: (time: string) => dayjs(time, 'DD/MM HH:mm').format('DD/MM/YYYY HH:mm')
    },
    {
      title: 'Loại',
      dataIndex: 'action',
      key: 'action',
      render: (action: PaymentAction) => (action === PaymentAction.CASHOUT ? 'Rút Tiền' : 'Nạp Tiền')
    },
    {
      title: 'Số Tiền',
      dataIndex: 'amount',
      key: 'amount',
      align: 'right' as const,
      render: (_: any, record: AssetByDate) => {
        const amount = record.assetAfter - record.assetBefore
        const formattedAmount = Math.abs(amount).toLocaleString()
        return (
          <Text strong style={{ color: amount > 0 ? COLORS.negative : COLORS.positive }}>
            {amount > 0 ? '-' : '+'}
            {formattedAmount}
          </Text>
        )
      }
    }
  ]

  return (
    <div className={styles['cashout-table']}>
      <Text strong className={styles['table-title']}>
        Lịch Sử Thanh Toán
      </Text>
      <Table size='small' columns={columns} dataSource={cashoutActions} pagination={false} rowKey='paymentTime' />
    </div>
  )
}
