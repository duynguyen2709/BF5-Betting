import { Tag } from 'antd'
import React from 'react'

import type { TagProps } from 'antd'

import { BET_RESULT } from '@/constants'

interface BetResultTagProps {
  result: string
}

export const BetResultTag: React.FC<BetResultTagProps> = ({ result }) => {
  const betResultObj = Object.values(BET_RESULT).find((ele) => ele.result === result)
  let color: TagProps['color']
  switch (betResultObj) {
    case BET_RESULT.Win:
    case BET_RESULT.HalfWin:
      color = 'success'
      break
    case BET_RESULT.Lost:
    case BET_RESULT.HalfLost:
      color = 'error'
      break
    case BET_RESULT.Draw:
      color = 'processing'
      break
    default:
      color = 'warning'
  }
  return <Tag color={color}>{betResultObj?.text}</Tag>
}

export default BetResultTag
