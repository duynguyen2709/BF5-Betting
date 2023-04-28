import React from "react";
import { Card, Divider, Empty } from "antd";
import { MESSAGE } from "../../common/Constant";
import { usePlayerContextHook } from "../../hooks";
import { isAllUnfinishedBets } from "../../utils/BetHistoryUtil";
import HistoryCardMetadata from "../HistoryCardMetadata";
import {
  ChartAssetByDate,
  ChartTopWinRateByTeam,
  ChartTopWinRateByTournament,
  ChartWinRateByDate,
  ChartWinRateByTeam,
} from "../PlayerBetStatisticChart";
import BetStatisticGroup from "./BetStatisticGroup";

import "./index.scss";

const PlayerStatisticCard = ({ data, historyFilterParams }) => {
  const { assetByDateList, betHistoryList } = data;
  const { players } = usePlayerContextHook();

  const isBetHistoryEmpty = betHistoryList && betHistoryList.length === 0;
  const allUnfinishedBets = isAllUnfinishedBets(betHistoryList);

  const CardStatisticContent = () => {
    if (isBetHistoryEmpty) {
      return (
        <Empty
          className={"card-bet-empty"}
          description={MESSAGE.EmptyBetReturned}
        />
      );
    } else if (allUnfinishedBets) {
      return (
        <Empty
          className={"card-bet-empty"}
          description={MESSAGE.AllBetUnfinished}
        />
      );
    } else {
      return (
        <>
          <Divider style={{ margin: "1rem 0" }} />
          <BetStatisticGroup title={"Thống Kê Cược"} data={betHistoryList} />
          <ChartAssetByDate
            title={"Thống Kê Tài Sản Theo Ngày"}
            data={assetByDateList}
          />
          <ChartWinRateByDate
            title={"Thống Kê Tỉ Lệ Thắng Theo Ngày"}
            data={betHistoryList}
          />
          <ChartTopWinRateByTournament
            title={"Thống Kê Kết Quả Theo Giải (Top 5)"}
            data={betHistoryList}
          />
          <ChartTopWinRateByTeam
            title={"Thống Kê Kết Quả Theo Đội (Top 5)"}
            data={betHistoryList}
          />
          <ChartWinRateByTeam
            title={"Xem Thống Kê Theo Đội"}
            data={betHistoryList}
          />
        </>
      );
    }
  };

  return (
    <Card className={"card-player-statistic"}>
      <HistoryCardMetadata
        players={players}
        data={historyFilterParams}
        style={{ padding: "1rem 1rem 0" }}
      />
      <CardStatisticContent />
    </Card>
  );
};

export default PlayerStatisticCard;
