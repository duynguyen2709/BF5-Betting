import React from 'react'
import {Card, Col, Row} from 'antd'
import {BET_RESULT} from "../../../common/Constant";
import {parseBetEvent} from "../../../utils/BetHistoryUtil";
import BetResultTag from "../../BetResultTag";

import './index.scss'

const BetHistoryDetailText = ({text, isRightColumn = false}) => {
    return <p className={"bet-history-detail-text"}
              style={isRightColumn ? {float: 'right', textAlign: 'right', fontWeight: 500} : null}
    >
        {text}
    </p>
}

const BetHistoryDetailRow = ({left, right}) => {
    return <Row>
        <Col span={6}>
            <BetHistoryDetailText text={left}/>
        </Col>
        <Col span={18}>
            <BetHistoryDetailText text={right} isRightColumn/>
        </Col>
    </Row>
}

const BetHistoryCardTitle = ({data}) => {
    return <>
        <Row justify={"space-between"}>
            <p className={"bet-history-tournament-name"}>{data.tournamentName}</p>
            <p className={"bet-history-match-time"}>{data.matchTime}</p>
        </Row>
        <Row>
            <Col span={11} className={"team-data"}>
                {data.firstTeamLogoUrl &&
                    <img alt={"first-team-logo"} src={data.firstTeamLogoUrl} className={"team-logo"}/>}
                <b className={"team-name"}>{data.firstTeam}</b>
            </Col>
            <Col span={1} className={"team-data"}>
                <h1 className={"team-data-divider"}>:</h1>
            </Col>
            <Col offset={1} span={11} className={"team-data"}>
                {data.secondTeamLogoUrl &&
                    <img alt={"second-team-logo"} src={data.secondTeamLogoUrl} className={"team-logo"}/>}
                <b className={"team-name"}>{data.secondTeam}</b>
            </Col>
        </Row>
    </>
}

const SingleBetHistoryCard = ({data}) => {
    const event = data?.events[0]
    return <Card title={<BetHistoryCardTitle data={event}/>}
                 bordered={true}
                 className={"card-bet-history"}
                 bodyStyle={{padding: '0.5rem 1rem 0.5rem'}}
    >
        <BetHistoryDetailRow left={'Loại Cược:'} right={parseBetEvent(event)}/>
        <BetHistoryDetailRow left={'Tiền Cược:'} right={`${data.betAmount.toLocaleString()}đ`}/>
        <BetHistoryDetailRow left={'Tỉ Lệ:'} right={data.ratio}/>
        {event.score && <BetHistoryDetailRow left={'Tỉ Số:'} right={event.score}/>}
        {data.result === BET_RESULT.Unfinished.result ?
            <BetHistoryDetailRow left={'Tiền Lời:'}
                                 right={`${data.potentialProfit.toLocaleString()}đ`}/> : null}
        <BetHistoryDetailRow left={'Kết Quả:'} right={<BetResultTag result={data.result}/>}/>
        {data.result === BET_RESULT.Win.result || data.result === BET_RESULT.HalfWin.result ?
            <BetHistoryDetailRow left={'Tiền Lời:'} right={`${data.actualProfit.toLocaleString()}đ`}/> : null}
        {data.result === BET_RESULT.Lost.result || data.result === BET_RESULT.HalfLost.result ?
            <BetHistoryDetailRow left={'Tiền Lỗ:'} right={`${data.actualProfit.toLocaleString()}đ`}/> : null}
    </Card>
}

export default SingleBetHistoryCard