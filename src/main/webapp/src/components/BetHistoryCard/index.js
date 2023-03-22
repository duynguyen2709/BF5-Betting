import React from 'react'
import {Card, Col, Row} from 'antd'
import {parseBetEvent} from "../../utils/betHistoryUtil";
import BetResultTag from "../BetResultTag";

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

const BetHistoryCard = ({data}) => {
    return (
        <Card title={<BetHistoryCardTitle data={data}/>}
              bordered={true}
              className={"card-bet-history"}
        >
            <BetHistoryDetailRow left={'Loại Cược:'} right={parseBetEvent(data)}/>
            <BetHistoryDetailRow left={'Tiền Cược:'} right={`${data.betAmount.toLocaleString()}đ`}/>
            <BetHistoryDetailRow left={'Tỉ Lệ:'} right={data.ratio}/>
            {data.score && <BetHistoryDetailRow left={'Tỉ Số:'} right={data.score}/>}
            {data.result === 'NOT_FINISHED' ?
                <BetHistoryDetailRow left={'Tiền Lời:'}
                                     right={`${data.potentialProfit.toLocaleString()}đ`}/> : null}
            <BetHistoryDetailRow left={'Kết Quả:'} right={<BetResultTag result={data.result}/>}/>
            {data.result === 'WIN' || data.result === 'HALF_WIN' ?
                <BetHistoryDetailRow left={'Tiền Lời:'} right={`${data.actualProfit.toLocaleString()}đ`}/> : null}
            {data.result === 'LOST' || data.result === 'HALF_LOST' ?
                <BetHistoryDetailRow left={'Tiền Lỗ:'} right={`${data.actualProfit.toLocaleString()}đ`}/> : null}
        </Card>
    )
}

export default BetHistoryCard