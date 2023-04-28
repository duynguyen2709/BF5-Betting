import React from "react";
import { Col, Divider, Row, Statistic } from "antd";
import { BET_RESULT } from "../../../common/Constant";
import { filterBetResult } from "../../../utils/BetHistoryUtil";
import { ChartTitle } from "../../PlayerBetStatisticChart";

const BetStatisticGroup = ({ data, title }) => {
  const totalWin = filterBetResult(data, [
    BET_RESULT.Win,
    BET_RESULT.HalfWin,
  ]).length;
  const totalDraw = filterBetResult(data, [BET_RESULT.Draw]).length;
  const totalLost = filterBetResult(data, [
    BET_RESULT.Lost,
    BET_RESULT.HalfLost,
  ]).length;
  const totalUnfinished = filterBetResult(data, [BET_RESULT.Unfinished]).length;
  const totalBetAmount = data
    .map((ele) => ele.betAmount)
    .reduce((prev, next) => prev + next, 0);
  const totalWithoutDraw = data.length - totalDraw - totalUnfinished;
  const winRate =
    totalWithoutDraw > 0
      ? Math.round((totalWin * 100) / totalWithoutDraw)
      : undefined;
  const actualProfit = data
    .map((ele) => ele.actualProfit ?? 0)
    .reduce((prev, next) => prev + next, 0);

  let winRateValueStyle;
  if (winRate > 0) {
    winRateValueStyle = { color: "green" };
  } else {
    winRateValueStyle = { color: "red" };
  }

  let actualProfitValueStyle = null;
  if (actualProfit > 0) {
    actualProfitValueStyle = { color: "green" };
  } else if (actualProfit < 0) {
    actualProfitValueStyle = { color: "red" };
  }

  return (
    <>
      <ChartTitle text={title} />
      <Row gutter={8} className={"row-bet-summary"}>
        <Col span={12}>
          <Statistic title="Tổng Số Cược" value={data.length} />
        </Col>
        <Col span={12}>
          <Statistic
            title="Tỉ Lệ Thắng"
            value={winRate}
            suffix={"%"}
            valueStyle={winRateValueStyle}
          />
        </Col>
        <Col span={24}>
          <Row justify={"space-between"} style={{ padding: "0 1rem" }}>
            <Statistic title="Thắng" value={totalWin} />
            <Statistic title="Hoà" value={totalDraw} />
            <Statistic title="Thua" value={totalLost} />
            <Statistic title="Chưa Hoàn Tất" value={totalUnfinished} />
          </Row>
        </Col>
        <Col span={12}>
          <Statistic
            title="Tổng Tiền Cược"
            value={`${totalBetAmount.toLocaleString()}đ`}
          />
        </Col>
        <Col span={12}>
          <Statistic
            title="Lợi Nhuận"
            value={actualProfit}
            suffix={"đ"}
            valueStyle={actualProfitValueStyle}
          />
        </Col>
      </Row>
      <Divider style={{ margin: "1rem 0" }} />
    </>
  );
};

export default BetStatisticGroup;
