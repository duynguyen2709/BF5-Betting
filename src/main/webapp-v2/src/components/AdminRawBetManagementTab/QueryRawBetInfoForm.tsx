import { Button, DatePicker, Form, Input, Space, Spin } from 'antd'
import dayjs from 'dayjs'

import type { QueryRawBetFormValues } from '@/types/rawBet'
import type { FormInstance } from 'antd'
import type { RangePickerProps } from 'antd/es/date-picker'

const { RangePicker } = DatePicker

interface QueryRawBetInfoFormProps {
  form: FormInstance<QueryRawBetFormValues>
  onFinish: (values: QueryRawBetFormValues) => void
  onQuickFetch: () => void
  loading?: boolean
}

export function QueryRawBetInfoForm({ form, onFinish, onQuickFetch, loading = false }: QueryRawBetInfoFormProps) {
  const disabledDate: RangePickerProps['disabledDate'] = (current) => current && current > dayjs().endOf('day')

  return (
    <Form form={form} onFinish={onFinish} layout='inline'>
      <Form.Item name='sessionToken' label='Token' style={{ minWidth: 300 }}>
        <Input />
      </Form.Item>
      <Form.Item
        name='dateRange'
        label='Thời Gian'
        rules={[{ required: true, message: 'Vui lòng chọn khoảng thời gian' }]}
      >
        <RangePicker format='DD/MM/YYYY' disabledDate={disabledDate} style={{ width: '100%' }} />
      </Form.Item>
      <Form.Item>
        {!loading && (
          <Space>
            <Button type='primary' htmlType='submit' loading={loading}>
              Lấy Dữ Liệu
            </Button>
            <Button ghost type='primary' onClick={onQuickFetch} loading={loading}>
              Lấy Nhanh
            </Button>
          </Space>
        )}
      </Form.Item>
    </Form>
  )
}
