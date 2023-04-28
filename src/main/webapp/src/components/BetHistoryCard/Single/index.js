import React from "react";
import { Card } from "antd";
import { BET_RESULT } from "../../../common/Constant";
import { parseBetEvent } from "../../../utils/BetHistoryUtil";
import BetResultTag from "../../BetResultTag";
import { BetHistoryCardTitle, BetHistoryDetailRow } from "../Common";

import "./index.scss";

const SingleBetHistoryCard = ({ data }) => {
  const event = data?.events[0];
  return (
    <Card
      title={<BetHistoryCardTitle data={event} />}
      bordered={true}
      className={"card-bet-history"}
      bodyStyle={{ padding: "0.5rem 1rem 0.5rem" }}
    >
      <BetHistoryDetailRow left={"Loại Cược:"} right={parseBetEvent(event)} />
      <BetHistoryDetailRow
        left={"Tiền Cược:"}
        right={`${data.betAmount.toLocaleString()}đ`}
      />
      <BetHistoryDetailRow left={"Tỉ Lệ:"} right={data.ratio} />
      {event.score && (
        <BetHistoryDetailRow
          left={"Tỉ Số:"}
          right={event.score}
          rightStyle={{ color: "#0c5a9d" }}
        />
      )}
      {data.result === BET_RESULT.Unfinished.result ? (
        <BetHistoryDetailRow
          left={"Tiền Lời:"}
          right={`${data.potentialProfit.toLocaleString()}đ`}
        />
      ) : null}
      <BetHistoryDetailRow
        left={"Kết Quả:"}
        right={<BetResultTag result={data.result} />}
      />
      {data.result === BET_RESULT.Win.result ||
      data.result === BET_RESULT.HalfWin.result ? (
        <BetHistoryDetailRow
          left={"Tiền Lời:"}
          right={`${data.actualProfit.toLocaleString()}đ`}
        />
      ) : null}
      {data.result === BET_RESULT.Lost.result ||
      data.result === BET_RESULT.HalfLost.result ? (
        <BetHistoryDetailRow
          left={"Tiền Lỗ:"}
          right={`${data.actualProfit.toLocaleString()}đ`}
        />
      ) : null}
    </Card>
  );
};

export default SingleBetHistoryCard;
