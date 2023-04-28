import React from "react";
import { Avatar, Card, Row, Statistic } from "antd";
import moment from "moment";

const { Meta } = Card;

const parseDateDescription = (startDate, endDate) => {
  const start = startDate && moment(startDate).format("DD/MM/YYYY");
  const end = endDate && moment(endDate).format("DD/MM/YYYY");
  if (start && end) {
    if (start === end) {
      return start;
    }
    return `${start} - ${end}`;
  } else {
    return start || end;
  }
};

const HistoryCardMetadata = ({ players, data, style }) => {
  const { playerId, startDate, endDate } = data;
  const actualPlayer = players?.[playerId];
  if (!players || !playerId || !actualPlayer) return null;

  const { totalProfit } = actualPlayer;
  const profitStyle = {
    fontSize: "15px",
  };
  if (totalProfit > 0) {
    profitStyle.color = "green";
  } else if (totalProfit < 0) {
    profitStyle.color = "red";
  }

  // TODO: Should not put profit in card history, should be separated into other statistic component
  const title = (
    <Row justify={"space-between"}>
      <span>{actualPlayer.playerName}</span>
      <Statistic
        value={actualPlayer.totalProfit}
        valueStyle={profitStyle}
        prefix={actualPlayer.totalProfit > 0 && "+"}
        suffix="đ"
      />
    </Row>
  );

  return (
    <Meta
      avatar={<Avatar src={actualPlayer.avatarUrl} size={48} />}
      title={title}
      description={parseDateDescription(startDate, endDate)}
      style={style}
    />
  );
};

export default HistoryCardMetadata;
