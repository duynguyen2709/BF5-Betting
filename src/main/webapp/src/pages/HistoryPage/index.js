import React, { useCallback, useRef, useState } from "react";
import { Badge, Collapse } from "antd";
import { exportComponentAsJPEG } from "react-component-export-image";
import { getBetHistory } from "../../apis/BetHistoryApi";
import { getDetailStatistics } from "../../apis/StatisticApi";
import { QUERY_HISTORY_ACTION } from "../../common/Constant";
import BetHistoryFilter from "../../components/BetHistoryFilter";
import HistoryCardWrapper from "../../components/HistoryCardWrapper";

import "./index.scss";
import PlayerStatisticCard from "../../components/PlayerStatisticCard";
import { usePlayerContextHook } from "../../hooks";
import CenterLoadingSpinner from "../../components/CenterLoadingSpinner";
import { useRecentBets } from "../../hooks/useRecentBets";
import RecentUnfinishedBets from "../../components/RecentUnfinishedBets";
import PlayerRecentBetsCollapsibleCard from "../../components/PlayerRecentBetsCollapsibleCard";
import { DownCircleTwoTone, RightCircleTwoTone } from "@ant-design/icons";

const { Panel } = Collapse;

const TAB_KEYS = {
  History: {
    label: "Danh Sách Cược",
    key: "history",
  },
  Statistic: {
    label: "Thống Kê",
    key: "statistic",
  },
};

const DEFAULT_HISTORY_FILTER_PARAMS = {
  playerId: "",
  startDate: null,
  endDate: null,
};

function sortPlayerByProfitDesc(players) {
  const playerArray = Object.values(players);
  playerArray.sort((a, b) => b.totalProfit - a.totalProfit);
  return playerArray;
}

const HistoryPage = () => {
  const historyCardRef = useRef();
  const [loading, setLoading] = useState(false);
  const [historyActiveTab, setHistoryActiveTab] = useState(
    TAB_KEYS.History.key
  );
  const [data, setData] = useState(undefined);
  const [queryMode, setQueryMode] = useState(QUERY_HISTORY_ACTION.View);
  const [historyFilterParams, setHistoryFilterParams] = useState(
    DEFAULT_HISTORY_FILTER_PARAMS
  );
  const { players } = usePlayerContextHook();
  const playersWithSortedProfit = sortPlayerByProfitDesc(players);

  const { playerRecentBets, recentBetLoading } = useRecentBets();

  const handleSubmitFilter = useCallback((fieldsValue, queryMode) => {
    setLoading(true);
    // Reset current filter & data
    setQueryMode(queryMode);
    setData(undefined);
    setHistoryFilterParams(DEFAULT_HISTORY_FILTER_PARAMS);
    // Parse new filter params
    const { playerId, startDate, endDate } = fieldsValue;
    const queryParams = {
      playerId,
      startDate: startDate.format("YYYY-MM-DD"),
      endDate: endDate.format("YYYY-MM-DD"),
    };
    setHistoryFilterParams(queryParams);
    // Fetch data
    if (queryMode === QUERY_HISTORY_ACTION.View) {
      getBetHistory(queryParams)
        .then((data) => setData(data))
        .finally(() => setLoading(false));
    } else if (queryMode === QUERY_HISTORY_ACTION.Statistic) {
      getDetailStatistics(queryParams)
        .then((data) => setData(data))
        .finally(() => setLoading(false));
    }
  }, []);

  const handleClickExport = useCallback(() => {
    const delay = 50;
    const lastActiveTab = historyActiveTab;
    setHistoryActiveTab(TAB_KEYS.History.key);
    setTimeout(() => {
      exportComponentAsJPEG(historyCardRef).then(() => {
        setHistoryActiveTab(TAB_KEYS.Statistic.key);
        setTimeout(
          () =>
            exportComponentAsJPEG(historyCardRef).then(() =>
              setHistoryActiveTab(lastActiveTab)
            ),
          delay
        );
      });
    }, delay);
  }, [historyActiveTab]);

  const handleChangeTab = useCallback((key) => {
    setHistoryActiveTab(key);
  }, []);

  const hasFetched = data !== undefined;
  const isHistoryViewMode =
    hasFetched && queryMode === QUERY_HISTORY_ACTION.View;
  const isStatisticMode =
    hasFetched && queryMode === QUERY_HISTORY_ACTION.Statistic;

  const combinedLoading = loading || recentBetLoading;

  return (
    <>
      <BetHistoryFilter
        onSubmitFilter={handleSubmitFilter}
        onClickExport={handleClickExport}
      />
      {!hasFetched && !combinedLoading && (
        <div className="list-player-asset-wrapper">
          <Collapse
            expandIconPosition="end"
            expandIcon={(panelProps) => {
              const Icon = panelProps.isActive
                ? DownCircleTwoTone
                : RightCircleTwoTone;
              return (
                <Icon
                  width={20}
                  height={20}
                  style={{ fontSize: "20px" }}
                  twoToneColor="#52c41a"
                />
              );
            }}
          >
            {playersWithSortedProfit.map((player) => {
              const hasBets =
                (playerRecentBets[player.playerId] &&
                  playerRecentBets[player.playerId].length > 0) ||
                false;

              return (
                <Panel
                  showArrow={hasBets}
                  collapsible={hasBets}
                  header={<PlayerRecentBetsCollapsibleCard data={player} />}
                  key={player.playerId}
                  extra={
                    hasBets ? (
                      <div
                        style={{
                          position: "absolute",
                          right: "8px",
                          top: "18px",
                        }}
                      >
                        <Badge
                          count={playerRecentBets[player.playerId].length}
                          color="#fe6300"
                          size="small"
                        />
                      </div>
                    ) : undefined
                  }
                >
                  <RecentUnfinishedBets
                    data={playerRecentBets[player.playerId]}
                  />
                </Panel>
              );
            })}
          </Collapse>
        </div>
      )}
      {combinedLoading && <CenterLoadingSpinner />}
      {isHistoryViewMode && (
        <HistoryCardWrapper
          data={data}
          historyFilterParams={historyFilterParams}
          historyActiveTab={historyActiveTab}
          onChangeHistoryActiveTab={handleChangeTab}
          cardRef={historyCardRef}
        />
      )}
      {isStatisticMode && (
        <PlayerStatisticCard
          data={data}
          historyFilterParams={historyFilterParams}
        />
      )}
    </>
  );
};

export default HistoryPage;
