import { Col, Row } from 'antd'
import React from 'react'

import { BatchInsertRawBetButton } from '../BatchInsertRawBetButton'
import { BatchUpdateRawBetButton } from '../BatchUpdateRawBetButton'
import { QueryRawBetInfoForm } from './QueryRawBetInfoForm'

import type { ActionBarProps } from './types'

export function ActionBar({
  form,
  loading,
  onFetchRawBetList,
  onQuickFetch,
  tableData,
  currentBatchAddBet,
  onClickAddBatch,
  onProcessSuccess
}: ActionBarProps): React.JSX.Element {
  return (
    <Row justify='space-between' style={{ marginBottom: '1rem' }}>
      <Col span={16}>
        <QueryRawBetInfoForm form={form} onFinish={onFetchRawBetList} onQuickFetch={onQuickFetch} loading={loading} />
      </Col>
      <Col span={8} style={{ display: 'flex', justifyContent: 'flex-end' }}>
        {currentBatchAddBet.length > 0 && (
          <BatchInsertRawBetButton data={tableData} onClickAddBatch={onClickAddBatch} />
        )}
        <BatchUpdateRawBetButton data={tableData} onSuccess={onProcessSuccess} />
      </Col>
    </Row>
  )
}
