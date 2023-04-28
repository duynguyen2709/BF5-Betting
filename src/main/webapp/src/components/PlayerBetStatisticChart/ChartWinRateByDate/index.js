import React from "react";
import Chart from "react-apexcharts";
import { BET_RESULT } from "../../../common/Constant";
import {
  filterBetResult,
  groupBetHistoriesByDate,
} from "../../../utils/BetHistoryUtil";
import ChartTitle from "../ChartTitle";
import { Divider } from "antd";

const calculateWinRateByDate = (betGroupByDate) => {
  const data = [];
  betGroupByDate.forEach((group, date) => {
    const totalBet = group.length;
    const totalWin = filterBetResult(group, [
      BET_RESULT.Win,
      BET_RESULT.HalfWin,
    ]).length;
    const totalDraw = filterBetResult(group, [BET_RESULT.Draw]).length;
    const totalUnfinished = filterBetResult(group, [
      BET_RESULT.Unfinished,
    ]).length;
    const totalWithoutDraw = group.length - totalDraw - totalUnfinished;
    const winRate =
      totalWithoutDraw > 0
        ? Math.round((totalWin * 100) / totalWithoutDraw)
        : undefined;
    if (totalUnfinished < totalBet) {
      data.push({ date, winRate });
    }
  });
  return data;
};

const ChartWinRateByDate = ({ data, title, width = "350" }) => {
  const betGroupByDate = groupBetHistoriesByDate(data);
  const winRateByDate = calculateWinRateByDate(betGroupByDate);

  if (winRateByDate.length === 0) {
    return null;
  }

  return (
    <>
      <ChartTitle text={title} />
      <Chart
        options={{
          chart: {
            toolbar: {
              show: false,
            },
          },
          xaxis: {
            categories: winRateByDate.map((ele) => ele.date),
            tickAmount:
              winRateByDate.length > 6
                ? winRateByDate.length / 3
                : winRateByDate.length,
          },
          yaxis: {
            max: 100,
            min: 0,
            tickAmount: 5,
            labels: {
              formatter: (value) => value.toFixed(0) + "%",
            },
          },
          stroke: {
            width: 3,
          },
          grid: {
            borderColor: "#e7e7e7",
            row: {
              colors: ["#f3f3f3", "transparent"],
              opacity: 0.5,
            },
          },
          markers: {
            size: 2,
            strokeColors: ["#002A81"],
          },
        }}
        series={[
          {
            data: winRateByDate.map((ele) => ele.winRate),
          },
        ]}
        type="line"
        width={width}
      />
      <Divider style={{ margin: "1rem 0" }} />
    </>
  );
};

export default ChartWinRateByDate;
