import React, {useCallback, useEffect, useState} from 'react'
import {Card, message, Tabs} from 'antd';
import {getAllBetHistory} from "../../apis/BetHistoryApi";
import {MESSAGE} from "../../common/Constant";
import AdminBetHistoryTable from "../../components/AdminBetHistoryTable";
import AdminRawBetManagementTab from "../../components/AdminRawBetManagementTab";
import AdminPlayerStatisticCard from "../../components/AdminPlayerStatisticCard";
import {usePlayerContextHook} from "../../hooks";

import './index.scss'
import AdminPlayerAssetHistoryTable from "../../components/AdminPlayerAssetHistoryTable";
import {getAllStatistics} from "../../apis/StatisticApi";

const AdminPage = () => {
    const [betHistoryList, setBetHistoryList] = useState([])
    const [assetHistoryList, setAssetHistoryList] = useState([])
    const {players, fetchPlayersData} = usePlayerContextHook()

    const fetchAllBets = useCallback(() => {
        getAllBetHistory().then(data => setBetHistoryList(data))
    }, [])

    const fetchAllAssetHistories = useCallback(() => {
        getAllStatistics().then(data => setAssetHistoryList(data))
    }, [])

    useEffect(() => {
        fetchAllBets()
        fetchAllAssetHistories()
    }, [fetchAllBets, fetchAllAssetHistories])

    const handleUpdateBetSuccess = useCallback(() => {
        message.success(MESSAGE.UpdateBetSuccess)
        setBetHistoryList([])
        fetchAllBets()
        fetchAllAssetHistories()
        fetchPlayersData()
    }, [fetchAllBets, fetchPlayersData, fetchAllAssetHistories])

    const handleRunStatisticSuccess = useCallback(() => {
        message.success(MESSAGE.RunStatisticSuccess)
        fetchAllAssetHistories()
    }, [fetchAllAssetHistories])

    return (<div className={"admin-table-wrapper"}>
        <AdminPlayerStatisticCard players={players} />
        <Card>
            <Tabs
                type={"card"}
                items={[
                    {
                        label: `Danh Sách Cược`,
                        key: '1',
                        children: <AdminBetHistoryTable data={betHistoryList} players={players} onUpdateSuccess={handleUpdateBetSuccess}/>,
                    },
                    {
                        label: `Dữ Liệu Gốc`,
                        key: '2',
                        children: <AdminRawBetManagementTab onSuccessAction={handleUpdateBetSuccess}/>,
                    },
                    {
                        label: `Lịch Sử Thanh Toán`,
                        key: '3',
                        children: <AdminPlayerAssetHistoryTable onStatisticSuccess={handleRunStatisticSuccess} data={assetHistoryList}/>,
                    },
                ]}
            />
        </Card>
    </div>)
}

export default AdminPage