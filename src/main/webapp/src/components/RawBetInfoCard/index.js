import React, {useCallback, useContext, useState} from "react";
import {message, Row} from "antd";
import {getRawBetData, updateBatchResultFromRaw, updateResultFromRaw} from "../../apis/RawBetApi";
import {LOCAL_STORAGE_KEY, MESSAGE, RAW_BET_STATUS} from "../../common/Constant";
import PlayersContext from "../../common/PlayersContext";
import BatchUpdateRawBetButton from "../BatchUpdateRawBetButton";
import CenterLoadingSpinner from "../CenterLoadingSpinner";
import InsertBetHistoryModal from "../InsertBetHistoryModal";
import QueryRawBetInfoForm from "../QueryRawBetInfoForm";
import RawBetTable from "./RawBetTable";

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
        getRawBetData(queryParams)
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
        updateResultFromRaw(record).then(() => handleProcessRawBetSuccess())
    }, [handleProcessRawBetSuccess])

    const handleUpdateBatchFromRaw = useCallback(() => {
        const betListToBeUpdated = rawBetList
            .filter(bet => bet.rawStatus === RAW_BET_STATUS.ResultReadyToBeUpdated)
            .map(ele => ({
                betId: ele.id,
                score: ele.score,
                result: ele.result,
                actualProfit: ele.actualProfit
            }))
        if (betListToBeUpdated.length === 0) {
            message.warn(MESSAGE.EmptyBetToBeUpdated, 4)
            return
        }
        updateBatchResultFromRaw(betListToBeUpdated).then(() => handleProcessRawBetSuccess())
    }, [rawBetList, handleProcessRawBetSuccess])

    return <>
        {modalAddOpen &&
            <InsertBetHistoryModal data={currentAddBet}
                                   isOpen={modalAddOpen}
                                   onClose={handleCloseModalAdd}
                                   onUpdateSuccess={handleProcessRawBetSuccess}/>}
        <Row justify={"space-between"}>
            <QueryRawBetInfoForm onSubmit={handleFetchRawBetList}/>
            <BatchUpdateRawBetButton onUpdateBatchFromRaw={handleUpdateBatchFromRaw}/>
        </Row>
        {isFetching ?
            <CenterLoadingSpinner/> :
            <RawBetTable data={rawBetList}
                         players={players}
                         loading={isFetching}
                         onClickAdd={handleOpenModalAddBet}
                         onClickUpdate={handleConfirmUpdate}/>}

    </>
}

export default RawBetInfoCard