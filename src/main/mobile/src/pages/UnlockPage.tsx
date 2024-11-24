import { Button, Form, Input, message } from 'antd'
import { useUnlockHome } from '@/api/unlock'
import { isApiSuccess } from '@/utils/api'
import { MESSAGE } from '@/common/Constant'

type FieldType = {
  key: string
}

export default function UnlockPage({ onUnlockSuccess }: { onUnlockSuccess: (data: string) => Promise<void> }) {
  const [form] = Form.useForm<FieldType>()
  const { mutateAsync, isPending } = useUnlockHome()

  const handleSubmitUnlock = async (values: FieldType) => {
    try {
      const response = await mutateAsync(values.key)
      if (isApiSuccess(response)) {
        await onUnlockSuccess(response.data)
        form.resetFields()
        return
      }
      message.error(response.message)
    } catch (_) {
      message.error(MESSAGE.DefaultErrorMessage)
    }
  }

  return (
    <Form form={form} layout='horizontal' size='large' onFinish={handleSubmitUnlock} disabled={isPending}>
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
          loading={isPending}
          type='primary'
          htmlType='submit'
          style={{
            marginTop: '16px',
          }}
        >
          Đăng nhập
        </Button>
      </Form.Item>
    </Form>
  )
}
