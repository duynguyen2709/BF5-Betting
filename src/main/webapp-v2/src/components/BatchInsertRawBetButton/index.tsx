import { PlusOutlined } from '@ant-design/icons'
import { Button } from 'antd'

import type { BetHistory } from '@/types/bet'

interface BatchInsertRawBetButtonProps {
  data: BetHistory[]
  onClickAddBatch: (data: BetHistory[]) => void
}

export function BatchInsertRawBetButton({ data, onClickAddBatch }: BatchInsertRawBetButtonProps) {
  return (
    <Button type='primary' icon={<PlusOutlined />} onClick={() => onClickAddBatch(data)} style={{ marginRight: 8 }}>
      Thêm Tất Cả
    </Button>
  )
}
