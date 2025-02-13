import { Card, message, Tabs } from 'antd'

import styles from './styles.module.css'

import type { TabsProps } from 'antd'

import { AdminBetHistoryTable } from '@/components/AdminBetHistoryTable'
import { AdminPlayerAssetHistoryTable } from '@/components/AdminPlayerAssetHistoryTable'
import { AdminRawBetManagementTab } from '@/components/AdminRawBetManagementTab'
import { CenterLoadingSpinner } from '@/components/CenterLoadingSpinner'
import { MESSAGES } from '@/constants'
import { useAllAssetHistoryQuery, useAllBetHistoryQuery, usePlayerQuery } from '@/hooks'

export default function AdminPage() {
  const { data: betHistories, refetch: refetchBets } = useAllBetHistoryQuery()
  const { data: assetHistories, refetch: refetchAssets } = useAllAssetHistoryQuery()
  const { players, refetch: refetchPlayers } = usePlayerQuery()

  const handleUpdateBetSuccess = () => {
    message.success(MESSAGES.UPDATE_BET_SUCCESS)
    refetchBets()
    refetchAssets()
    refetchPlayers()
  }

  const handleRunStatisticSuccess = () => {
    message.success(MESSAGES.RUN_STATISTIC_SUCCESS)
    refetchAssets()
  }

  const items: TabsProps['items'] = [
    {
      label: 'Danh Sách Cược',
      key: '1',
      children: <AdminBetHistoryTable data={betHistories || []} onUpdateSuccess={handleUpdateBetSuccess} />
    },
    {
      label: 'Dữ Liệu Gốc',
      key: '2',
      children: <AdminRawBetManagementTab onSuccessAction={handleUpdateBetSuccess} />
    },
    {
      label: 'Lịch Sử Thanh Toán',
      key: '3',
      children: (
        <AdminPlayerAssetHistoryTable
          onStatisticSuccess={handleRunStatisticSuccess}
          data={assetHistories || []}
          refetch={refetchAssets}
        />
      )
    }
  ]

  if (!betHistories || !players) {
    return <CenterLoadingSpinner />
  }

  return (
    <div className={styles['adminTableWrapper']}>
      <Card>
        <Tabs type='card' items={items} />
      </Card>
    </div>
  )
}
