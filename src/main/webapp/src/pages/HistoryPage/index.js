import React, {useCallback, useState} from "react";
import {Card, Tabs} from 'antd';
import {getBetHistory} from '../../apis/BetHistoryApi'
import BetHistoryCard from "../../components/BetHistoryCard";
import BetHistoryFilter from "../../components/BetHistoryFilter";
import BetHistoryStatistic from "../../components/BetHistoryStatistic";

import './index.scss'

const Index = () => {
    const [betHistory, setBetHistory] = useState([])

    const handleSubmitFilter = useCallback((fieldsValue) => {
        setBetHistory([])
        const {playerId, date} = fieldsValue
        const queryParams = {
            playerId,
            date: date && date.format('YYYY-MM-DD'),
        }
        getBetHistory(queryParams).then((data) => setBetHistory(data))
    }, [])

    return <>
        <BetHistoryFilter onSubmit={handleSubmitFilter}/>
        {betHistory && betHistory.length > 0 &&
            (<Card className={"card-bet-wrapper"}
                   bodyStyle={{
                       padding: '0 0.5rem 0.5rem',
                   }}>
                <Tabs
                    items={[
                        {
                            label: `Danh Sách Cược`,
                            key: '1',
                            children: <>{betHistory.map((ele) => <BetHistoryCard key={ele.id} data={ele}/>)}</>,
                        },
                        {
                            label: `Thống Kê`,
                            key: '2',
                            children: <BetHistoryStatistic data={betHistory}/>,
                        },
                    ]}
                />
            </Card>)}
    </>;
};

export default Index;
