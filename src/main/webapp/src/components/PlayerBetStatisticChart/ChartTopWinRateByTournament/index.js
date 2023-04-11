import Chart from "react-apexcharts";
import React from "react";
import ChartTitle from "../ChartTitle";
import {filterBetResult, groupBetHistoriesByTournament} from "../../../utils/BetHistoryUtil";
import {BET_RESULT} from "../../../common/Constant";

const calculateTopWinRateByTournament = (betGroupByTournament) => {
    const data = []
    betGroupByTournament.forEach((group, tournament) => {
        const totalBet = group.length
        const totalWin = filterBetResult(group, [BET_RESULT.Win, BET_RESULT.HalfWin]).length
        const totalLost = filterBetResult(group, [BET_RESULT.Lost, BET_RESULT.HalfLost]).length
        const totalDraw = filterBetResult(group, [BET_RESULT.Draw]).length
        const totalUnfinished = filterBetResult(group, [BET_RESULT.Unfinished]).length
        const totalWithoutDraw = group.length - totalDraw - totalUnfinished
        const winRate = totalWithoutDraw > 0 ? Math.round(totalWin * 100 / totalWithoutDraw) : undefined
        data.push({tournament, winRate, totalWin, totalLost, totalBet})
    })
    data.sort((a, b) => b.totalBet - a.totalBet)
    return data.slice(0, 5)
}

const ChartTopWinRateByTournament = ({data, title, width = "350"}) => {
    const betGroupByTournament = groupBetHistoriesByTournament(data)
    const topWinRateByTournament = calculateTopWinRateByTournament(betGroupByTournament)

    return <>
        <ChartTitle text={title}/>
        <Chart
            options={{
                chart: {
                    toolbar: {
                        show: false,
                    },
                },
                plotOptions: {
                    bar: {
                        horizontal: true,
                        barHeight: '100%',
                        dataLabels: {
                            position: 'top',
                        },
                    }
                },
                xaxis: {
                    categories: topWinRateByTournament.map(ele => ele.tournament),
                    labels: {
                        style: {
                            fontSize: '12px'
                        }
                    }
                },
                yaxis: {
                    forceNiceScale: true,
                    decimalsInFloat: 0,
                },
                stroke: {
                    colors: ["transparent"],
                    width: 2
                },
                colors: ['#008000', '#ff0000'],
                dataLabels: {
                    enabled: true,
                    offsetX: -2,
                    offsetY: -1,
                    style: {
                        fontSize: '11px',
                        colors: ['#fff']
                    }
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
                    name: "Thắng",
                    data: topWinRateByTournament.map(ele => ele.totalWin)
                },
                {
                    name: "Thua",
                    data: topWinRateByTournament.map(ele => ele.totalLost)
                }
            ]}
            type="bar"
            width={width}
        />
    </>
}

export default ChartTopWinRateByTournament