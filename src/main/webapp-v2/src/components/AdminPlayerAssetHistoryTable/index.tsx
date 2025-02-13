import { PlusOutlined } from '@ant-design/icons'
import { Avatar, Button, message, Row, Table, Tag } from 'antd'
import { useState } from 'react'

import { MoneyTextCell } from '../MoneyTextCell'
import { AddPlayerAssetHistoryModal } from './AddPlayerAssetHistoryModal'
import { AssetHistoryStatisticForm } from './AssetHistoryStatisticForm'
import styles from './styles.module.css'

import type { AssetByDate } from '@/types/statistic'
import type { TableProps } from 'antd'

import { MESSAGES, PaymentAction } from '@/constants'
import { usePlayerQuery } from '@/hooks/usePlayerQuery'

interface AdminPlayerAssetHistoryTableProps {
  data: AssetByDate[]
  onStatisticSuccess: () => void
  refetch: () => void
}

function PaymentActionTag({ action }: { action: PaymentAction }) {
  switch (action) {
    case PaymentAction.BET_WIN:
      return <Tag color='success'>Thắng Cược</Tag>
    case PaymentAction.BET_LOST:
      return <Tag color='error'>Thua Cược</Tag>
    case PaymentAction.CASHOUT:
      return <Tag color='processing'>Rút Tiền</Tag>
    default:
      return <Tag color='warning'>Nạp Tiền</Tag>
  }
}

export function AdminPlayerAssetHistoryTable({ data, onStatisticSuccess, refetch }: AdminPlayerAssetHistoryTableProps) {
  const { players } = usePlayerQuery()
  const [modalAddOpen, setModalAddOpen] = useState(false)

  const toggleModalAdd = () => setModalAddOpen((prev) => !prev)

  const handleAddSuccess = () => {
    message.success(MESSAGES.ADD_PAYMENT_SUCCESS)
    refetch()
  }

  const columns: TableProps<AssetByDate>['columns'] = [
    {
      title: 'Người Chơi',
      key: 'player',
      render: (_, record) => {
        const betOwner = players[record.playerId]
        if (!betOwner) {
          return null
        }

        return (
          <Row className={styles['verticalCenterRow']}>
            <Avatar size={32} src={betOwner.avatarUrl} style={{ marginRight: 8, marginLeft: 8 }} />
            <p style={{ marginBottom: 0 }}>{betOwner.playerName}</p>
          </Row>
        )
      },
      filters: Object.values(players).map((player) => ({
        key: player.playerId,
        text: player.playerName,
        value: player.playerName
      })),
      onFilter: (value, record) => {
        const betOwner = players[record.playerId]
        return betOwner?.playerName?.includes(value as string) || false
      }
    },
    {
      title: 'Thời Gian',
      key: 'paymentTime',
      dataIndex: 'paymentTime'
    },
    {
      title: 'Hành Động',
      key: 'action',
      render: (_, record) => <PaymentActionTag action={record.action} />
    },
    {
      title: 'Hình Thức Thanh Toán',
      key: 'paymentMethod',
      dataIndex: 'paymentMethod'
    },
    {
      title: 'Tài Sản',
      key: 'asset',
      children: [
        {
          title: 'Số Tiền Thanh Toán',
          key: 'amount',
          render: (_, record) => <MoneyTextCell value={record.amount} />
        },
        {
          title: 'Số Dư Đầu',
          key: 'assetBefore',
          render: (_, record) => <MoneyTextCell value={record.assetBefore} />
        },
        {
          title: 'Số Dư Cuối',
          key: 'assetAfter',
          render: (_, record) => <MoneyTextCell value={record.assetAfter} />
        }
      ]
    },
    {
      title: 'Mã Cược',
      key: 'betId',
      dataIndex: 'betId'
    }
  ]

  return (
    <>
      <div className={styles['actionBar']}>
        <AssetHistoryStatisticForm onSuccess={onStatisticSuccess} />
        <Button type='primary' icon={<PlusOutlined />} onClick={toggleModalAdd}>
          Thêm Thanh Toán
        </Button>
      </div>
      <Table
        rowKey='id'
        columns={columns}
        dataSource={data}
        bordered
        size='middle'
        scroll={{ x: 1200 }}
        pagination={{
          defaultPageSize: 10,
          showSizeChanger: true,
          showTotal: (total) => `Tổng: ${total} giao dịch`
        }}
      />
      {modalAddOpen && (
        <AddPlayerAssetHistoryModal isOpen={modalAddOpen} onClose={toggleModalAdd} onUpdateSuccess={handleAddSuccess} />
      )}
    </>
  )
}
