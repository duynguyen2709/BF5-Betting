import { QuestionCircleOutlined } from '@ant-design/icons'
import { Button, Popconfirm, Table, Tag } from 'antd'
import React, { useMemo } from 'react'

import styles from './styles.module.css'
import { buildCommonTableColumn } from '../shared/BetHistoryTableColumn'
import { VerticalCenterRowCellWithDivider } from '../shared/VerticalCenterRowCellWithDivider'

import type { BetHistory, BetMatchDetail, Player } from '@/types'
import type { TableProps } from 'antd'

import { RAW_BET_STATUS } from '@/constants'
import { usePlayerQuery, useUpdateRawBetResultMutation } from '@/hooks'

const RawStatusTag: React.FC<{
  status: string
}> = ({ status }) => {
  const statusConfig = useMemo(
    () => ({
      [RAW_BET_STATUS.New]: {
        color: 'warning',
        text: 'Chưa Xử Lý'
      },
      [RAW_BET_STATUS.Inserted]: {
        color: 'cyan',
        text: (
          <p style={{ marginBottom: 0 }}>
            Đã Lưu Dữ Liệu
            <br />
            Chờ Kết Quả
          </p>
        )
      },
      [RAW_BET_STATUS.ResultReadyToBeUpdated]: {
        color: 'blue',
        text: (
          <p style={{ marginBottom: 0 }}>
            Đã Có Kết Quả
            <br />
            Chờ Cập Nhật
          </p>
        )
      },
      [RAW_BET_STATUS.Settled]: {
        color: 'success',
        text: 'Đã Hoàn Tất'
      }
    }),
    []
  )

  const config = statusConfig[status] || { color: undefined, text: status }
  return <Tag color={config.color}>{config.text}</Tag>
}

const ActionButtons: React.FC<{
  record: BetHistory
  onClickAdd: (bet: BetHistory) => void
  onConfirmUpdate: (bet: BetHistory) => void
}> = ({ record, onClickAdd, onConfirmUpdate }) => {
  if (record.rawStatus === RAW_BET_STATUS.New) {
    return (
      <Button type='primary' onClick={() => onClickAdd(record)}>
        Thêm Mới
      </Button>
    )
  }

  if (record.rawStatus === RAW_BET_STATUS.ResultReadyToBeUpdated) {
    return (
      <Popconfirm
        title='Xác Nhận ?'
        icon={<QuestionCircleOutlined style={{ color: 'red' }} />}
        onConfirm={() => onConfirmUpdate(record)}
      >
        <Button type='primary'>Cập Nhật</Button>
      </Popconfirm>
    )
  }

  return null
}

interface RawBetTableProps {
  data: BetHistory[]
  onClickAdd: (bet: BetHistory) => void
  onUpdateSuccess: () => void
  onSelectBatchBets: (bets: BetHistory[]) => void
}

export const RawBetTable: React.FC<RawBetTableProps> = ({ data, onClickAdd, onUpdateSuccess, onSelectBatchBets }) => {
  const { players } = usePlayerQuery()
  const { mutate: updateResultFromRaw } = useUpdateRawBetResultMutation()

  const handleUpdateResult = (bet: BetHistory) => {
    updateResultFromRaw(bet, {
      onSuccess: () => {
        onUpdateSuccess()
      }
    })
  }

  const hasScoreColumn = useMemo(() => data?.some((bet) => bet.events?.some((event) => event.score)), [data])

  const rowSelection = useMemo(
    () => ({
      onChange: (_: React.Key[], selectedRows: BetHistory[]) => {
        onSelectBatchBets(selectedRows)
      },
      getCheckboxProps: (record: BetHistory) => ({
        disabled: record.rawStatus !== RAW_BET_STATUS.New,
        rawStatus: record.rawStatus
      })
    }),
    [onSelectBatchBets]
  )

  const columns = useMemo(() => {
    const baseColumns = buildCommonTableColumn(players) as TableProps<BetHistory>['columns']
    const additionalColumns: TableProps<BetHistory>['columns'] = []
    const index = 4

    if (hasScoreColumn) {
      additionalColumns.push({
        title: 'Tỉ Số',
        key: 'score',
        width: 80,
        render: (_: unknown, record: BetHistory) =>
          record.events.map((event: BetMatchDetail, idx: number) => (
            <VerticalCenterRowCellWithDivider key={event.id} arrayLength={record.events.length} index={idx}>
              {event.score}
            </VerticalCenterRowCellWithDivider>
          ))
      })
    }

    additionalColumns.push(
      {
        title: 'Trạng Thái',
        key: 'rawStatus',
        width: 150,
        render: (_: unknown, record: BetHistory) => <RawStatusTag status={record.rawStatus} />
      },
      {
        title: 'Hành Động',
        key: 'action',
        width: 120,
        fixed: 'right',
        render: (_: unknown, record: BetHistory) => (
          <ActionButtons record={record} onClickAdd={onClickAdd} onConfirmUpdate={handleUpdateResult} />
        )
      }
    )

    return [...baseColumns!.slice(0, index), ...additionalColumns, ...baseColumns!.slice(index)]
  }, [players, hasScoreColumn, onClickAdd, onUpdateSuccess])

  return (
    <Table<BetHistory>
      className={styles['rawBetTable']}
      size='middle'
      rowKey='betId'
      bordered
      columns={columns}
      dataSource={data}
      rowSelection={{
        type: 'checkbox',
        ...rowSelection
      }}
      pagination={{
        defaultPageSize: 10,
        showSizeChanger: true,
        showTotal: (total) => `Tổng: ${total} cược`
      }}
      scroll={{
        x: 2000
      }}
    />
  )
}
