import { Card, Table, Typography, Progress } from 'antd'
import type { ColumnsType } from 'antd/es/table'
import { PlayerStatistics } from '@/api/statistics'
import { useMediaQuery } from '@/hooks/useMediaQuery'
import styles from './PlayerStatisticCard.module.css'

const { Text } = Typography

interface PlayerStatisticCardProps {
  data: PlayerStatistics[]
  loading?: boolean
}

function PlayerStatisticCard({ data, loading }: PlayerStatisticCardProps) {
  const isMobile = useMediaQuery('(max-width: 428px)')

  const columns: ColumnsType<PlayerStatistics> = [
    {
      title: 'Người chơi',
      dataIndex: 'playerName',
      key: 'playerName',
      fixed: 'left',
      width: isMobile ? 120 : 150,
      ellipsis: true
    },
    {
      title: 'Số cược',
      dataIndex: 'totalBets',
      key: 'totalBets',
      align: 'right',
      width: isMobile ? 80 : 100,
      sorter: (a, b) => a.totalBets - b.totalBets
    },
    {
      title: 'Tỷ lệ thắng',
      dataIndex: 'winRate',
      key: 'winRate',
      align: 'center',
      width: isMobile ? 100 : 120,
      render: (value: number) => (
        <Progress
          type='circle'
          percent={value}
          width={isMobile ? 40 : 50}
          status={value >= 50 ? 'success' : 'exception'}
        />
      ),
      sorter: (a, b) => a.winRate - b.winRate
    },
    {
      title: 'Tổng cược',
      dataIndex: 'totalStake',
      key: 'totalStake',
      align: 'right',
      width: isMobile ? 100 : 120,
      render: (value: number) => <Text style={{ fontSize: isMobile ? 12 : 14 }}>{value.toLocaleString()}</Text>,
      sorter: (a, b) => a.totalStake - b.totalStake
    },
    {
      title: 'Lợi nhuận',
      dataIndex: 'totalProfit',
      key: 'totalProfit',
      align: 'right',
      width: isMobile ? 100 : 120,
      render: (value: number) => (
        <Text
          type={value > 0 ? 'success' : value < 0 ? 'danger' : undefined}
          strong
          style={{ fontSize: isMobile ? 12 : 14 }}
        >
          {value.toLocaleString()}
        </Text>
      ),
      sorter: (a, b) => a.totalProfit - b.totalProfit,
      defaultSortOrder: 'descend'
    }
  ]

  return (
    <Card
      title='Thống kê người chơi'
      bordered={false}
      bodyStyle={{ padding: isMobile ? 8 : 16 }}
      className={styles['card']}
    >
      <Table
        columns={columns}
        dataSource={data}
        loading={loading}
        rowKey='playerId'
        pagination={{
          defaultPageSize: isMobile ? 5 : 10,
          size: isMobile ? 'small' : 'default',
          showSizeChanger: !isMobile,
          showTotal: !isMobile ? (total) => `Tổng ${total} bản ghi` : undefined
        }}
        scroll={{ x: isMobile ? 500 : 800 }}
        size={isMobile ? 'small' : 'middle'}
      />
    </Card>
  )
}

export default PlayerStatisticCard
