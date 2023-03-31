import React from "react";
import {Avatar, Col, Row} from "antd";
import {BET_GROUP_TYPE_KEY, BET_RESULT, BET_TYPE} from "../common/Constant";
import BetResultTag from "../components/BetResultTag";
import MoneyTextCell from "../components/MoneyTextCell";
import VerticalCenterRowCellWithDivider from "../components/VerticalCenterRowCellWithDivider";

const parseBetEvent = (betHistory) => {
    const {event, firstHalfOnly} = betHistory;
    if (!event) {
        console.error('Invalid event of betHistory', event, betHistory)
        return ''
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
    const firstHalfText = firstHalfOnly ? 'Hiệp 1: ' : ''
    return `${firstHalfText}${parsedEvent}`
}

const filterBetResult = (betHistoryList, resultToFilter) => {
    const results = resultToFilter.map(ele => ele.result)
    return betHistoryList.filter(ele => results.includes(ele.result))
}

const isSingleBet = (bet) => (bet?.betType === BET_TYPE.Single)

const isAccumulatorBet = (bet) => (bet?.betType === BET_TYPE.Accumulator)

const buildCommonTableColumn = (players) => {
    return [
        {
            title: 'Người Cược',
            key: 'player',
            width: 150,
            render: (_, record) => {
                const betOwner = players[record.playerId]
                if (!betOwner) {
                    return null
                }
                return <Row className={"vertical-center-row"}>
                    <Avatar size={32} src={betOwner.avatarUrl} style={{marginRight: 8, marginLeft: 8}}/>
                    <p style={{marginBottom: 0}}>{betOwner.playerName}</p>
                </Row>
            },
            filters: Object.values(players).map(ele => ({
                key: ele.playerId, text: ele.playerName, value: ele.playerName
            })),
            onFilter: (value, record) => {
                const betOwner = players[record.playerId]
                return betOwner?.playerName?.includes(value)
            },
        },
        {
            title: 'Trận Đấu',
            key: 'match',
            render: (_, record) => {
                return <>
                    {record.events.map((event, index) => {
                        return <>
                            <VerticalCenterRowCellWithDivider key={event.id}
                                                              arrayLength={record.events.length}
                                                              index={index}>
                                <Col span={11} className={"team-data"}>
                                    {event.firstTeamLogoUrl &&
                                        <img alt={"first-team-logo"} src={event.firstTeamLogoUrl}
                                             className={"team-logo"}/>}
                                    <b className={"team-name"}>{event.firstTeam}</b>
                                </Col>
                                <Col span={1} className={"team-data"}>
                                    <h1 className={"team-data-divider"}>:</h1>
                                </Col>
                                <Col span={11} className={"team-data"}>
                                    {event.secondTeamLogoUrl &&
                                        <img alt={"second-team-logo"} src={event.secondTeamLogoUrl}
                                             className={"team-logo"}/>}
                                    <b className={"team-name"}>{event.secondTeam}</b>
                                </Col>
                            </VerticalCenterRowCellWithDivider>
                        </>
                    })}
                </>
            }
        },
        {
            title: 'Loại Cược',
            key: 'event',
            width: 200,
            render: (_, record) => {
                return record.events.map((event, index) =>
                    <VerticalCenterRowCellWithDivider key={event.id}
                                                      arrayLength={record.events.length}
                                                      index={index}>
                        {parseBetEvent(event)}
                    </VerticalCenterRowCellWithDivider>)
            }
        },
        {
            title: 'Kết Quả',
            children: [
                {
                    title: 'Trận Đấu',
                    key: 'matchResult',
                    width: 80,
                    render: (_, record) => {
                        return <>
                            {isAccumulatorBet(record) && record.events.map((event, index) =>
                                <VerticalCenterRowCellWithDivider key={event.id} index={index}
                                                                  arrayLength={record.events.length}>
                                    <BetResultTag result={event.result}/>
                                </VerticalCenterRowCellWithDivider>)}
                        </>
                    },
                },
                {
                    title: 'Cược',
                    key: 'result',
                    width: 80,
                    render: (_, record) => <BetResultTag result={record.result}/>,
                    filters: Object.values(BET_RESULT).map(ele => ({
                        key: ele.result, text: ele.text, value: ele.text
                    })),
                    onFilter: (value, record) => {
                        const currentBetResult = Object.values(BET_RESULT).find(ele => ele.result === record.result)
                        return currentBetResult?.text === value
                    },
                }
            ],
        },
        {
            title: 'Tiền Cược',
            children: [
                {
                    title: 'Tiền Gốc',
                    key: 'betAmount',
                    width: 80,
                    render: (_, record) => {
                        return record.betAmount ? (`${record.betAmount.toLocaleString()}đ`) : ''
                    }
                },
                {
                    title: 'Tỉ Lệ',
                    children: [
                        {
                            title: 'Trận Đấu',
                            key: 'matchRatio',
                            width: 80,
                            render: (_, record) => {
                                return <>
                                    {isAccumulatorBet(record) && record.events.map((event, index) =>
                                        <VerticalCenterRowCellWithDivider key={event.id} index={index}
                                                                          arrayLength={record.events.length}>
                                            {event.ratio}
                                        </VerticalCenterRowCellWithDivider>)}
                                </>
                            },
                        },
                        {
                            title: 'Cược',
                            key: 'ratio',
                            dataIndex: 'ratio',
                            width: 60,
                        }
                    ]
                },
                {
                    title: 'Lợi Nhuận',
                    key: 'actualProfit',
                    width: 90,
                    render: (_, record) => {
                        return record.actualProfit && <MoneyTextCell value={record.actualProfit}/>
                    }
                },
            ]
        },
        {
            title: 'Thời Gian Cược',
            key: 'betTime',
            dataIndex: 'betTime',
            width: 60,
        },
    ];
}

const groupBetHistoriesByType = (betHistories) => {
    if (!betHistories) {
        return null
    }
    const betGroupByTypeMap = new Map()
    betGroupByTypeMap.set(BET_GROUP_TYPE_KEY.Single, [])
    betGroupByTypeMap.set(BET_GROUP_TYPE_KEY.MultiBetsSameMatch, [])
    betGroupByTypeMap.set(BET_GROUP_TYPE_KEY.Accumulator, [])

    const tempMap = new Map()
    for (let bet of betHistories) {
        if (isAccumulatorBet(bet)) {
            betGroupByTypeMap.get(BET_GROUP_TYPE_KEY.Accumulator).push(bet)
            continue
        }

        const {matchTime, firstTeam, secondTeam, tournamentName} = bet.events[0]
        const matchKey = `${bet.playerId}_${matchTime}_${firstTeam}_${secondTeam}_${tournamentName}`
        if (!tempMap.has(matchKey)) {
            tempMap.set(matchKey, [])
        }
        tempMap.get(matchKey).push(bet)
    }

    tempMap.forEach(value => {
        if (value.length > 1) {
            betGroupByTypeMap.get(BET_GROUP_TYPE_KEY.MultiBetsSameMatch).push(value)
        } else {
            betGroupByTypeMap.get(BET_GROUP_TYPE_KEY.Single).push(value)
        }
    })

    const groupBetHistories = []
    betGroupByTypeMap.forEach((betArray, key) => {
        betArray.forEach(value => {
            groupBetHistories.push({
                type: key,
                data: value
            })
        })
    })
    return groupBetHistories
}

export {buildCommonTableColumn, groupBetHistoriesByType, filterBetResult, isSingleBet, isAccumulatorBet, parseBetEvent}