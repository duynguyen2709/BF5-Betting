import { DownCircleTwoTone, RightCircleTwoTone } from '@ant-design/icons'
import { Badge, Collapse } from 'antd'
import { useCallback, useEffect, useRef, useState } from 'react'
import { exportComponentAsJPEG } from 'react-component-export-image'

import styles from './HistoryPage.module.css'

import type { Player } from '@/types'
import type { HistoryFilterFormValues, HistoryFilterParams, TabKeys } from '@/types/history'

import { BetHistoryFilter } from '@/components/BetHistoryFilter'
import { CenterLoadingSpinner } from '@/components/CenterLoadingSpinner'
import { HistoryCardWrapper } from '@/components/HistoryCardWrapper'
import { PlayerRecentBetsCollapsibleCard } from '@/components/PlayerRecentBetsCollapsibleCard'
import { RecentUnfinishedBets } from '@/components/RecentUnfinishedBets'
import { QueryHistoryAction } from '@/constants'
import { usePlayerQuery } from '@/hooks'
import { useRecentBetsQuery } from '@/hooks/useRecentBetsQuery'
import PlayerStatisticCard from '@/components/PlayerStatisticCard'

const { Panel } = Collapse

const TAB_KEYS: TabKeys = {
  History: {
    label: 'Danh Sách Cược',
    key: 'history'
  },
  Statistic: {
    label: 'Thống Kê',
    key: 'statistic'
  }
}

const DEFAULT_HISTORY_FILTER_PARAMS: HistoryFilterParams = {
  playerId: '',
  startDate: null,
  endDate: null
}

function sortPlayerByProfitDesc(players: Record<string, Player>): Player[] {
  const playerArray = Object.values(players)
  playerArray.sort((a, b) => b.totalProfit - a.totalProfit)
  return playerArray
}

export default function HistoryPage() {
  const historyCardRef = useRef<HTMLDivElement>(null)
  const [loading, setLoading] = useState(false)
  const [historyActiveTab, setHistoryActiveTab] = useState(TAB_KEYS.History.key)
  const [data, setData] = useState<any>(undefined)
  const [queryMode, setQueryMode] = useState<QueryHistoryAction>(QueryHistoryAction.VIEW)
  const [historyFilterParams, setHistoryFilterParams] = useState<HistoryFilterParams>(DEFAULT_HISTORY_FILTER_PARAMS)

  const { players } = usePlayerQuery()
  const playersWithSortedProfit = sortPlayerByProfitDesc(players)

  const { playerRecentBets, isLoading: recentBetLoading } = useRecentBetsQuery()

  useEffect(() => {
    console.log('playerRecentBets', playerRecentBets)
  }, [playerRecentBets])
  

  const handleSubmitFilter = useCallback((fieldsValue: HistoryFilterFormValues, queryMode: string) => {
    setLoading(true)
    // Reset current filter & data
    setQueryMode(queryMode === TAB_KEYS.History.key ? QueryHistoryAction.VIEW : QueryHistoryAction.STATISTIC)
    setData(undefined)
    setHistoryFilterParams(DEFAULT_HISTORY_FILTER_PARAMS)
    // Parse new filter params
    const { playerId, startDate, endDate } = fieldsValue
    const queryParams: HistoryFilterParams = {
      playerId,
      startDate: startDate.format('YYYY-MM-DD'),
      endDate: endDate.format('YYYY-MM-DD')
    }
    setHistoryFilterParams(queryParams)
    // Fetch data

    // TODO: uncomment when API is ready
    // if (queryMode === QUERY_HISTORY_ACTION.VIEW) {
    //   getBetHistory(queryParams)
    //     .then((data) => setData(data))
    //     .finally(() => setLoading(false))
    // } else if (queryMode === QUERY_HISTORY_ACTION.STATISTIC) {
    //   getDetailStatistics(queryParams)
    //     .then((data) => setData(data))
    //     .finally(() => setLoading(false))
    // }
  }, [])

  const handleClickExport = useCallback(() => {
    const delay = 50
    const lastActiveTab = historyActiveTab
    setHistoryActiveTab(TAB_KEYS.History.key)
    setTimeout(() => {
      if (historyCardRef.current) {
        exportComponentAsJPEG(historyCardRef).then(() => {
          setHistoryActiveTab(TAB_KEYS.Statistic.key)
          setTimeout(() => exportComponentAsJPEG(historyCardRef).then(() => setHistoryActiveTab(lastActiveTab)), delay)
        })
      }
    }, delay)
  }, [historyActiveTab])

  const handleChangeTab = useCallback((key: string) => {
    setHistoryActiveTab(key)
  }, [])

  const hasFetched = data !== undefined
  const isHistoryViewMode = hasFetched && queryMode === QueryHistoryAction.VIEW
  const isStatisticMode = hasFetched && queryMode === QueryHistoryAction.STATISTIC

  const combinedLoading = loading || recentBetLoading

  return (
    <>
      <BetHistoryFilter onSubmitFilter={handleSubmitFilter} onClickExport={handleClickExport} />
      {!hasFetched && !combinedLoading && (
        <div className={styles['list-player-asset-wrapper']}>
          <Collapse
            expandIconPosition='end'
            expandIcon={(panelProps) => {
              const Icon = panelProps.isActive ? DownCircleTwoTone : RightCircleTwoTone
              return <Icon className={styles['collapsible-arrow-icon']} twoToneColor='#52c41a' />
            }}
          >
            {playersWithSortedProfit.map((player) => {
              const hasBets = (playerRecentBets[player.playerId] || []).length > 0
              return (
                <Panel
                  showArrow={hasBets}
                  collapsible={hasBets ? undefined : 'disabled'}
                  header={<PlayerRecentBetsCollapsibleCard data={player} />}
                  key={player.playerId}
                  extra={
                    hasBets ? (
                      <div
                        style={{
                          position: 'absolute',
                          right: '8px',
                          top: '18px'
                        }}
                      >
                        <Badge count={playerRecentBets[player.playerId]?.length} color='#fe6300' size='small' />
                      </div>
                    ) : undefined
                  }
                >
                  <RecentUnfinishedBets data={playerRecentBets[player.playerId] || []} />
                </Panel>
              )
            })}
          </Collapse>
        </div>
      )}
      {combinedLoading && <CenterLoadingSpinner />}
      {isHistoryViewMode && (
        <HistoryCardWrapper
          data={data}
          historyFilterParams={historyFilterParams}
          historyActiveTab={historyActiveTab}
          onChangeHistoryActiveTab={handleChangeTab}
          cardRef={historyCardRef}
        />
      )}
      {isStatisticMode && <PlayerStatisticCard data={data} historyFilterParams={historyFilterParams} />}
    </>
  )
}
