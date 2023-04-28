import React, { useCallback, useState } from "react";
import { Col, Row, Select } from "antd";
import Chart from "react-apexcharts";
import { BET_RESULT } from "../../../common/Constant";
import {
  filterBetResult,
  getDistinctTeamName,
} from "../../../utils/BetHistoryUtil";
import ChartTitle from "../ChartTitle";

const calculateWinRateOfSingleTeam = (betHistoryList, team) => {
  const betsOfTeam = [];
  for (let bet of betHistoryList) {
    for (let event of bet.events) {
      if (event.firstTeam === team || event.secondTeam === team) {
        betsOfTeam.push(event);
      }
    }
  }

  const totalWin = filterBetResult(betsOfTeam, [
    BET_RESULT.Win,
    BET_RESULT.HalfWin,
  ]).length;
  const totalLost = filterBetResult(betsOfTeam, [
    BET_RESULT.Lost,
    BET_RESULT.HalfLost,
  ]).length;
  const totalDraw = filterBetResult(betsOfTeam, [BET_RESULT.Draw]).length;
  const totalUnfinished = filterBetResult(betsOfTeam, [
    BET_RESULT.Unfinished,
  ]).length;
  const totalWithoutDraw = betsOfTeam.length - totalDraw - totalUnfinished;
  const winRate =
    totalWithoutDraw > 0
      ? Math.round((totalWin * 100) / totalWithoutDraw)
      : undefined;
  return { winRate, totalWin, totalLost, totalDraw, totalUnfinished };
};

const ChartWinRateByTeam = ({ data, title }) => {
  const [selectedTeam, setSelectedTeam] = useState("");
  const [winRate, setWinRate] = useState({
    winRate: 0,
    totalWin: 0,
    totalLost: 0,
  });

  const onChangeTeam = useCallback(
    (value) => {
      setSelectedTeam(value);
      if (value) {
        const winRate = calculateWinRateOfSingleTeam(data, value);
        setWinRate(winRate);
      }
    },
    [data]
  );

  const teams = Array.from(getDistinctTeamName(data));

  return (
    <>
      <ChartTitle text={title} />
      <Row className={"row-chart-win-rate-by-team"}>
        <Row style={{ width: "100%" }}>
          <Col span={6} className={"label-team-select"}>
            <p>Chọn Đội:</p>
          </Col>
          <Col span={18}>
            <Select
              showSearch={true}
              allowClear={false}
              style={{ width: "100%" }}
              value={selectedTeam}
              onChange={onChangeTeam}
            >
              {teams.map((team) => (
                <Select.Option value={team} key={team}></Select.Option>
              ))}
            </Select>
          </Col>
        </Row>
        {selectedTeam !== "" && (
          <Chart
            options={{
              chart: {
                id: "win-rate-by-team-bar-chart",
                toolbar: {
                  show: false,
                },
              },
              plotOptions: {
                bar: {
                  columnWidth: "80%",
                  dataLabels: {
                    position: "top",
                  },
                },
              },
              xaxis: {
                categories: [selectedTeam],
                labels: {
                  style: {
                    fontSize: "14px",
                  },
                },
              },
              yaxis: {
                forceNiceScale: true,
                decimalsInFloat: 0,
              },
              stroke: {
                width: 1,
                colors: ["#fff"],
              },
              colors: ["#008000", "#ff0000", "#1677ff", "#faad14"],
              dataLabels: {
                enabled: true,
                style: {
                  fontSize: "16px",
                  colors: ["#fff"],
                },
              },
            }}
            series={[
              {
                name: "Thắng",
                data: [winRate.totalWin],
              },
              {
                name: "Thua",
                data: [winRate.totalLost],
              },
              {
                name: "Hoà",
                data: [winRate.totalDraw],
              },
              {
                name: "Chưa Hoàn Tất",
                data: [winRate.totalUnfinished],
              },
            ]}
            type="bar"
            width="320"
          />
        )}
      </Row>
    </>
  );
};

export default ChartWinRateByTeam;
