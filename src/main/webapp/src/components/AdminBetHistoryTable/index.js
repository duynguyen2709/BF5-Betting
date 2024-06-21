import React, { useCallback, useState } from "react";
import { Button, Table } from "antd";
import { BET_RESULT, BET_TYPE } from "../../common/Constant";
import { buildCommonTableColumn } from "../../utils/BetHistoryUtil";
import UpdateBetResultModal from "../UpdateBetResultModal";

import "./index.scss";

const convertBetHistoryRowData = (data) => {
  return data?.map((ele) => {
    if (ele.betType === BET_TYPE.Single) {
      return {
        ...ele,
        ...ele.events[0],
      };
    }
    return ele;
  });
};

const AdminBetHistoryTable = ({ data, players, onUpdateSuccess }) => {
  const [modalUpdateOpen, setModalUpdateOpen] = useState(false);
  const [currentUpdateBet, setCurrentUpdateBet] = useState();

  const rowData = convertBetHistoryRowData(data);

  const handleCloseModal = useCallback(() => {
    setCurrentUpdateBet(null);
    setModalUpdateOpen(false);
  }, []);

  const handleClickUpdateBetResult = useCallback((data) => {
    setCurrentUpdateBet(data);
    setModalUpdateOpen(true);
  }, []);

  const handleUpdateSuccess = useCallback(() => {
    setCurrentUpdateBet(null);
    setModalUpdateOpen(false);
    onUpdateSuccess();
  }, [onUpdateSuccess]);

  const columns = buildCommonTableColumn(players);
  columns.push({
    title: "Hành Động",
    key: "action",
    width: 120,
    render: (_, record) => {
      const isNotFinished = record.result === BET_RESULT.Unfinished.result;
      return (
        <>
          {isNotFinished && (
            <Button
              type="primary"
              onClick={() => handleClickUpdateBetResult(record)}
            >
              Cập Nhật
            </Button>
          )}
        </>
      );
    },
  });

  return (
    <>
      {modalUpdateOpen && (
        <UpdateBetResultModal
          data={currentUpdateBet}
          isOpen={modalUpdateOpen}
          onUpdateSuccess={handleUpdateSuccess}
          onClose={handleCloseModal}
        />
      )}
      <Table
        size="middle"
        className="table-bet-history"
        rowKey="betId"
        bordered
        columns={columns}
        dataSource={rowData}
        pagination={{
          defaultPageSize: 10,
          showSizeChanger: true,
          showTotal: (total) => `Tổng: ${total} cược`,
        }}
        scroll={{
          x: 2000,
        }}
      />
    </>
  );
};

export default AdminBetHistoryTable;
