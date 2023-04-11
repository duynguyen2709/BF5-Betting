import React from "react";
import {Card, Divider, Empty} from "antd";
import {usePlayerContextHook} from "../../hooks";
import HistoryCardMetadata from "../HistoryCardMetadata";
import {
    ChartTitle,
    ChartTopWinRateByTournament,
    ChartWinRateByDate,
    ChartWinRateByTeam
} from "../PlayerBetStatisticChart";
import BetStatisticGroup from "./BetStatisticGroup";

import './index.scss'
import {MESSAGE} from "../../common/Constant";

const PlayerStatisticCard = ({data, historyFilterParams}) => {
    const {betHistoryList} = data
    const {players} = usePlayerContextHook()

    const isBetHistoryEmpty = betHistoryList && betHistoryList.length === 0


    return <Card className={"card-player-statistic"}>
        <HistoryCardMetadata players={players} data={historyFilterParams} style={{padding: '1rem 1rem 0'}}/>

        {isBetHistoryEmpty ?
            <Empty className={'card-bet-empty'} description={MESSAGE.EmptyBetReturned}/> :
            <>
                <Divider style={{margin: '1rem 0'}}/>
                <BetStatisticGroup data={betHistoryList} title={'Thống Kê Cược'}/>

                <Divider style={{margin: '1rem 0'}}/>
                <ChartTitle text={'Thống Kê Lợi Nhuận Theo Ngày'}/>
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
                <ChartWinRateByDate title={'Thống Kê Tỉ Lệ Thắng Theo Ngày'} data={betHistoryList}/>

                <Divider style={{margin: '1rem 0'}}/>
                <ChartTopWinRateByTournament title={'Thống Kê Kết Quả Theo Giải (Top 5)'} data={betHistoryList}/>
                
                <Divider style={{margin: '1rem 0'}}/>
                <ChartWinRateByTeam title={'Thống Kê Kết Quả Theo Đội (Top 5)'} data={betHistoryList}/>
            </>}
    </Card>
}

export default PlayerStatisticCard