import { Result, Button } from 'antd'
import React from 'react'

import styles from './ErrorBoundary.module.css'

interface Props {
  children: React.ReactNode
  fallback?: React.ReactNode
}

interface State {
  hasError: boolean
  error?: Error
}

class ErrorBoundary extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props)
    this.state = { hasError: false }
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error }
  }

  override componentDidCatch(error: Error, errorInfo: React.ErrorInfo): void {
    console.error('Error caught by ErrorBoundary:', error, errorInfo)
  }

  handleReset = (): void => {
    this.setState({ hasError: false, error: undefined })
  }

  override render(): React.ReactNode {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback
      }

      return (
        <div className={styles['container']}>
          <Result
            status='error'
            title='Đã xảy ra lỗi'
            subTitle={this.state.error?.message || 'Vui lòng thử lại sau'}
            extra={[
              <Button key='reset' type='primary' onClick={this.handleReset}>
                Thử lại
              </Button>
            ]}
          />
        </div>
      )
    }

    return this.props.children
  }
}

export default ErrorBoundary
