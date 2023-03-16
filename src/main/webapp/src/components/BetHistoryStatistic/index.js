import React from 'react'
import {Col, Divider, Row, Tag} from 'antd'
import {BET_RESULT} from "../../common/Constant";
import {filterBetResult} from "../../utils/betHistoryUtil";

import './index.scss'

const StatisticDetailText = ({text, isRightColumn = false}) => {
    return <p className={"statistic-detail-text"}
              style={isRightColumn ? {float: 'right', fontWeight: 600} : null}>{text}</p>
}

const StatisticDetailRow = ({left, right}) => {
    return <Row>
        <Col span={12}>
            <StatisticDetailText text={left}/>
        </Col>
        <Col span={12}>
            <StatisticDetailText text={right} isRightColumn/>
        </Col>
    </Row>
}

const calculateProfit = (data) => {
    const sum = data.map(ele => ele.actualProfit).reduce((prev, next) => prev + next)
    if (sum > 0) {
        return <Tag color="success">{`Lời ${sum.toLocaleString()}đ`}</Tag>
    } else if (sum < 0) {
        return <Tag color="error">{`Lỗ ${(sum * (-1)).toLocaleString()}đ`}</Tag>
    } else {
        return <Tag>Hoà</Tag>
    }
}

const BetHistoryStatistic = ({data}) => {
    const totalWin = filterBetResult(data, [BET_RESULT.WIN, BET_RESULT.HALF_WIN]).length
    const totalDraw = filterBetResult(data, [BET_RESULT.DRAW]).length
    const totalLost = filterBetResult(data, [BET_RESULT.LOST, BET_RESULT.HALF_LOST]).length
    const totalUnfinished = filterBetResult(data, [BET_RESULT.NOT_FINISHED]).length
    const totalBetAmount = data.map(ele => ele.betAmount).reduce((prev, next) => prev + next)
    const totalPotentialProfit = data.map(ele => ele.potentialProfit).reduce((prev, next) => prev + next)
    const winRate = Math.round(totalWin * 100 / data.length)
    const potentialWinning = totalUnfinished === data.length
    const hasAtLeastOneResult = totalUnfinished < data.length

    return <div className={"bet-history-statistic-wrapper"}>
        <StatisticDetailRow left={`Tổng Số Cược:`} right={data.length}/>
        <StatisticDetailRow left={`Số Trận Thắng:`} right={totalWin}/>
        <StatisticDetailRow left={`Số Trận Hoà:`} right={totalDraw}/>
        <StatisticDetailRow left={`Số Trận Thua:`} right={totalLost}/>
        <StatisticDetailRow left={`Số Trận Chưa Hoàn Tất:`} right={totalUnfinished}/>
        <StatisticDetailRow left={`Tổng Tiền Cược:`} right={`${totalBetAmount.toLocaleString()}đ`}/>
        {potentialWinning &&
            <StatisticDetailRow left={`Lợi Nhuận Tiềm Năng:`} right={`${totalPotentialProfit.toLocaleString()}đ`}/>}
        {hasAtLeastOneResult &&
            (<>
                <Divider/>
                <StatisticDetailRow left={`Kết Quả:`} right={calculateProfit(data)}/>
                <StatisticDetailRow left={`Tỉ Lệ Thắng:`} right={`${winRate}%`}/>
            </>)
        }
    </div>
}

export default BetHistoryStatistic