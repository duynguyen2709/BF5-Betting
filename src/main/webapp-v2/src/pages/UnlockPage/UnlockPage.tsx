import { useUnlock } from '@/api/auth'
import { MESSAGES } from '@/constants'
import { Button, Form, Input, message } from 'antd'
import styles from './UnlockPage.module.css'
import { useEffect, useState } from 'react'

interface UnlockPageProps {
  onUnlock: (userId: string) => void
}

interface UnlockFormValues {
  key: string
}

function UnlockPage({ onUnlock }: UnlockPageProps) {
  const [form] = Form.useForm<UnlockFormValues>()
  const [errorMessage, setErrorMessage] = useState('')
  const { mutateAsync: unlock, isPending, error } = useUnlock()

  useEffect(() => {
    if (error && error.message) {
      setErrorMessage(error.message)
    }
  }, [error])

  const handleChangePassword = (text: string) => {
    if (errorMessage) {
      setErrorMessage('')
    }
    form.setFieldsValue({ key: text })
  }


  const handleSubmitForm = async (values: UnlockFormValues) => {
    await form.validateFields();
    const userId = await unlock(values)
      if (!userId || typeof userId === 'object') {
        message.error(MESSAGES.LOGIN_FAILED)
        return
      }
      message.success(MESSAGES.LOGIN_SUCCESS)
      onUnlock(userId)
  }

  return (
    <div className={styles['unlockFormContainer']}>
      <Form<UnlockFormValues> 
        layout='vertical' 
        form={form} 
        size='large' 
        onFinish={handleSubmitForm}
        className={styles['unlockForm']}
      >
        <Form.Item
          name='key'
          label='Nhập mật khẩu:'
          rules={[
            {
              required: true,
              message: 'Vui lòng nhập mật khẩu'
            }
          ]}
        >
          <Input.Password onChange={(e) => handleChangePassword(e.target.value)} />
        </Form.Item>

        {errorMessage && (
          <div className={styles['formError']}>
            {errorMessage}
          </div>
        )}

        <Form.Item>
          <Button 
            type='primary' 
            htmlType='submit' 
            loading={isPending} 
            block
          >
            Đăng nhập
          </Button>
        </Form.Item>
      </Form>
    </div>
  )
}

export default UnlockPage
