import { Spin } from 'antd'

import styles from './index.module.css'

export function CenterLoadingSpinner() {
  return <Spin size='large' className={styles['center-loading-spinner']} />
}
