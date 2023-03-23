import React, {useCallback, useContext, useRef, useState} from "react";
import {exportComponentAsJPEG} from 'react-component-export-image';
import moment from 'moment'
import {Avatar, Card, Empty, Tabs} from 'antd';
import {getBetHistory} from '../../apis/BetHistoryApi'
import {MESSAGE} from "../../common/Constant";
import PlayersContext from "../../common/PlayersContext";
import BetHistoryCard from "../../components/BetHistoryCard";
import BetHistoryFilter from "../../components/BetHistoryFilter";
import BetHistoryStatistic from "../../components/BetHistoryStatistic";

import './index.scss'

const {Meta} = Card

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

const parseDateDescription = (startDate, endDate) => {
    const start = startDate && moment(startDate).format('DD/MM/YYYY')
    const end = endDate && moment(endDate).format('DD/MM/YYYY')
    if (start && end) {
        if (start === end) {
            return start
        }
        return `${start} - ${end}`
    } else {
        return start || end
    }
};

const HistoryCardMetadata = ({players, data}) => {
    const {playerId, startDate, endDate} = data
    if (!players || !playerId)
        return null

    const actualPlayer = players[playerId]
    return <Meta
        avatar={<Avatar src={actualPlayer.avatarUrl} size={48}/>}
        title={actualPlayer.playerName}
        description={parseDateDescription(startDate, endDate)}
        style={{padding: '1rem'}}
    />
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

    const isHistoryListNotEmpty = betHistories && betHistories.length > 0
    const isHistoryFetchedButEmpty = betHistories !== undefined && betHistories.length === 0

    return <>
        <BetHistoryFilter onSubmit={handleSubmitFilter} onClickExport={handleClickExport} isExportButtonActive={isHistoryListNotEmpty}/>
        {isHistoryFetchedButEmpty && <Empty className={'card-bet-empty'} description={MESSAGE.EmptyBetReturned}/>}
        {isHistoryListNotEmpty &&
            (<Card ref={historyCardRef} className={"card-bet-wrapper"}>
                <HistoryCardMetadata players={players} data={historyFilterParams}/>
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
                />
            </Card>)}
    </>;
};

export default HistoryPage;
