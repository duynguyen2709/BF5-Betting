import { Button, Form, Input, message } from 'antd'
import type { FormProps } from 'antd'
import { useUnlockHome } from '@/api/unlock'

type FieldType = {
  key?: string
}

export default function UnlockPage() {
  const [unlock] = useUnlockHome()

  const handleSubmitUnlock = () => {}

  return (
    <Form layout='horizontal' size='large' onFinish={handleSubmitUnlock}>
      <Form.Item<FieldType>
        label='Nhập mật khẩu:'
        name='key'
        rules={[{ required: true, message: 'Vui lòng nhập mật khẩu' }]}
      >
        <Input />
      </Form.Item>
      <Form.Item label={null}>
        <Button
          block
          loading={loading}
          type='primary'
          htmlType='submit'
          style={{
            marginTop: '16px'
          }}
        >
          Đăng nhập
        </Button>
      </Form.Item>
    </Form>
  )
}
