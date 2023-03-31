import React, {useCallback, useContext, useState} from "react";
import {Avatar, Col, Modal, Row, Select, Table} from "antd";
import {insertBetHistoryInBatch} from "../../apis/BetHistoryApi";
import PlayersContext from "../../common/PlayersContext";
import {buildCommonTableColumn} from "../../utils/BetHistoryUtil";

const {Option} = Select

const buildTableColumns = (players) => {
    const columns = buildCommonTableColumn(players)
    columns.shift()
    return columns
}

const BatchInsertBetHistoryModal = ({data, isOpen, onUpdateSuccess, onClose}) => {
    const playerContext = useContext(PlayersContext)
    const {players} = playerContext
    const [selectedPlayer, setSelectedPlayer] = useState()

    const handleChangePlayer = useCallback((value) => {
        setSelectedPlayer(value)
    }, [])

    const handleConfirmAdd = useCallback(() => {
        const requestData = data.map(bet => ({
            ...bet,
            playerId: selectedPlayer
        }))
        insertBetHistoryInBatch(requestData)
            .then(() => onUpdateSuccess())
            .finally(() => onClose())
    }, [selectedPlayer, data, onUpdateSuccess, onClose])

    const columns = buildTableColumns(players)

    return <Modal
        title="Thêm Cược Mới"
        destroyOnClose
        centered
        maskClosable={false}
        closable={false}
        open={isOpen}
        onOk={handleConfirmAdd}
        onCancel={onClose}
        width={'80vw'}
    >
        <Table size="small"
               className="table-bet-history"
               rowKey="betId"
               bordered
               columns={columns}
               dataSource={data}/>
        <Row style={{alignItems: 'center', margin: '1rem 0.5rem 0 0.5rem'}}>
            <Col span={2}>Người Cược:</Col>
            <Col span={4}>
                <Select allowClear={false}
                        value={selectedPlayer}
                        onChange={handleChangePlayer}
                        style={{width: '100%'}}>
                    {Object.values(players)
                        .map(ele => (
                            <Option key={ele?.playerId} value={ele?.playerId}>
                                <Row>
                                    <Avatar src={ele?.avatarUrl} style={{marginRight: 8}}/>
                                    <span>{ele?.playerName}</span>
                                </Row>
                            </Option>))}
                </Select>
            </Col>
        </Row>
    </Modal>
}

export default BatchInsertBetHistoryModal