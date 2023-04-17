import React from "react";
import ChartTitle from "../ChartTitle";
import {Divider, Row} from "antd";
import Chart from "react-apexcharts";

import './index.scss'

const ChartAssetByDate = ({data, title, width = '350'}) => {
    if (data.length === 0) {
        return null
    }

    const cashoutActions = data.filter(ele => ele.action === 'CASHOUT' || ele.action === 'DEPOSIT')

    return <>
        <ChartTitle text={title}/>
        {cashoutActions.length > 0 && <Row className={'row-cashout-legend'}>
            <div className='red-circle-cashout-legend'/>
            <span className={'text-cashout'}>Thanh Toán (Nạp / Rút Tiền)</span>
        </Row>}
        <Chart
            options={{
                annotations: {
                    points: cashoutActions.map(action => ({
                        key: action.id,
                        x: action.paymentTime.substring(0, 5),
                        y: 0,
                        marker: {
                            size: 3,
                            fillColor: '#fff',
                            strokeColor: 'red',
                            radius: 1,
                        },
                    }))
                },
                chart: {
                    toolbar: {
                        show: false,
                    }
                },
                xaxis: {
                    categories: data.map(ele => ele.paymentTime.substring(0, 5)),
                    tickAmount: data.length > 6 ? (data.length / 3) : data.length
                },
                yaxis: {
                    labels: {
                        formatter: (value) => `${value.toLocaleString()}đ`,
                    },
                },
                stroke: {
                    width: 3
                },
                grid: {
                    borderColor: '#e7e7e7',
                    row: {
                        colors: ['#f3f3f3', 'transparent'],
                        opacity: 0.5
                    },
                },
            }}
            series={[
                {
                    data: data.map(ele => ele.assetAfter)
                }
            ]}
            type="line"
            width={width}
        />
        <Divider style={{margin: '1rem 0'}}/>
    </>;
}

export default ChartAssetByDate