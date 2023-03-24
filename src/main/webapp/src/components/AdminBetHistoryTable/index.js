import {Avatar, Button, Col, Row, Table} from "antd";
import React, {useCallback, useState} from "react";
import {BET_RESULT} from "../../common/Constant";
import {parseBetEvent} from "../../utils/BetHistoryUtil";
import BetResultTag from "../BetResultTag";
import MoneyTextCell from "../MoneyTextCell";
import UpdateBetResultModal from "../UpdateBetResultModal";

import './index.scss'

const AdminBetHistoryTable = ({data, players, onUpdateSuccess}) => {
    const [modalUpdateOpen, setModalUpdateOpen] = useState(false)
    const [currentUpdateBet, setCurrentUpdateBet] = useState()

    const handleCloseModal = useCallback(() => {
        setCurrentUpdateBet(null)
        setModalUpdateOpen(false)
    }, [])

    const handleClickUpdateBetResult = useCallback((data) => {
        setCurrentUpdateBet(data)
        setModalUpdateOpen(true)
    }, [])

    const handleUpdateSuccess = useCallback(() => {
        setCurrentUpdateBet(null)
        setModalUpdateOpen(false)
        onUpdateSuccess()
    }, [onUpdateSuccess])

    const columns = [
        {
            title: 'Mã Cược',
            key: 'id',
            dataIndex: 'id',
            width: 130,
        },
        {
            title: 'Người Cược',
            key: 'player',
            width: 140,
            render: (_, record) => {
                const betOwner = players[record.playerId]
                if (!betOwner) {
                    return null
                }
                return <Row style={{alignItems: 'center'}}>
                    <Avatar size={32} src={betOwner.avatarUrl} style={{marginRight: 8, marginLeft: 8}}/>
                    <p style={{marginBottom: 0}}>{betOwner.playerName}</p>
                </Row>
            },
            filters: Object.values(players).map(ele => ({
                key: ele.playerId, text: ele.playerName, value: ele.playerName
            })),
            onFilter: (value, record) => {
                const betOwner = players[record.playerId]
                return betOwner?.playerName?.includes(value)
            },
        },
        {
            title: 'Trận Đấu',
            key: 'match',
            width: 450,
            render: (_, record) => {
                return <Row>
                    <Col span={11} className={"team-data"}>
                        {record.firstTeamLogoUrl &&
                            <img alt={"first-team-logo"} src={record.firstTeamLogoUrl} className={"team-logo"}/>}
                        <b className={"team-name"}>{record.firstTeam}</b>
                    </Col>
                    <Col span={1} className={"team-data"}>
                        <h1 className={"team-data-divider"}>:</h1>
                    </Col>
                    <Col span={11} className={"team-data"}>
                        {record.secondTeamLogoUrl &&
                            <img alt={"second-team-logo"} src={record.secondTeamLogoUrl} className={"team-logo"}/>}
                        <b className={"team-name"}>{record.secondTeam}</b>
                    </Col>
                </Row>
            }
        },
        {
            title: 'Loại Cược',
            key: 'event',
            render: (_, record) => (parseBetEvent(record))
        },
        {
            title: 'Tiền Cược',
            children: [
                {
                    title: 'Tiền Gốc',
                    key: 'betAmount',
                    width: 80,
                    render: (_, record) => (`${record.betAmount.toLocaleString()}đ`)
                },
                {
                    title: 'Tỉ Lệ',
                    key: 'ratio',
                    dataIndex: 'ratio',
                    width: 60,
                },
                {
                    title: 'Lợi Nhuận',
                    key: 'actualProfit',
                    width: 90,
                    render: (_, record) => {
                        return record.actualProfit && <MoneyTextCell value={record.actualProfit}/>
                    }
                },
            ]
        },

        {
            title: 'Trạng Thái',
            key: 'result',
            width: 120,
            render: (_, record) => <BetResultTag result={record.result}/>,
            filters: Object.values(BET_RESULT).map(ele => ({
                key: ele.result, text: ele.text, value: ele.text
            })),
            onFilter: (value, record) => {
                const currentBetResult = Object.values(BET_RESULT).find(ele => ele.result === record.result)
                return currentBetResult?.text === value
            },
        },
        {
            title: 'Thời Gian Cược',
            key: 'betTime',
            dataIndex: 'betTime',
            width: 140,
        },
        {
            title: 'Hành Động',
            key: 'action',
            width: 120,
            render: (_, record) => {
                if (record.result !== BET_RESULT.Unfinished.result) {
                    return null
                }
                return <Button type="primary"
                               onClick={() => handleClickUpdateBetResult(record)}>
                    Cập Nhật
                </Button>
            }
        },
    ];

    return <>
        {modalUpdateOpen && <UpdateBetResultModal data={currentUpdateBet}
                                                  isOpen={modalUpdateOpen}
                                                  onUpdateSuccess={handleUpdateSuccess}
                                                  onClose={handleCloseModal}/>}
        <Table size="middle"
           className="table-bet-history"
           rowKey="id"
           bordered
           columns={columns}
           dataSource={data}
           pagination={{
               pageSize: 10,
               showSizeChanger: false,
               showTotal: (total) => `Tổng: ${total} cược`
           }}
    />
    </>
}

export default AdminBetHistoryTable