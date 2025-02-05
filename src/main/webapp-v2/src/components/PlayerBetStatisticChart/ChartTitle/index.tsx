import React from 'react'

import styles from './index.module.css'

interface ChartTitleProps {
  text: string
  style?: React.CSSProperties
}

export const ChartTitle: React.FC<ChartTitleProps> = ({ text, style }) => (
  <h2 className={styles['chart-title']} style={style}>
    {text}
  </h2>
)
