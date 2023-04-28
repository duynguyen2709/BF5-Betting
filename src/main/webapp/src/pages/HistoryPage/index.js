import React, { useCallback, useRef, useState } from "react";
import { exportComponentAsJPEG } from "react-component-export-image";
import { getBetHistory } from "../../apis/BetHistoryApi";
import { getDetailStatistics } from "../../apis/StatisticApi";
import { QUERY_HISTORY_ACTION } from "../../common/Constant";
import BetHistoryFilter from "../../components/BetHistoryFilter";
import HistoryCardWrapper from "../../components/HistoryCardWrapper";

import "./index.scss";
import PlayerStatisticCard from "../../components/PlayerStatisticCard";
import PlayerCard from "../../components/PlayerCard";
import { usePlayerContextHook } from "../../hooks";
import CenterLoadingSpinner from "../../components/CenterLoadingSpinner";

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

  return (
    <>
      <BetHistoryFilter
        onSubmitFilter={handleSubmitFilter}
        onClickExport={handleClickExport}
      />
      {!hasFetched && (
        <div className={"list-player-asset-wrapper"}>
          {playersWithSortedProfit.map((player) => (
            <PlayerCard key={player.playerId} data={player} />
          ))}
        </div>
      )}
      {loading && <CenterLoadingSpinner />}
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
