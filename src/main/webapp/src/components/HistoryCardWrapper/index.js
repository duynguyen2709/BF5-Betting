import HistoryCardMetadata from "../HistoryCardMetadata";
import { Card, Empty, Tabs } from "antd";
import { MESSAGE } from "../../common/Constant";
import { usePlayerContextHook } from "../../hooks";
import BetHistoryCard from "../BetHistoryCard";
import BetHistoryStatistic from "../BetHistoryStatistic";

import "./index.scss";
import { groupBetHistoriesByType } from "../../utils/BetHistoryUtil";

const TAB_KEYS = {
  History: {
    label: "Danh Sách Cược",
    key: "history",
  },
  Statistic: {
    label: "Tổng Hợp",
    key: "summary",
  },
};

const HistoryCardWrapper = ({
  data,
  historyFilterParams,
  historyActiveTab,
  onChangeHistoryActiveTab,
  cardRef,
}) => {
  const { players } = usePlayerContextHook();

  const isHistoryListNotEmpty = data && data.length > 0;
  const isHistoryFetchedButEmpty = data !== undefined && data.length === 0;
  const betHistoriesByGroup = groupBetHistoriesByType(data);

  return (
    <Card ref={cardRef} className={"card-bet-wrapper"}>
      <HistoryCardMetadata
        players={players}
        data={historyFilterParams}
        style={{ padding: "0.5rem", paddingTop: "1rem" }}
      />
      {isHistoryFetchedButEmpty && (
        <Empty
          className={"card-bet-empty"}
          description={MESSAGE.EmptyBetReturned}
        />
      )}
      {isHistoryListNotEmpty && (
        <Tabs
          activeKey={historyActiveTab}
          onChange={onChangeHistoryActiveTab}
          items={[
            {
              label: TAB_KEYS.History.label,
              key: TAB_KEYS.History.key,
              children: (
                <>
                  {betHistoriesByGroup.map((ele, index) => {
                    return (
                      <BetHistoryCard
                        key={index}
                        data={ele.data}
                        type={ele.type}
                      />
                    );
                  })}
                </>
              ),
            },
            {
              label: TAB_KEYS.Statistic.label,
              key: TAB_KEYS.Statistic.key,
              children: <BetHistoryStatistic data={data} />,
            },
          ]}
        />
      )}
    </Card>
  );
};

export default HistoryCardWrapper;
