import React from "react";
import { Avatar, Card, Statistic } from "antd";

import "./index.scss";

const { Meta } = Card;

const PlayerCard = ({ data }) => {
  let valueStyle = null;
  if (data.totalProfit > 0) {
    valueStyle = { color: "green" };
  } else if (data.totalProfit < 0) {
    valueStyle = { color: "red" };
  }
  return (
    <Card className={"card-player"}>
      <Meta
        avatar={<Avatar src={data.avatarUrl} size={48} />}
        title={data.playerName}
        description={
          <Statistic
            value={data.totalProfit}
            valueStyle={valueStyle}
            prefix={data.totalProfit > 0 && "+"}
            suffix="đ"
          />
        }
      />
    </Card>
  );
};

export default PlayerCard;
