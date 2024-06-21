import BetHistoryCard from "../BetHistoryCard";

import "./index.scss";
import { groupBetHistoriesByType } from "../../utils/BetHistoryUtil";

const RecentUnfinishedBets = ({ data }) => {
  if (data === undefined || data.length === 0) {
    return null;
  }
  const betHistoriesByGroup = groupBetHistoriesByType(data);
  return (
    <>
      {betHistoriesByGroup.map((ele, index) => {
        return <BetHistoryCard key={index} data={ele.data} type={ele.type} />;
      })}
    </>
  );
};

export default RecentUnfinishedBets;
