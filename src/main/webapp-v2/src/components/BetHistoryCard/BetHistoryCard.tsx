import { Card, Table, Button, Typography, Tag } from 'antd'
import type { ColumnsType } from 'antd/es/table'
import { CameraOutlined } from '@ant-design/icons'
import { format } from 'date-fns'
import { BetHistory } from '@/models'
import { useMediaQuery } from '@/hooks/useMediaQuery'
import styles from './BetHistoryCard.module.css'

const { Text } = Typography

interface BetHistoryCardProps {
  data: BetHistory
  loading?: boolean
}

function BetHistoryCard({ data, loading }: BetHistoryCardProps) {
  const isMobile = useMediaQuery('(max-width: 428px)')

  const columns: ColumnsType<BetHistory> = [
    {
      title: 'Thời gian',
      dataIndex: 'createdAt',
      key: 'createdAt',
      width: isMobile ? 120 : 180,
      render: (value: string) => (
        <Text style={{ fontSize: isMobile ? 12 : 14 }}>
          {format(new Date(value), isMobile ? 'dd/MM HH:mm' : 'dd/MM/yyyy HH:mm')}
        </Text>
      ),
      fixed: 'left'
    },
    {
      title: 'Người chơi',
      dataIndex: 'playerName',
      key: 'playerName',
      width: isMobile ? 100 : 150,
      ellipsis: true,
      fixed: 'left'
    },
    {
      title: 'Trận đấu',
      dataIndex: 'matchDetail',
      key: 'matchDetail',
      render: (value) => (
        <div className={styles['matchInfo']}>
          <div>
            {value.team1Name} vs {value.team2Name}
          </div>
          <Text type='secondary' className={styles['tournament']}>
            {value.tournament}
          </Text>
        </div>
      )
    },
    {
      title: 'Cược',
      dataIndex: 'betAmount',
      key: 'betAmount',
      width: isMobile ? 90 : 120,
      align: 'right',
      render: (value: number) => (
        <Text strong style={{ fontSize: isMobile ? 12 : 14 }}>
          {value.toLocaleString()}
        </Text>
      )
    },
    {
      title: 'Tỷ lệ',
      dataIndex: 'odds',
      key: 'odds',
      width: isMobile ? 70 : 100,
      align: 'right',
      render: (value: number) => <Text style={{ fontSize: isMobile ? 12 : 14 }}>{value.toFixed(2)}</Text>
    },
    {
      title: 'Kết quả',
      dataIndex: 'result',
      key: 'result',
      width: isMobile ? 90 : 120,
      align: 'center',
      render: (value: 'WIN' | 'LOSE' | null) => {
        if (!value) return <Tag className={styles['tag']}>PENDING</Tag>
        return (
          <Tag
            color={value === 'WIN' ? 'success' : 'error'}
            className={styles['tag']}
            style={{ fontSize: isMobile ? 11 : 13 }}
          >
            {value}
          </Tag>
        )
      }
    },
    {
      title: 'Lợi nhuận',
      dataIndex: 'profit',
      key: 'profit',
      width: isMobile ? 90 : 120,
      align: 'right',
      render: (value: number) => (
        <Text
          type={value > 0 ? 'success' : value < 0 ? 'danger' : undefined}
          strong
          style={{ fontSize: isMobile ? 12 : 14 }}
        >
          {value.toLocaleString()}
        </Text>
      ),
      fixed: 'right'
    }
  ]

  return (
    <Card
      title='Lịch sử cược'
      bordered={false}
      className={styles['card']}
    >
      
    </Card>
  )
}

BetHistoryCard.displayName = 'BetHistoryCard'

export default BetHistoryCard
