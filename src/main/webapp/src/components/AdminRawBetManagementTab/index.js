import React, { useCallback, useState } from "react";
import { Col, message, Row } from "antd";
import {
  getRawBetData,
  updateBatchResultFromRaw,
  updateResultFromRaw,
} from "../../apis/RawBetApi";
import {
  LOCAL_STORAGE_KEY,
  MESSAGE,
  RAW_BET_STATUS,
} from "../../common/Constant";
import { usePlayerContextHook } from "../../hooks";
import BatchInsertRawBetButton from "../BatchInsertRawBetButton";
import BatchInsertBetHistoryModal from "../BatchInsertBetHistoryModal";
import BatchUpdateRawBetButton from "../BatchUpdateRawBetButton";
import CenterLoadingSpinner from "../CenterLoadingSpinner";
import InsertBetHistoryModal from "../InsertBetHistoryModal";
import QueryRawBetInfoForm from "./QueryRawBetInfoForm";
import RawBetTable from "./RawBetTable";

const AdminRawBetManagementTab = ({ onSuccessAction }) => {
  const [isFetching, setIsFetching] = useState(false);
  const [rawBetList, setRawBetList] = useState([]);
  const [modalAddSingleOpen, setModalAddSingleOpen] = useState(false);
  const [modalAddBatchOpen, setModalAddBatchOpen] = useState(false);
  const [currentAddBet, setCurrentAddBet] = useState(undefined);
  const [currentBatchAddBet, setCurrentBatchAddBet] = useState([]);
  const { players } = usePlayerContextHook();

  const queryRawBetList = useCallback(() => {
    setRawBetList([]);
    setIsFetching(true);
    const queryParams = JSON.parse(
      localStorage.getItem(LOCAL_STORAGE_KEY.RawBetQueryParams)
    );
    getRawBetData(queryParams)
      .then((data) => setRawBetList(data))
      .finally(() => setIsFetching(false));
  }, []);

  const handleProcessRawBetSuccess = useCallback(() => {
    setCurrentBatchAddBet([]);
    setCurrentAddBet(undefined);
    setModalAddBatchOpen(false);
    setModalAddSingleOpen(false);
    queryRawBetList();
    onSuccessAction();
  }, [queryRawBetList, onSuccessAction]);

  const handleFetchRawBetList = useCallback(
    (values) => {
      const { sessionToken, dateRange } = values;
      const queryParams = {
        sessionToken,
        startDate: dateRange[0].format("YYYY-MM-DD"),
        endDate: dateRange[1].format("YYYY-MM-DD"),
      };
      localStorage.setItem(
        LOCAL_STORAGE_KEY.RawBetQueryParams,
        JSON.stringify(queryParams)
      );
      queryRawBetList();
    },
    [queryRawBetList]
  );

  const handleOpenModalAddSingleBet = useCallback((record) => {
    setCurrentAddBet(record);
    setModalAddSingleOpen(true);
  }, []);

  const handleCloseModalAddSingleBet = useCallback(() => {
    setCurrentAddBet(null);
    setModalAddSingleOpen(false);
  }, []);

  const toggleModalAddBatchBet = useCallback(() => {
    setModalAddBatchOpen(!modalAddBatchOpen);
  }, [modalAddBatchOpen]);

  const handleConfirmUpdate = useCallback(
    (record) => {
      updateResultFromRaw(record).then(() => handleProcessRawBetSuccess());
    },
    [handleProcessRawBetSuccess]
  );

  const handleUpdateBatchFromRaw = useCallback(() => {
    const betListToBeUpdated = rawBetList.filter(
      (bet) => bet.rawStatus === RAW_BET_STATUS.ResultReadyToBeUpdated
    );
    if (betListToBeUpdated.length === 0) {
      message.warn(MESSAGE.EmptyBetToBeUpdated, 4);
      return;
    }
    updateBatchResultFromRaw(betListToBeUpdated).then(() =>
      handleProcessRawBetSuccess()
    );
  }, [rawBetList, handleProcessRawBetSuccess]);

  return (
    <>
      {modalAddSingleOpen && (
        <InsertBetHistoryModal
          data={currentAddBet}
          isOpen={modalAddSingleOpen}
          onClose={handleCloseModalAddSingleBet}
          onUpdateSuccess={handleProcessRawBetSuccess}
        />
      )}
      {modalAddBatchOpen && (
        <BatchInsertBetHistoryModal
          data={currentBatchAddBet}
          isOpen={modalAddBatchOpen}
          onClose={toggleModalAddBatchBet}
          onUpdateSuccess={handleProcessRawBetSuccess}
        />
      )}
      <Row justify={"space-between"}>
        <QueryRawBetInfoForm onSubmit={handleFetchRawBetList} />
        <Col span={8} style={{ display: "flex", justifyContent: "flex-end" }}>
          <BatchInsertRawBetButton
            disabled={currentBatchAddBet.length === 0}
            onClickAdd={toggleModalAddBatchBet}
          />
          <BatchUpdateRawBetButton
            onUpdateBatchFromRaw={handleUpdateBatchFromRaw}
          />
        </Col>
      </Row>
      {isFetching ? (
        <CenterLoadingSpinner />
      ) : (
        <RawBetTable
          data={rawBetList}
          players={players}
          loading={isFetching}
          onClickAdd={handleOpenModalAddSingleBet}
          onClickUpdate={handleConfirmUpdate}
          onSelectBatchBet={setCurrentBatchAddBet}
        />
      )}
    </>
  );
};

export default AdminRawBetManagementTab;
