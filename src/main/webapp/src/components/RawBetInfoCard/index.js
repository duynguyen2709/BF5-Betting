import React, {useCallback, useContext, useState} from "react";
import QueryRawBetInfoForm from "../QueryRawBetInfoForm";
import {getRawBetInfo, updateBetResultFromRaw} from "../../apis/BetHistoryApi";
import PlayersContext from "../../common/PlayersContext";
import CenterLoadingSpinner from "../CenterLoadingSpinner";
import InsertBetHistoryModal from "../InsertBetHistoryModal";
import RawBetTable from "./RawBetTable";
import {LOCAL_STORAGE_KEY} from "../../common/Constant";

const RawBetInfoCard = ({onSuccessAction}) => {
    const [isFetching, setIsFetching] = useState(false)
    const [rawBetList, setRawBetList] = useState([])
    const [modalAddOpen, setModalAddOpen] = useState(false)
    const [currentAddBet, setCurrentAddBet] = useState()
    const playerContext = useContext(PlayersContext)
    const {players} = playerContext

    const queryRawBetList = useCallback(() => {
        setRawBetList([])
        setIsFetching(true)
        const queryParams = JSON.parse(localStorage.getItem(LOCAL_STORAGE_KEY.RawBetQueryParams))
        getRawBetInfo(queryParams)
            .then(data => setRawBetList(data))
            .finally(() => setIsFetching(false))
    }, [])

    const handleProcessRawBetSuccess = useCallback(() => {
        queryRawBetList()
        onSuccessAction()
    }, [queryRawBetList, onSuccessAction])

    const handleFetchRawBetList = useCallback((values) => {
        const {sessionToken, dateRange} = values;
        const queryParams = {
            sessionToken,
            startDate: dateRange[0].format('YYYY-MM-DD'),
            endDate: dateRange[1].format('YYYY-MM-DD'),
        }
        localStorage.setItem(LOCAL_STORAGE_KEY.RawBetQueryParams, JSON.stringify(queryParams))
        queryRawBetList()
    }, [queryRawBetList])

    const handleOpenModalAddBet = useCallback((record) => {
        setCurrentAddBet(record)
        setModalAddOpen(true)
    }, [])

    const handleCloseModalAdd = useCallback(() => {
        setCurrentAddBet(null)
        setModalAddOpen(false)
    }, [])

    const handleConfirmUpdate = useCallback((record) => {
        updateBetResultFromRaw(record).then(() => handleProcessRawBetSuccess())
    }, [handleProcessRawBetSuccess])

    return <>
        {modalAddOpen &&
            <InsertBetHistoryModal data={currentAddBet}
                               isOpen={modalAddOpen}
                               onClose={handleCloseModalAdd}
                               onUpdateSuccess={handleProcessRawBetSuccess}/>}
        <QueryRawBetInfoForm onSubmit={handleFetchRawBetList}/>
        {isFetching ?
            <CenterLoadingSpinner /> :
            <RawBetTable data={rawBetList}
                         players={players}
                         loading={isFetching}
                         onClickAdd={handleOpenModalAddBet}
                         onClickUpdate={handleConfirmUpdate}/>}

    </>
}

export default RawBetInfoCard