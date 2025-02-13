import { useAddPaymentHistoryMutation, usePlayerQuery } from '@/hooks';
import { PaymentAction, PaymentMethod } from '@/constants/enums';
import { Avatar, Col, InputNumber, Modal, Row, Select } from 'antd';
import { useState } from 'react';

interface AddPlayerAssetHistoryModalProps {
  isOpen: boolean;
  onUpdateSuccess: () => void;
  onClose: () => void;
}

const inputNumberParser = (value: string | undefined): number =>
  Number(value?.replace(/\$\s?|(,*)/g, '') || 0);

const inputNumberFormatter = (value: number | undefined): string =>
  `${value} đ`.replace(/\B(?=(\d{3})+(?!\d))/g, ',');

export function AddPlayerAssetHistoryModal({
  isOpen,
  onUpdateSuccess,
  onClose,
}: AddPlayerAssetHistoryModalProps) {
  const { players } = usePlayerQuery();
  const [selectedPlayer, setSelectedPlayer] = useState<string>();
  const [playerAsset, setPlayerAsset] = useState<number>(0);
  const [amount, setAmount] = useState<number>(0);
  const [action, setAction] = useState<PaymentAction>(PaymentAction.DEPOSIT);
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>(PaymentMethod.MOMO);

  const { mutate: addPaymentHistory, isPending } = useAddPaymentHistoryMutation();

  const handleConfirmAdd = () => {
    if (!selectedPlayer) return;

    addPaymentHistory(
      {
        playerId: selectedPlayer,
        action,
        paymentMethod,
        amount,
      },
      {
        onSuccess: () => {
          onUpdateSuccess();
          onClose();
        },
      }
    );
  };

  const handleChangePlayer = (playerId: string) => {
    setSelectedPlayer(playerId);
    const player = players[playerId];
    if (player) {
      setPlayerAsset(player.totalProfit);
      setAmount(Math.abs(player.totalProfit));

      if (player.totalProfit < 0) {
        setAction(PaymentAction.DEPOSIT);
      } else {
        setAction(PaymentAction.CASHOUT);
      }
    }
  };

  const rowStyle = {
    width: '100%',
    alignItems: 'center',
    margin: '1rem 0',
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
      width="40vw"
      okButtonProps={{
        disabled: !selectedPlayer || amount === 0,
        loading: isPending,
      }}
    >
      <Row style={rowStyle}>
        <Col span={7}>Người Cược:</Col>
        <Col span={16}>
          <Select
            allowClear={false}
            value={selectedPlayer}
            onChange={handleChangePlayer}
            style={{ width: '100%' }}
          >
            {Object.values(players).map((player) => (
              <Select.Option key={player.playerId} value={player.playerId}>
                <Row>
                  <Avatar src={player.avatarUrl} style={{ marginRight: 8 }} />
                  <span>{player.playerName}</span>
                </Row>
              </Select.Option>
            ))}
          </Select>
        </Col>
      </Row>
      <Row style={rowStyle}>
        <Col span={7}>Lợi Nhuận:</Col>
        <Col span={16}>
          <InputNumber
            style={{
              width: '100%',
              backgroundColor: '#f7f7f7',
              color: playerAsset > 0 ? 'green' : playerAsset < 0 ? 'red' : 'black',
            }}
            disabled
            value={playerAsset}
            formatter={inputNumberFormatter}
            parser={inputNumberParser}
          />
        </Col>
      </Row>
      <Row style={rowStyle}>
        <Col span={7}>Hành Động:</Col>
        <Col span={16}>
          <Select
            allowClear={false}
            value={action}
            onChange={(value: PaymentAction) => setAction(value)}
            style={{ width: '100%' }}
          >
            <Select.Option value="DEPOSIT">Thanh Toán Nợ / Nạp Tiền</Select.Option>
            <Select.Option value="CASHOUT">Rút Tiền Lời</Select.Option>
          </Select>
        </Col>
      </Row>
      <Row style={rowStyle}>
        <Col span={7}>Kênh Thanh Toán:</Col>
        <Col span={16}>
          <Select
            allowClear={false}
            value={paymentMethod}
            onChange={(value: PaymentMethod) => setPaymentMethod(value)}
            style={{ width: '100%' }}
          >
            <Select.Option value="MOMO">Momo</Select.Option>
            <Select.Option value="BANK">Ngân Hàng</Select.Option>
          </Select>
        </Col>
      </Row>
      <Row style={rowStyle}>
        <Col span={7}>Số Tiền:</Col>
        <Col span={16}>
          <InputNumber
            style={{ width: '100%' }}
            value={amount}
            onChange={(value) => setAmount(Math.abs(value || 0))}
            min={0}
            parser={inputNumberParser}
          />
        </Col>
      </Row>
    </Modal>
  );
}
