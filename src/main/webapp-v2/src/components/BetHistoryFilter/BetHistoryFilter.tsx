import { useMediaQuery } from '@/hooks/useMediaQuery'
import { usePlayerQuery } from '@/hooks/usePlayerQuery'
import { Button, DatePicker, Form, Select, Space } from 'antd'
import type { Dayjs } from 'dayjs'
import styles from './BetHistoryFilter.module.css'

const { RangePicker } = DatePicker

interface BetHistoryFilterProps {
  onFilter: (values: FilterValues) => void
  loading?: boolean
}

interface FilterValues {
  dateRange?: [Dayjs, Dayjs]
  playerId?: string
}

function BetHistoryFilter({ onFilter, loading }: BetHistoryFilterProps) {
  const { players } = usePlayerQuery()
  const [form] = Form.useForm<FilterValues>()
  const isMobile = useMediaQuery('(max-width: 428px)')

  const handleFilter = (values: FilterValues) => {
    onFilter(values)
  }

  const handleReset = () => {
    form.resetFields()
    onFilter({
      
    })
  }

  return (
    <Form form={form} onFinish={handleFilter} className={styles['form']} layout={isMobile ? 'vertical' : 'inline'}>
      <Form.Item name='dateRange' className={styles['formItem']}>
        <RangePicker
          showTime
          placeholder={['Từ ngày', 'Đến ngày']}
          style={{ width: isMobile ? '100%' : 280 }}
          size={isMobile ? 'middle' : 'large'}
        />
      </Form.Item>

      <Form.Item name='playerId' className={styles['formItem']}>
        <Select
          placeholder='Chọn người chơi'
          allowClear
          style={{ width: isMobile ? '100%' : 200 }}
          size={isMobile ? 'middle' : 'large'}
        >
          {Object.entries(players).map(([id, player]) => (
            <Select.Option key={id} value={id}>
              {player.playerName}
            </Select.Option>
          ))}
        </Select>
      </Form.Item>

      <Form.Item className={styles['formItem']}>
        <Space>
          <Button type='primary' htmlType='submit' loading={loading} size={isMobile ? 'middle' : 'large'}>
            Lọc
          </Button>
          <Button onClick={handleReset} size={isMobile ? 'middle' : 'large'}>
            Đặt lại
          </Button>
        </Space>
      </Form.Item>
    </Form>
  )
}

export default BetHistoryFilter
