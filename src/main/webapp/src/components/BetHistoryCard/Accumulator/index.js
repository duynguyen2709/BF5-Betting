import React from 'react'
import {Card, Col, Divider, Row} from 'antd'
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

const AccumulatorBetHistoryCard = ({event, index, dataLength, isHistoryViewMode}) => {
    const isNotFirstElement = index > 0
    const isNotLastElement = index < dataLength - 1
    let style = {
        borderBottom: 'none'
    }
    if (isNotFirstElement) {
        style = {
            ...style,
            borderTop: 'none',
            marginTop: '-0.5rem'
        }
    } else {
        style = {
            ...style,
            borderRadius: '0.25rem 0.25rem 0 0',
            marginTop: '0.5rem'
        }
    }
    return (
        <Card title={<BetHistoryCardTitle data={event}/>}
              bordered={true}
              className={"card-bet-history-accumulator"}
              bodyStyle={{padding: '0.5rem 1rem 0.5rem', fontSize: '13px'}}
              style={style}
        >
            <BetHistoryDetailRow left={'Loại Cược:'} right={parseBetEvent(event)}/>
            {isHistoryViewMode && <>
                <BetHistoryDetailRow left={'Tỉ Lệ:'} right={event.ratio}/>
                {event.score && <BetHistoryDetailRow left={'Tỉ Số:'} right={event.score}/>}
                <BetHistoryDetailRow left={'Kết Quả:'} right={<BetResultTag result={event.result}/>}/>
            </>}
            {isNotLastElement && <Divider style={{margin: '0.25rem', borderTop: '1px solid #0000001a'}}/>}
        </Card>
    )
}

const AccumulatorBetHistoryCardWrapper = ({data, isHistoryViewMode}) => {
    return <>
        {data?.events.map((event, index) =>
            <AccumulatorBetHistoryCard key={event.id}
                                       event={event}
                                       index={index}
                                       dataLength={data?.events.length}
                                       isHistoryViewMode={isHistoryViewMode}/>)}
        <Card bordered={true}
              className={"card-bet-history-accumulator"}
              bodyStyle={{padding: '0.5rem 1rem 0.5rem'}}
              style={{borderRadius: '0 0 0.25rem 0.25rem', borderTop: '1px solid #1677ff80', marginBottom: '0.5rem'}}
        >
            <BetHistoryDetailRow left={'Loại Cược:'} right={'Cược Xiên'}/>
            {isHistoryViewMode && <>
                <BetHistoryDetailRow left={'Tiền Cược:'} right={`${data.betAmount.toLocaleString()}đ`}/>
                <BetHistoryDetailRow left={'Tỉ Lệ:'} right={data.ratio}/>
                {data.result === BET_RESULT.Unfinished.result ?
                    <BetHistoryDetailRow left={'Tiền Lời:'}
                                         right={`${data.potentialProfit.toLocaleString()}đ`}/> : null}
                <BetHistoryDetailRow left={'Kết Quả:'} right={<BetResultTag result={data.result}/>}/>
                {data.result === BET_RESULT.Win.result || data.result === BET_RESULT.HalfWin.result ?
                    <BetHistoryDetailRow left={'Tiền Lời:'} right={`${data.actualProfit.toLocaleString()}đ`}/> : null}
                {data.result === BET_RESULT.Lost.result || data.result === BET_RESULT.HalfLost.result ?
                    <BetHistoryDetailRow left={'Tiền Lỗ:'} right={`${data.actualProfit.toLocaleString()}đ`}/> : null}
            </>}
        </Card>
    </>
}

export default AccumulatorBetHistoryCardWrapper