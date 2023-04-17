import React from "react";
import ChartTitle from "../ChartTitle";
import {Divider} from "antd";

const ChartAssetByDate = ({data, title, width = '350'}) => {
    return <>
        <ChartTitle text={title}/>
        <h1 style={{padding: '2rem', color: 'red'}}>Chưa Làm Xong</h1>
        {/*<Row className={"row-chart-profit"}>*/}
        {/*    <Chart*/}
        {/*        options={{*/}
        {/*            chart: {*/}
        {/*                id: "profit-by-date-line-chart"*/}
        {/*            },*/}
        {/*            xaxis: {*/}
        {/*                type: 'category',*/}
        {/*            },*/}
        {/*            yaxis: {*/}
        {/*                labels: {*/}
        {/*                    forceNiceScale: true,*/}
        {/*                    max: 2_000_000,*/}
        {/*                    min: -2_000_000,*/}
        {/*                    tickAmount: 10,*/}
        {/*                    formatter: (value) => `${value.toFixed(0)}đ`*/}
        {/*                },*/}
        {/*            }*/}
        {/*        }}*/}
        {/*        series={[*/}
        {/*            {*/}
        {/*                data: assetByDateList.map(ele => ({*/}
        {/*                    x: ele.betDate.substring(0, 5),*/}
        {/*                    y: ele.assetAfter*/}
        {/*                }))*/}
        {/*            }*/}
        {/*        ]}*/}
        {/*        type="line"*/}
        {/*        width="350"*/}
        {/*    />*/}
        {/*</Row>*/}

        <Divider style={{margin: '1rem 0'}}/>
    </>
}

export default ChartAssetByDate