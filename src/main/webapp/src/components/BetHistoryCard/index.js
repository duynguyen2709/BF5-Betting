import React from 'react'
import {isSingleBet} from "../../utils/BetHistoryUtil";
import AccumulatorBetHistoryCard from "./Accumulator";
import SingleBetHistoryCard from "./Single";

import './index.scss'

const BetHistoryCard = ({data, isHistoryViewMode = true}) => {
    const singleBet = isSingleBet(data)
    const card = singleBet ?
        <SingleBetHistoryCard data={data} isHistoryViewMode={isHistoryViewMode}/> :
        <AccumulatorBetHistoryCard data={data} isHistoryViewMode={isHistoryViewMode}/>
    return <div className={"card-bet-history-wrapper"}>
        {card}
    </div>
}

export default BetHistoryCard