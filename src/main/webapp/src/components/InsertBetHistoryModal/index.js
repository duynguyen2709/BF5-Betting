import React, { useCallback, useState } from "react";
import { Avatar, Col, Modal, Row, Select } from "antd";
import { insertBetHistory } from "../../apis/BetHistoryApi";
import { BET_TYPE } from "../../common/Constant";
import { usePlayerContextHook } from "../../hooks";
import { isSingleBet } from "../../utils/BetHistoryUtil";
import BetHistoryCard from "../BetHistoryCard";

const { Option } = Select;

const InsertBetHistoryModal = ({ data, isOpen, onUpdateSuccess, onClose }) => {
  const { players } = usePlayerContextHook();
  const [selectedPlayer, setSelectedPlayer] = useState();
  const betType = isSingleBet(data) ? BET_TYPE.Single : BET_TYPE.Accumulator;

  const handleChangePlayer = useCallback((value) => {
    setSelectedPlayer(value);
  }, []);

  const handleConfirmAdd = useCallback(() => {
    const requestData = {
      ...data,
      playerId: selectedPlayer,
    };
    insertBetHistory(requestData)
      .then(() => onUpdateSuccess())
      .finally(() => onClose());
  }, [selectedPlayer, data, onUpdateSuccess, onClose]);

  return (
    <Modal
      title="Thêm Cược Mới"
      destroyOnClose
      centered
      maskClosable={false}
      closable={false}
      open={isOpen}
      onOk={handleConfirmAdd}
      onCancel={onClose}
    >
      {data && <BetHistoryCard data={data} type={betType} isAdminView={true} />}
      <Row style={{ alignItems: "center", margin: "1rem 0.5rem 0 0.5rem" }}>
        <Col span={6}>Người Cược:</Col>
        <Col span={17} offset={1}>
          <Select
            allowClear={false}
            value={selectedPlayer}
            onChange={handleChangePlayer}
            style={{ width: "100%" }}
          >
            {Object.values(players).map((ele) => (
              <Option key={ele?.playerId} value={ele?.playerId}>
                <Row>
                  <Avatar src={ele?.avatarUrl} style={{ marginRight: 8 }} />
                  <span>{ele?.playerName}</span>
                </Row>
              </Option>
            ))}
          </Select>
        </Col>
      </Row>
    </Modal>
  );
};

export default InsertBetHistoryModal;
