import { Button, Result } from 'antd'
import { useNavigate } from 'react-router-dom'
import { ROUTES } from '@/constants'

function NotFound() {
  const navigate = useNavigate()

  const handleBackHome = () => {
    navigate(ROUTES.Base.path)
  }

  return (
    <Result
      status='404'
      title='404'
      subTitle='Sorry, the page you visited does not exist.'
      extra={
        <Button type='primary' onClick={handleBackHome}>
          Back Home
        </Button>
      }
    />
  )
}

export default NotFound
