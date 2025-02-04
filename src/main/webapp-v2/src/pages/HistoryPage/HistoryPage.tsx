import BetHistoryCard from '@/components/BetHistoryCard'
import BetHistoryFilter from '@/components/BetHistoryFilter'
import PlayerStatisticCard from '@/components/PlayerStatisticCard'
import { useBetHistory, useRecentBets } from '@/hooks'
import { useDetailStatistics } from '@/hooks/useStatistics'
import { DownCircleTwoTone, RightCircleTwoTone } from '@ant-design/icons'
import { Badge, Collapse, DatePicker, Tabs } from 'antd'
import type { Dayjs } from 'dayjs'
import { useCallback, useState } from 'react'
import styles from './HistoryPage.module.css'

const { Panel } = Collapse
const { RangePicker } = DatePicker

const TAB_ITEMS = [
  {
    label: 'Danh Sách Cược',
    key: 'history'
  },
  {
    label: 'Thống Kê',
    key: 'statistic'
  }
]

type TabKey = (typeof TAB_ITEMS)[number]['key']

interface FilterValues {
  dateRange?: [Dayjs, Dayjs]
  playerId?: string
}

function HistoryPage() {
  const [activeTab, setActiveTab] = useState<TabKey>('history')
  const [filter, setFilter] = useState<FilterValues | null>(null)
  const [statisticsDateRange, setStatisticsDateRange] = useState<[Dayjs, Dayjs] | null>(null)

  const { data: recentBets, isLoading: loadingRecent } = useRecentBets()
  const { data: betHistory, isLoading: loadingHistory } = useBetHistory({
    playerId: filter?.playerId,
    startDate: filter?.dateRange?.[0]?.toISOString(),
    endDate: filter?.dateRange?.[1]?.toISOString()
  })
  const { data: statistics, isLoading: loadingStatistics } = useDetailStatistics({
    startDate: statisticsDateRange?.[0]?.toISOString(),
    endDate: statisticsDateRange?.[1]?.toISOString()
  })

  const handleFilter = useCallback((values: FilterValues) => {
    setFilter(values)
  }, [])

  const handleStatisticsDateChange = useCallback((dates: any) => {
    setStatisticsDateRange(dates as [Dayjs, Dayjs] | null)
  }, [])

  return (
    <div className={styles['container']}>
      <Collapse
        defaultActiveKey={['recent']}
        expandIcon={({ isActive }) =>
          isActive ? <DownCircleTwoTone twoToneColor='#52c41a' /> : <RightCircleTwoTone twoToneColor='#52c41a' />
        }
        className={styles['recentBetsPanel']}
      >
        <Panel
          header={
            <>
              Danh Sách Cược Gần Đây{' '}
              <Badge count={recentBets?.length || 0} style={{ marginLeft: 8 }} />
            </>
          }
          key='recent'
        >
          {loadingRecent ? (
            <div>Đang tải...</div>
          ) : (
            recentBets?.map((bet) => <BetHistoryCard key={bet.betId} data={bet} />)
          )}
        </Panel>
      </Collapse>

      <div className={styles['tabContent']}>
        <Tabs activeKey={activeTab} onChange={(key) => setActiveTab(key as TabKey)} items={TAB_ITEMS} />

        {activeTab === 'history' && (
          <>
            <div className={styles['filterSection']}>
              <BetHistoryFilter onFilter={handleFilter} />
            </div>
            {loadingHistory ? (
              <div>Đang tải...</div>
            ) : (
              betHistory?.map((bet) => <BetHistoryCard key={bet.betId} data={bet} />)
            )}
          </>
        )}

        {activeTab === 'statistic' && (
          <>
            <div className={styles['dateRangePicker']}>
              <RangePicker onChange={handleStatisticsDateChange} showTime />
            </div>
            <PlayerStatisticCard data={statistics || []} loading={loadingStatistics} />
          </>
        )}
      </div>
    </div>
  )
}

export default HistoryPage
