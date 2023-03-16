import React, {useCallback, useContext, useEffect, useState} from 'react'
import {Avatar, Button, Col, message, Row, Table} from 'antd';
import PlayersContext from "../../common/PlayersContext";
import BetResultTag from "../../components/BetResultTag";
import ModalUpdateBetResult from "../../components/ModalUpdateBetResult";
import {getAllBetHistory} from "../../apis/BetHistoryApi";

import './index.scss'
import {parseBetEvent} from "../../utils/betHistoryUtil";
import {BET_RESULT} from "../../common/Constant";

const AdminPage = () => {
    const [betHistory, setBetHistory] = useState([])
    const [modalUpdateOpen, setModalUpdateOpen] = useState(false)
    const [currentUpdateBet, setCurrentUpdateBet] = useState()
    const playerContext = useContext(PlayersContext)
    const {players} = playerContext

    useEffect(() => {
        getAllBetHistory().then(data => setBetHistory(data))
    }, [])

    const handleUpdateSuccess = useCallback(() => {
        message.success('Cập nhật kết quả thành công')
        setBetHistory([])
        setCurrentUpdateBet(null)
        setModalUpdateOpen(false)
        getAllBetHistory().then(data => setBetHistory(data))
    })

    const handleCloseModal = useCallback(() => {
        setCurrentUpdateBet(null)
        setModalUpdateOpen(false)
    }, [])

    const handleClickUpdateBetResult = useCallback((data) => {
        setCurrentUpdateBet(data)
        setModalUpdateOpen(true)
    }, [])

    const columns = [
        {
            title: 'Người Cược',
            key: 'player',
            width: 200,
            render: (_, record) => {
                const betOwner = players[record.playerId]
                return <Row style={{alignItems: 'center'}}>
                    <Avatar size={32} src={betOwner.avatarUrl} style={{marginRight: 8, marginLeft: 8}}/>
                    <p style={{marginBottom: 0}}>{betOwner.playerName}</p>
                </Row>
            }
        },
        {
            title: 'Trận Đấu',
            key: 'match',
            width: 450,
            render: (_, record) => {
                return <Row>
                    <Col span={10} className={"team-data"}>
                        {record.firstTeamLogoUrl &&
                            <img alt={"first-team-logo"} src={record.firstTeamLogoUrl} className={"team-logo"}/>}
                        <b className={"team-name"}>{record.firstTeam}</b>
                    </Col>
                    <Col span={1} className={"team-data"}>
                        <h1 className={"team-data-divider"}>:</h1>
                    </Col>
                    <Col offset={1} span={10} className={"team-data"}>
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
            key: 'betAmount',
            render: (_, record) => (`${record.betAmount.toLocaleString()}đ`)
        },
        {
            title: 'Tỉ Lệ',
            key: 'ratio',
            dataIndex: 'ratio'
        },
        {
            title: 'Lợi Nhuận',
            key: 'actualProfit',
            render: (_, record) => {
                return record.actualProfit && `${record.actualProfit.toLocaleString()}đ`
            }
        },
        {
            title: 'Trạng Thái',
            key: 'result',
            render: (_, record) => <BetResultTag result={record.result} />
        },
        {
            title: 'Thời Gian Cược',
            key: 'betTime',
            dataIndex: 'betTime'
        },
        {
            title: 'Hành Động',
            key: 'action',
            render: (_, record) => {
                if (record.result !== BET_RESULT.NOT_FINISHED) {
                    return null
                }
                return <Button type="primary"
                               onClick={() => handleClickUpdateBetResult(record)}>
                    Cập Nhật
                </Button>
            }
        },
    ];

    return (<div className={"admin-table-wrapper"}>
        {modalUpdateOpen && <ModalUpdateBetResult data={currentUpdateBet}
                                                  isOpen={modalUpdateOpen}
                                                  onUpdateSuccess={handleUpdateSuccess}
                                                  onClose={handleCloseModal}/>}
        <Table size="middle"
               bordered
               columns={columns}
               dataSource={betHistory}
        />
    </div>)
}

export default AdminPage