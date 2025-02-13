import { Typography } from 'antd'

interface MoneyTextCellProps {
  value: number | undefined
}

export function MoneyTextCell({ value }: MoneyTextCellProps) {
  const { Text } = Typography
  if (value === null || value === undefined) {
    return null
  }

  const valueStyle = value > 0 ? { color: 'green' } : value < 0 ? { color: 'red' } : undefined
  return (
    <Text style={valueStyle}>
      {value > 0 ? '+' : ''}
      {value.toLocaleString()}đ
    </Text>
  )
}
