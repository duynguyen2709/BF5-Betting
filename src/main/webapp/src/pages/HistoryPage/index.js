import React, {useCallback, useContext, useRef, useState} from "react";
import {exportComponentAsJPEG} from 'react-component-export-image';
import {Card, Empty, Tabs} from 'antd';
import {getBetHistory} from '../../apis/BetHistoryApi'
import {MESSAGE} from "../../common/Constant";
import PlayersContext from "../../common/PlayersContext";
import BetHistoryCard from "../../components/BetHistoryCard";
import BetHistoryFilter from "../../components/BetHistoryFilter";
import BetHistoryStatistic from "../../components/BetHistoryStatistic";
import HistoryCardMetadata from "../../components/HistoryCardMetadata";

import './index.scss'

const TAB_KEYS = {
    History: {
        label: 'Danh Sách Cược',
        key: 'history',
    },
    Statistic: {
        label: 'Thống Kê',
        key: 'statistic',
    }
}

const DEFAULT_HISTORY_FILTER_PARAMS = {
    playerId: '',
    startDate: null,
    endDate: null,
}

const HistoryPage = () => {
    const historyCardRef = useRef()
    const [activeTab, setActiveTab] = useState(TAB_KEYS.History.key)
    const [betHistories, setBetHistories] = useState(undefined)
    const [historyFilterParams, setHistoryFilterParams] = useState(DEFAULT_HISTORY_FILTER_PARAMS)
    const playerContext = useContext(PlayersContext)
    const {players} = playerContext

    const handleSubmitFilter = useCallback((fieldsValue) => {
        // Reset current filter & data
        setBetHistories(undefined)
        setHistoryFilterParams(DEFAULT_HISTORY_FILTER_PARAMS)
        // Parse new filter params
        const {playerId, startDate, endDate} = fieldsValue
        const queryParams = {
            playerId,
            startDate: startDate && startDate.format('YYYY-MM-DD'),
            endDate: endDate && endDate.format('YYYY-MM-DD'),
        }
        setHistoryFilterParams(queryParams)
        // Fetch data
        getBetHistory(queryParams).then((data) => setBetHistories(data))
    }, [])

    const handleClickExport = useCallback(() => {
        const delay = 50
        const lastActiveTab = activeTab;
        setActiveTab(TAB_KEYS.History.key)
        setTimeout(() => {
            exportComponentAsJPEG(historyCardRef)
                .then(() => {
                    setActiveTab(TAB_KEYS.Statistic.key)
                    setTimeout(() => exportComponentAsJPEG(historyCardRef)
                            .then(() => setActiveTab(lastActiveTab)),
                        delay)
                })
        }, delay)
    }, [activeTab])

    const handleChangeTab = useCallback((key) => {
        setActiveTab(key)
    }, [])

    const hasFetched = betHistories !== undefined
    const isHistoryListNotEmpty = betHistories && betHistories.length > 0
    const isHistoryFetchedButEmpty = betHistories !== undefined && betHistories.length === 0

    return <>
        <BetHistoryFilter onSubmit={handleSubmitFilter}
                          onClickExport={handleClickExport}
                          isExportButtonActive={isHistoryListNotEmpty}/>
        {hasFetched &&
            <Card ref={historyCardRef} className={"card-bet-wrapper"}>
                <HistoryCardMetadata players={players} data={historyFilterParams}/>
                {isHistoryFetchedButEmpty &&
                    <Empty className={'card-bet-empty'} description={MESSAGE.EmptyBetReturned}/>}
                {isHistoryListNotEmpty && (
                    <Tabs
                        activeKey={activeTab}
                        onChange={handleChangeTab}
                        items={[
                            {
                                label: TAB_KEYS.History.label,
                                key: TAB_KEYS.History.key,
                                children: <>{betHistories.map((ele) => <BetHistoryCard key={ele.id} data={ele}/>)}</>,
                            },
                            {
                                label: TAB_KEYS.Statistic.label,
                                key: TAB_KEYS.Statistic.key,
                                children: <BetHistoryStatistic data={betHistories}/>,
                            },
                        ]}
                    />)}
            </Card>}
    </>;
};

export default HistoryPage;
