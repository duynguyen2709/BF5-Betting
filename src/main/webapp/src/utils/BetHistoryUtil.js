import React from "react";
import { Avatar, Col, Row } from "antd";
import { BET_GROUP_TYPE_KEY, BET_RESULT, BET_TYPE } from "../common/Constant";
import BetResultTag from "../components/BetResultTag";
import MoneyTextCell from "../components/MoneyTextCell";
import VerticalCenterRowCellWithDivider from "../components/VerticalCenterRowCellWithDivider";

const parseBetEvent = (betHistory) => {
  const { event, firstHalfOnly } = betHistory;
  if (!event) {
    console.error("Invalid event of betHistory", event, betHistory);
    return "";
  }
  const parsedEvent = event
    .replace("Handicap 1", betHistory.firstTeam)
    .replace("Team 1", betHistory.firstTeam)
    .replace("Handicap 2", betHistory.secondTeam)
    .replace("Team 2", betHistory.secondTeam)
    .replace("W1", `${betHistory.firstTeam} (-0.5)`)
    .replace("W2", `${betHistory.secondTeam} (-0.5)`)
    .replace("1X", `${betHistory.firstTeam} (+0.5)`)
    .replace("2X", `${betHistory.secondTeam} (+0.5)`)
    .replace("To Win", "Thắng")
    .replace("Not To Lose", "(+0.5)")
    .replace("Total Over", "Tài")
    .replace("Total >", "Tài")
    .replace("Total Under", "Xỉu")
    .replace("Total <", "Xỉu")
    .replace(" - Yes", "")
    .replace(" And ", " & ")
    .replace("Both Teams To Score", "Cả 2 Đội Cùng Ghi Bàn")
    .replace("Corners:", "Phạt Góc:");
  const firstHalfText = firstHalfOnly ? "Hiệp 1: " : "";
  return `${firstHalfText}${parsedEvent}`;
};

const filterBetResult = (betHistoryList, resultToFilter) => {
  const results = resultToFilter.map((ele) => ele.result);
  return betHistoryList.filter((ele) => results.includes(ele.result));
};

const isSingleBet = (bet) => bet?.betType === BET_TYPE.Single;

const isAccumulatorBet = (bet) => bet?.betType !== BET_TYPE.Single;

const isAllUnfinishedBets = (betHistory) =>
  !betHistory.some((bet) => bet.result !== BET_RESULT.Unfinished.result);

const buildCommonTableColumn = (players) => {
  return [
    {
      title: "Mã Cược",
      key: "betId",
      dataIndex: "betId",
      width: 120,
    },
    {
      title: "Người Cược",
      key: "player",
      width: 150,
      render: (_, record) => {
        const betOwner = players[record.playerId];
        if (!betOwner) {
          return null;
        }
        return (
          <Row className={"vertical-center-row"}>
            <Avatar
              size={32}
              src={betOwner.avatarUrl}
              style={{ marginRight: 8, marginLeft: 8 }}
            />
            <p style={{ marginBottom: 0 }}>{betOwner.playerName}</p>
          </Row>
        );
      },
      filters: Object.values(players).map((ele) => ({
        key: ele.playerId,
        text: ele.playerName,
        value: ele.playerName,
      })),
      onFilter: (value, record) => {
        const betOwner = players[record.playerId];
        return betOwner?.playerName?.includes(value);
      },
    },
    {
      title: "Trận Đấu",
      key: "match",
      render: (_, record) => {
        return (
          <>
            {record.events.map((event, index) => {
              return (
                <>
                  <VerticalCenterRowCellWithDivider
                    key={event.id}
                    arrayLength={record.events.length}
                    index={index}
                  >
                    <Col
                      span={event.secondTeam ? 11 : undefined}
                      className={"team-data"}
                    >
                      {event.firstTeamLogoUrl && (
                        <img
                          alt={"first-team-logo"}
                          src={event.firstTeamLogoUrl}
                          className={"team-logo"}
                        />
                      )}
                      <b className={"team-name"}>{event.firstTeam}</b>
                    </Col>
                    {event.secondTeam && (
                      <>
                        <Col span={1} className={"team-data"}>
                          <h1 className={"team-data-divider"}>:</h1>
                        </Col>
                        <Col span={11} className={"team-data"}>
                          {event.secondTeamLogoUrl && (
                            <img
                              alt={"second-team-logo"}
                              src={event.secondTeamLogoUrl}
                              className={"team-logo"}
                            />
                          )}
                          <b className={"team-name"}>{event.secondTeam}</b>
                        </Col>
                      </>
                    )}
                  </VerticalCenterRowCellWithDivider>
                </>
              );
            })}
          </>
        );
      },
    },
    {
      title: "Lựa Chọn",
      key: "event",
      width: 200,
      render: (_, record) => {
        return record.events.map((event, index) => (
          <VerticalCenterRowCellWithDivider
            key={event.id}
            arrayLength={record.events.length}
            index={index}
          >
            {parseBetEvent(event)}
          </VerticalCenterRowCellWithDivider>
        ));
      },
    },
    {
      title: "Kết Quả",
      children: [
        {
          title: "Trận Đấu",
          key: "matchResult",
          width: 80,
          render: (_, record) => {
            return (
              <>
                {isAccumulatorBet(record) &&
                  record.events.map((event, index) => (
                    <VerticalCenterRowCellWithDivider
                      key={event.id}
                      index={index}
                      arrayLength={record.events.length}
                    >
                      <BetResultTag result={event.result} />
                    </VerticalCenterRowCellWithDivider>
                  ))}
              </>
            );
          },
        },
        {
          title: "Cược",
          key: "result",
          width: 150,
          render: (_, record) => <BetResultTag result={record.result} />,
          filters: Object.values(BET_RESULT).map((ele) => ({
            key: ele.result,
            text: ele.text,
            value: ele.text,
          })),
          onFilter: (value, record) => {
            const currentBetResult = Object.values(BET_RESULT).find(
              (ele) => ele.result === record.result
            );
            return currentBetResult?.text === value;
          },
        },
      ],
    },
    {
      title: "Tiền Cược",
      children: [
        {
          title: "Tiền Gốc",
          key: "betAmount",
          width: 100,
          render: (_, record) => <MoneyTextCell value={record.betAmount} />,
        },
        {
          title: "Tỉ Lệ",
          children: [
            {
              title: "Trận Đấu",
              key: "matchRatio",
              width: 80,
              render: (_, record) => {
                return (
                  <>
                    {isAccumulatorBet(record) &&
                      record.events.map((event, index) => (
                        <VerticalCenterRowCellWithDivider
                          key={event.id}
                          index={index}
                          arrayLength={record.events.length}
                        >
                          {event.ratio}
                        </VerticalCenterRowCellWithDivider>
                      ))}
                  </>
                );
              },
            },
            {
              title: "Cược",
              key: "ratio",
              dataIndex: "ratio",
              width: 60,
            },
          ],
        },
        {
          title: "Lợi Nhuận",
          key: "actualProfit",
          width: 100,
          render: (_, record) => <MoneyTextCell value={record.actualProfit} />,
        },
      ],
    },
    {
      title: "Loại Cược",
      key: "betType",
      width: 130,
      render: (_, record) => {
        switch (record.betType) {
          case BET_TYPE.Single:
            return <b>Cược Đơn</b>;
          case BET_TYPE.Accumulator:
            return <b>Cược Xiên</b>;
          case BET_TYPE.Lucky:
            return <b>Cược May Mắn</b>;
          case BET_TYPE.System:
            return <b>{`Cược Hệ Thống (${record.metadata?.combination})`}</b>;
          default:
            return null;
        }
      },
    },
    {
      title: "Thời Gian Cược",
      key: "betTime",
      dataIndex: "betTime",
      width: 100,
    },
  ];
};

const groupBetHistoriesByTeam = (betHistories) => {
  if (!betHistories || !(betHistories instanceof Array)) {
    return null;
  }
  const betGroupByTeamMap = new Map();
  for (let bet of betHistories) {
    for (let event of bet.events) {
      const { firstTeam, secondTeam } = event;
      if (!betGroupByTeamMap.has(firstTeam)) {
        betGroupByTeamMap.set(firstTeam, []);
      }
      betGroupByTeamMap.get(firstTeam).push(event);

      if (!betGroupByTeamMap.has(secondTeam)) {
        betGroupByTeamMap.set(secondTeam, []);
      }
      betGroupByTeamMap.get(secondTeam).push(event);
    }
  }
  return betGroupByTeamMap;
};

const groupBetHistoriesByTournament = (betHistories) => {
  if (!betHistories || !(betHistories instanceof Array)) {
    return null;
  }
  const betGroupByTournamentMap = new Map();
  for (let bet of betHistories) {
    for (let event of bet.events) {
      const tournament = event.tournamentName;
      if (!betGroupByTournamentMap.has(tournament)) {
        betGroupByTournamentMap.set(tournament, []);
      }
      betGroupByTournamentMap.get(tournament).push(event);
    }
  }
  return betGroupByTournamentMap;
};

const groupBetHistoriesByDate = (betHistories) => {
  if (!betHistories || !(betHistories instanceof Array)) {
    return null;
  }
  const betGroupByDateMap = new Map();
  for (let bet of betHistories) {
    const betDate = bet.betTime.substring(0, 5);
    if (!betGroupByDateMap.has(betDate)) {
      betGroupByDateMap.set(betDate, []);
    }
    betGroupByDateMap.get(betDate).push(bet);
  }
  return betGroupByDateMap;
};

const groupBetHistoriesByType = (betHistories) => {
  if (!betHistories || !(betHistories instanceof Array)) {
    return null;
  }
  const betGroupByTypeMap = new Map();
  betGroupByTypeMap.set(BET_GROUP_TYPE_KEY.Single, []);
  betGroupByTypeMap.set(BET_GROUP_TYPE_KEY.MultiBetsSameMatch, []);
  betGroupByTypeMap.set(BET_GROUP_TYPE_KEY.Accumulator, []);

  const tempMap = new Map();
  for (let bet of betHistories) {
    if (isAccumulatorBet(bet)) {
      betGroupByTypeMap.get(BET_GROUP_TYPE_KEY.Accumulator).push(bet);
      continue;
    }

    const { matchTime, firstTeam, secondTeam, tournamentName } = bet.events[0];
    const matchKey = `${bet.playerId}_${matchTime}_${firstTeam}_${secondTeam}_${tournamentName}`;
    if (!tempMap.has(matchKey)) {
      tempMap.set(matchKey, []);
    }
    tempMap.get(matchKey).push(bet);
  }

  tempMap.forEach((value) => {
    if (value.length > 1) {
      betGroupByTypeMap.get(BET_GROUP_TYPE_KEY.MultiBetsSameMatch).push(value);
    } else {
      betGroupByTypeMap.get(BET_GROUP_TYPE_KEY.Single).push(value);
    }
  });

  const groupBetHistories = [];
  betGroupByTypeMap.forEach((betArray, key) => {
    betArray.forEach((value) => {
      groupBetHistories.push({
        type: key,
        data: value,
      });
    });
  });
  return groupBetHistories;
};

const getDistinctTeamName = (betHistoryList) => {
  const teams = new Set();
  betHistoryList.forEach((bet) => {
    bet.events.forEach((event) => {
      teams.add(event.firstTeam);
      teams.add(event.secondTeam);
    });
  });
  return teams;
};

export {
  buildCommonTableColumn,
  groupBetHistoriesByType,
  groupBetHistoriesByDate,
  groupBetHistoriesByTeam,
  groupBetHistoriesByTournament,
  getDistinctTeamName,
  filterBetResult,
  isSingleBet,
  isAccumulatorBet,
  isAllUnfinishedBets,
  parseBetEvent,
};
