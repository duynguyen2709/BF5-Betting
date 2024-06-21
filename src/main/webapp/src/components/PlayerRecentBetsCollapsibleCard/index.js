import React from "react";
import { Avatar, Statistic } from "antd";

import "./index.scss";

const PlayerRecentBetsCollapsibleCard = ({ data: player }) => {
  let valueStyle = null;
  if (player.totalProfit > 0) {
    valueStyle = { color: "green" };
  } else if (player.totalProfit < 0) {
    valueStyle = { color: "red" };
  }

  return (
    <div className="header-row">
      <div className="header-avatar">
        <Avatar src={player.avatarUrl} size={48} />
      </div>
      <div className="header-detail">
        <div className="header-player-name">{player.playerName}</div>
        <Statistic
          value={player.totalProfit}
          valueStyle={valueStyle}
          prefix={player.totalProfit > 0 && "+"}
          suffix="đ"
        />
      </div>
    </div>
  );
};

export default PlayerRecentBetsCollapsibleCard;
