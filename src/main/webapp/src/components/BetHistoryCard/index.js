import React from 'react'
import {BET_GROUP_TYPE_KEY} from "../../common/Constant";
import {isSingleBet} from "../../utils/BetHistoryUtil";
import AccumulatorBetHistoryCard from "./Accumulator";
import SingleBetHistoryCard from "./Single";

import './index.scss'
import MultiBetHistoryCard from "./Multi";

const BetHistoryCard = ({data, type, isAdminView = false, isHistoryViewMode = true}) => {
    if (isAdminView) {
        const singleBet = isSingleBet(data)
        const card = singleBet ?
            <SingleBetHistoryCard data={data} isHistoryViewMode={isHistoryViewMode}/> :
            <AccumulatorBetHistoryCard data={data} isHistoryViewMode={isHistoryViewMode}/>
        return <div className={"card-bet-history-wrapper"}>
            {card}
        </div>
    } else {
        let card
        switch (type) {
            case BET_GROUP_TYPE_KEY.Single:
                card = <SingleBetHistoryCard data={data[0]} isHistoryViewMode={isHistoryViewMode}/>
                break
            case BET_GROUP_TYPE_KEY.Accumulator:
                card = <AccumulatorBetHistoryCard data={data[0]} isHistoryViewMode={isHistoryViewMode}/>
                break
            case BET_GROUP_TYPE_KEY.MultiBetsSameMatch:
                card = <MultiBetHistoryCard data={data} />
                break
            default:
                card = null
                break
        }
        return <div className={"card-bet-history-wrapper"}>
            {card}
        </div>
    }



}

export default BetHistoryCard