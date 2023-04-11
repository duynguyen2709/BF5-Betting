import Chart from "react-apexcharts";
import React from "react";
import ChartTitle from "../ChartTitle";

const ChartTopWinRateByTournament = ({data, title, width = "350"}) => {
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
                    categories: data.map(ele => ele.team),
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
                    data: data.map(ele => ele.totalWin)
                },
                {
                    name: "Thua",
                    data: data.map(ele => ele.totalLost)
                }
            ]}
            type="bar"
            width={width}
        />
    </>
}

export default ChartTopWinRateByTournament