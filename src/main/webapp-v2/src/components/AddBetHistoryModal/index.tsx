import { Avatar, Col, Modal, Row, Select, Table } from 'antd'
import React, { useState } from 'react'

import styles from './styles.module.css'
import { buildCommonTableColumn } from '../shared/BetHistoryTableColumn'

import type { BetHistory } from '@/types/bet'

import { usePlayerQuery } from '@/hooks'
import { useInsertBatchBetHistoryMutation, useInsertBetHistoryMutation } from '@/hooks/useBetHistoryQuery'

interface AddBetHistoryModalProps {
  data: BetHistory | BetHistory[]
  isOpen: boolean
  onUpdateSuccess: () => void
  onClose: () => void
}

const buildTableColumns = (players: Record<string, any>) => {
  const columns = buildCommonTableColumn(players)!
  columns.shift()
  return columns
}

export const AddBetHistoryModal: React.FC<AddBetHistoryModalProps> = ({ data, isOpen, onUpdateSuccess, onClose }) => {
  const { players } = usePlayerQuery()
  const [selectedPlayer, setSelectedPlayer] = useState<string>()
  const { mutate: insertSingle, isPending: isSinglePending } = useInsertBetHistoryMutation()
  const { mutate: insertBatch, isPending: isBatchPending } = useInsertBatchBetHistoryMutation()

  const isBatchMode = Array.isArray(data)
  const isPending = isBatchMode ? isBatchPending : isSinglePending
  const tableData = isBatchMode ? data : [data]

  const handleSuccess = () => {
    onUpdateSuccess()
    onClose()
  }

  const handleChangePlayer = (value: string) => {
    setSelectedPlayer(value)
  }

  const handleConfirmAdd = () => {
    if (!selectedPlayer) {
      return
    }

    if (isBatchMode) {
      const batchData = (data as BetHistory[]).map((bet) => ({
        ...bet,
        playerId: selectedPlayer
      }))
      insertBatch(batchData, { onSuccess: handleSuccess })
    } else {
      const singleData = {
        ...(data as BetHistory),
        playerId: selectedPlayer
      }
      insertSingle(singleData, { onSuccess: handleSuccess })
    }
  }

  const columns = buildTableColumns(players)

  const tablePagination = isBatchMode ? { showTotal: (total: number) => `Tổng: ${total} cược` } : false

  return (
    <Modal
      title='Thêm Cược Mới'
      destroyOnClose
      centered
      maskClosable={false}
      closable={false}
      open={isOpen}
      onOk={handleConfirmAdd}
      onCancel={onClose}
      width='80vw'
      confirmLoading={isPending}
    >
      <Table
        size='small'
        className={styles['tableBetHistory']}
        rowKey='betId'
        bordered
        columns={columns}
        dataSource={tableData}
        pagination={tablePagination}
      />
      <Row style={{ alignItems: 'center', margin: '1rem 0.5rem 0 0.5rem' }}>
        <Col span={2}>Người Cược:</Col>
        <Col span={4}>
          <Select allowClear={false} value={selectedPlayer} onChange={handleChangePlayer} style={{ width: '100%' }}>
            {Object.values(players).map((player) => (
              <Select.Option key={player.playerId} value={player.playerId}>
                <Row>
                  <Avatar src={player.avatarUrl} style={{ marginRight: 8 }} />
                  <span>{player.playerName}</span>
                </Row>
              </Select.Option>
            ))}
          </Select>
        </Col>
      </Row>
    </Modal>
  )
}
