import React, {useCallback, useContext, useState} from "react";
import QueryRawBetInfoForm from "../QueryRawBetInfoForm";
import {getRawBetInfo, updateBetResultFromRaw} from "../../apis/BetHistoryApi";
import PlayersContext from "../../common/PlayersContext";
import InsertBetHistoryModal from "../InsertBetHistoryModal";
import RawBetTable from "./RawBetTable";

const RawBetInfoCard = ({onSuccessAction}) => {
    const [rawBetList, setRawBetList] = useState([])
    const [modalAddOpen, setModalAddOpen] = useState(false)
    const [currentAddBet, setCurrentAddBet] = useState()
    const [queryParam, setQueryParam] = useState()
    const playerContext = useContext(PlayersContext)
    const {players} = playerContext

    const queryRawBetList = useCallback(() => {
        getRawBetInfo(queryParam).then(data => setRawBetList(data))
    }, [queryParam])

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
        setQueryParam(queryParams)
        setRawBetList([])
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
        <InsertBetHistoryModal data={currentAddBet}
                               isOpen={modalAddOpen}
                               onClose={handleCloseModalAdd}
                               onUpdateSuccess={handleProcessRawBetSuccess}/>
        <QueryRawBetInfoForm onSubmit={handleFetchRawBetList}/>
        <RawBetTable data={rawBetList}
                     players={players}
                     onClickAdd={handleOpenModalAddBet}
                     onClickUpdate={handleConfirmUpdate}/>
    </>
}

export default RawBetInfoCard