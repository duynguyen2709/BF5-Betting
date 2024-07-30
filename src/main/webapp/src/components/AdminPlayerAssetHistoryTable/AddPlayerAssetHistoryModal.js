import React, { useState } from "react";
import { Avatar, Col, InputNumber, Modal, Row, Select } from "antd";
import { usePlayerContextHook } from "../../hooks";
import { addPaymentHistory } from "../../apis/StatisticApi";

const { Option } = Select;

const AddPlayerAssetHistoryModal = ({ isOpen, onUpdateSuccess, onClose }) => {
  const { players } = usePlayerContextHook();
  const [selectedPlayer, setSelectedPlayer] = useState("");
  const [playerAsset, setPlayerAsset] = useState(0);
  const [amount, setAmount] = useState(0);
  const [action, setAction] = useState("DEPOSIT");
  const [paymentMethod, setPaymentMethod] = useState("MOMO");

  const handleConfirmAdd = () => {
    addPaymentHistory({
      playerId: selectedPlayer,
      action,
      paymentMethod,
      amount,
    })
      .then(() => onUpdateSuccess())
      .finally(() => onClose());
  };

  const handleChangePlayer = (playerId) => {
    setSelectedPlayer(playerId);
    setPlayerAsset(players[playerId].totalProfit);
    setAmount(Math.abs(players[playerId].totalProfit));
  };

  return (
    <Modal
      title="Thêm Dữ Liệu Thanh Toán Mới"
      destroyOnClose
      centered
      maskClosable={false}
      closable={false}
      open={isOpen}
      onOk={handleConfirmAdd}
      onCancel={onClose}
      width={"30vw"}
      okButtonProps={{
        disabled: !selectedPlayer || amount === 0,
      }}
    >
      <Row
        style={{
          width: "100%",
          alignItems: "center",
        }}
      >
        <Col span={7}>Người Cược:</Col>
        <Col span={16}>
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
      <Row
        style={{
          width: "100%",
          alignItems: "center",
          margin: "1rem 0",
        }}
      >
        <Col span={7}>Lợi Nhuận:</Col>
        <Col span={16}>
          <InputNumber
            style={{
              width: "100%",
              backgroundColor: "#f7f7f7",
              color:
                playerAsset > 0 ? "green" : playerAsset < 0 ? "red" : "black",
            }}
            disabled
            value={playerAsset}
            formatter={(value) =>
              `${value} đ`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")
            }
            parser={(value) => value.replace(/\$\s?|(,*)/g, "")}
          />
        </Col>
      </Row>
      <Row
        style={{
          width: "100%",
          alignItems: "center",
          margin: "1rem 0",
        }}
      >
        <Col span={7}>Hành Động:</Col>
        <Col span={16}>
          <Select
            allowClear={false}
            value={action}
            onChange={setAction}
            style={{ width: "100%" }}
          >
            <Option value="DEPOSIT">Thanh Toán Nợ / Nạp Tiền</Option>
            <Option value="CASHOUT">Rút Tiền Lời</Option>
          </Select>
        </Col>
      </Row>
      <Row
        style={{
          width: "100%",
          alignItems: "center",
          margin: "1rem 0",
        }}
      >
        <Col span={7}>Kênh Thanh Toán:</Col>
        <Col span={16}>
          <Select
            allowClear={false}
            value={paymentMethod}
            onChange={setPaymentMethod}
            style={{ width: "100%" }}
          >
            <Option value="MOMO">Momo</Option>
            <Option value="BANK">Ngân Hàng</Option>
          </Select>
        </Col>
      </Row>
      <Row
        style={{
          width: "100%",
          alignItems: "center",
          margin: "1rem 0",
        }}
      >
        <Col span={7}>Số Tiền:</Col>
        <Col span={16}>
          <InputNumber
            style={{
              width: "100%",
            }}
            value={amount}
            onChange={(e) => setAmount(Math.abs(e))}
            min={0}
            stringMode={false}
          />
        </Col>
      </Row>
    </Modal>
  );
};

export default AddPlayerAssetHistoryModal;
