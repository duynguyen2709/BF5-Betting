import React, {useCallback, useEffect, useState} from 'react'
import {Card, message, Tabs} from 'antd';
import {getAllBetHistory} from "../../apis/BetHistoryApi";
import {MESSAGE} from "../../common/Constant";
import AdminBetHistoryTable from "../../components/AdminBetHistoryTable";
import RawBetInfoCard from "../../components/RawBetInfoCard";
import AdminPlayerStatisticCard from "../../components/AdminPlayerStatisticCard";
import {usePlayerContextHook} from "../../hooks";

import './index.scss'
import AdminPlayerAssetHistoryTable from "../../components/AdminPlayerAssetHistoryTable";

const AdminPage = () => {
    const [betHistoryList, setBetHistoryList] = useState([])
    const {players, fetchPlayersData} = usePlayerContextHook()

    const fetchAllBets = useCallback(() => {
        getAllBetHistory().then(data => setBetHistoryList(data))
    }, [])

    useEffect(() => {
        fetchAllBets()
    }, [fetchAllBets])

    const handleUpdateBetSuccess = useCallback(() => {
        message.success(MESSAGE.UpdateBetSuccess)
        setBetHistoryList([])
        fetchAllBets()
        fetchPlayersData()
    }, [fetchAllBets, fetchPlayersData])

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
                        children: <RawBetInfoCard onSuccessAction={handleUpdateBetSuccess}/>,
                    },
                    {
                        label: `Lịch Sử Thanh Toán`,
                        key: '3',
                        children: <AdminPlayerAssetHistoryTable/>,
                    },
                ]}
            />
        </Card>
    </div>)
}

export default AdminPage