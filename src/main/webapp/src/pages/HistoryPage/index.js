import React, {useCallback, useContext, useRef, useState} from "react";
import {exportComponentAsJPEG} from 'react-component-export-image';
import moment from 'moment'

import {Avatar, Card, Tabs} from 'antd';
import {getBetHistory} from '../../apis/BetHistoryApi'
import BetHistoryCard from "../../components/BetHistoryCard";
import BetHistoryFilter from "../../components/BetHistoryFilter";
import BetHistoryStatistic from "../../components/BetHistoryStatistic";

import './index.scss'
import PlayersContext from "../../common/PlayersContext";

const {Meta} = Card

const TAB_KEYS = {
   History: 'history',
   Statistic: 'statistic',
}

const HistoryCardMetadata = ({players, data}) => {
    const {playerId, date} = data
    if (!players || !playerId || !date)
        return null

    const actualPlayer = players[playerId]
    return <Meta
        avatar={<Avatar src={actualPlayer.avatarUrl} size={48}/>}
        title={actualPlayer.playerName}
        description={moment(date).format('DD/MM/YYYY')}
        style={{padding: '1rem'}}
    />
}

const HistoryPage = () => {
    const historyCardRef = useRef()
    const [activeTab, setActiveTab] = useState(TAB_KEYS.History)
    const [betHistories, setBetHistories] = useState([])
    const [historyFilterParams, setHistoryFilterParams] = useState({
        playerId: '',
        date: null,
    })
    const playerContext = useContext(PlayersContext)
    const {players} = playerContext

    const handleSubmitFilter = useCallback((fieldsValue) => {
        setBetHistories([])
        setHistoryFilterParams({
            playerId: '',
            date: null,
        })
        const {playerId, date} = fieldsValue
        const queryParams = {
            playerId,
            date: date && date.format('YYYY-MM-DD'),
        }
        setHistoryFilterParams(queryParams)
        getBetHistory(queryParams).then((data) => setBetHistories(data))
    }, [])

    const handleClickExport = useCallback(() => {
        const delay = 50
        const lastActiveTab = activeTab;
        setActiveTab(TAB_KEYS.History)
        setTimeout(() => {
            exportComponentAsJPEG(historyCardRef)
                .then(() => {
                    setActiveTab(TAB_KEYS.Statistic)
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

    return <>
        <BetHistoryFilter onSubmit={handleSubmitFilter} onClickExport={handleClickExport} isExportButtonActive={isHistoryListNotEmpty}/>
        {isHistoryListNotEmpty &&
            (<Card ref={historyCardRef} className={"card-bet-wrapper"}
                   bodyStyle={{
                       padding: '0 0.5rem 0.5rem',
                   }}>
                <HistoryCardMetadata players={players} data={historyFilterParams}/>
                <Tabs
                    activeKey={activeTab}
                    onChange={handleChangeTab}
                    items={[
                        {
                            label: `Danh Sách Cược`,
                            key: TAB_KEYS.History,
                            children: <>{betHistories.map((ele) => <BetHistoryCard key={ele.id} data={ele}/>)}</>,
                        },
                        {
                            label: `Thống Kê`,
                            key: TAB_KEYS.Statistic,
                            children: <BetHistoryStatistic data={betHistories}/>,
                        },
                    ]}
                />
            </Card>)}
    </>;
};

export default HistoryPage;
