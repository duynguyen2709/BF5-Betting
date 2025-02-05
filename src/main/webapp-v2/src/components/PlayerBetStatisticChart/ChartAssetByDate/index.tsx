import { Divider, Row } from 'antd'
import React from 'react'
import Chart from 'react-apexcharts'

import { ChartTitle } from '../ChartTitle'
import styles from './index.module.css'

import type { AssetByDate } from '@/types'

import { PaymentAction } from '@/constants/enums'

interface ChartAssetByDateProps {
  data: AssetByDate[]
  title: string
  width?: string | number
}

export const ChartAssetByDate: React.FC<ChartAssetByDateProps> = ({ data, title, width = '350' }) => {
  if (data.length === 0) {
    return null
  }

  const cashoutActions = data.filter(
    (ele) => ele.action === PaymentAction.CASHOUT || ele.action === PaymentAction.DEPOSIT
  )

  return (
    <>
      <ChartTitle text={title} />
      {cashoutActions.length > 0 && (
        <Row className={styles['row-cashout-legend']}>
          <div className={styles['red-circle-cashout-legend']} />
          <span className={styles['text-cashout']}>Thanh Toán (Nạp / Rút Tiền)</span>
        </Row>
      )}
      <Chart
        options={{
          annotations: {
            points: cashoutActions.map((action) => ({
              x: action.paymentTime.substring(0, 5),
              y: 0,
              marker: {
                size: 3,
                fillColor: '#fff',
                strokeColor: 'red',
                radius: 1
              }
            }))
          },
          chart: {
            toolbar: {
              show: false
            }
          },
          xaxis: {
            categories: data.map((ele) => ele.paymentTime.substring(0, 5)),
            tickAmount: data.length > 6 ? data.length / 3 : data.length
          },
          yaxis: {
            labels: {
              formatter: (value: number) => value.toLocaleString()
            }
          },
          stroke: {
            curve: 'smooth'
          },
          colors: ['#237804']
        }}
        series={[
          {
            name: 'Tài Sản',
            data: data.map((ele) => ele.assetAfter)
          }
        ]}
        type='line'
        width={width}
      />
      <Divider />
    </>
  )
}
