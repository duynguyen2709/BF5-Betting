import { Col, message, Modal, Row, Select } from 'antd'
import { useEffect, useState } from 'react'

import { BetHistoryCard } from '../BetHistoryCard'

import type { BetHistory } from '@/types/bet'
import type { SelectProps } from 'antd'

import { BET_RESULT, BetGroupTypeKey, BetResult, MESSAGES } from '@/constants'
import { useUpdateBetResultMutation } from '@/hooks/useBetHistoryQuery'
import { isAccumulatorBet, isSingleBet } from '@/utils/betHistory'

interface UpdateBetResultModalProps {
  data: BetHistory
  isOpen: boolean
  onUpdateSuccess: () => void
  onClose: () => void
}

export function UpdateBetResultModal({ data, isOpen, onUpdateSuccess, onClose }: UpdateBetResultModalProps) {
  const [result, setResult] = useState<BetResult>(BetResult.WIN)
  const [matchResults, setMatchResults] = useState<Record<number, BetResult>>({})
  const betType = isSingleBet(data) ? BetGroupTypeKey.Single : BetGroupTypeKey.Accumulator

  const { mutate: updateBetResult } = useUpdateBetResultMutation()

  useEffect(() => {
    if (data) {
      const eventResults: Record<number, BetResult> = {}
      data.events.forEach((event) => (eventResults[event.id] = event.result))
      setMatchResults(eventResults)
    }
  }, [data])

  const handleChangeMatchResult = (eventId: number, value: BetResult) => {
    setMatchResults((prev) => ({
      ...prev,
      [eventId]: value
    }))
  }

  const handleChangeResult = (value: BetResult) => {
    setResult(value)
  }

  const handleConfirmUpdate = () => {
    const updatedData = { ...data, result }
    if (isSingleBet(data)) {
      if (updatedData.events[0]) {
        updatedData.events[0].result = result
      }
    } else {
      for (const matchResult of Object.values(matchResults)) {
        if (matchResult === BetResult.NOT_FINISHED) {
          message.error(MESSAGES.SELECT_ALL_MATCH_RESULTS, 3)
          return
        }
      }

      for (const event of updatedData.events) {
        event.result = matchResults[event.id]!
      }
    }

    updateBetResult(updatedData, {
      onSuccess: onUpdateSuccess
    })
  }

  if (!data) {
    return null
  }

  const resultOptions: SelectProps['options'] = Object.values(BET_RESULT)
    .filter((ele) => ele.result !== BetResult.NOT_FINISHED)
    .map((ele) => ({
      label: ele.text,
      value: ele.result
    }))

  return (
    <Modal
      title='Cập Nhật Kết Quả Cược'
      destroyOnClose
      centered
      maskClosable={false}
      closable={false}
      open={isOpen}
      onOk={handleConfirmUpdate}
      onCancel={onClose}
    >
      <BetHistoryCard data={data} type={betType} isAdminView isHistoryViewMode={false} />
      {isAccumulatorBet(data) &&
        data.events.map((event, index) => (
          <Row key={event.id} style={{ alignItems: 'center', margin: '1rem 0.5rem 0 0.5rem' }}>
            <Col span={4}>{`Game ${index + 1}:`}</Col>
            <Col span={19} offset={1}>
              <Select
                allowClear={false}
                onChange={(value) => handleChangeMatchResult(event.id, value as BetResult)}
                style={{ width: '100%' }}
                options={resultOptions}
              />
            </Col>
          </Row>
        ))}
      {!isAccumulatorBet(data) && (
        <Row style={{ margin: '1rem 0.5rem 0 0.5rem', alignItems: 'center' }}>
          <Col span={4}>Kết quả:</Col>
          <Col span={19} offset={1}>
            <Select
              allowClear={false}
              onChange={(value) => handleChangeResult(value as BetResult)}
              style={{ width: '100%' }}
              defaultValue={result}
              options={resultOptions}
            />
          </Col>
        </Row>
      )}
    </Modal>
  )
}
