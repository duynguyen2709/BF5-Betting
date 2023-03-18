import React, {useCallback, useContext, useEffect, useState} from 'react'
import {Avatar, Button, Card, Col, message, Row, Table, Tabs} from 'antd';
import PlayersContext from "../../common/PlayersContext";
import BetResultTag from "../../components/BetResultTag";
import UpdateBetResultModal from "../../components/UpdateBetResultModal";
import {getAllBetHistory} from "../../apis/BetHistoryApi";

import './index.scss'
import {parseBetEvent} from "../../utils/betHistoryUtil";
import {BET_RESULT} from "../../common/Constant";
import PlayerCard from "../../components/PlayerCard";
import RawBetInfoCard from "../../components/RawBetInfoCard";
import MoneyTextCell from "../../components/MoneyTextCell";

const AdminPage = () => {
    const [betHistory, setBetHistory] = useState([])
    const [modalUpdateOpen, setModalUpdateOpen] = useState(false)
    const [currentUpdateBet, setCurrentUpdateBet] = useState()
    const playerContext = useContext(PlayersContext)
    const {players, fetchPlayersData} = playerContext

    useEffect(() => {
        getAllBetHistory().then(data => setBetHistory(data))
    }, [])

    const handleUpdateSuccess = useCallback(() => {
        message.success('Cập nhật kết quả thành công')
        setBetHistory([])
        setCurrentUpdateBet(null)
        setModalUpdateOpen(false)
        getAllBetHistory().then(data => setBetHistory(data))
        fetchPlayersData()
    }, [fetchPlayersData])

    const handleRawBetActionSuccess = useCallback(() => {
        message.success('Cập nhật cược thành công')
        setBetHistory([])
        getAllBetHistory().then(data => setBetHistory(data))
        fetchPlayersData()
    }, [fetchPlayersData])

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
            width: 150,
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
                return betOwner.playerName.includes(value)
            },
        },
        {
            title: 'Trận Đấu',
            key: 'match',
            width: 500,
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
                    width: 100,
                    render: (_, record) => (`${record.betAmount.toLocaleString()}đ`)
                },
                {
                    title: 'Tỉ Lệ',
                    key: 'ratio',
                    dataIndex: 'ratio',
                    width: 80,
                },
                {
                    title: 'Lợi Nhuận',
                    key: 'actualProfit',
                    width: 100,
                    render: (_, record) => {
                        return record.actualProfit && <MoneyTextCell value={record.actualProfit} />
                    }
                },
            ]
        },

        {
            title: 'Trạng Thái',
            key: 'result',
            width: 150,
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
            width: 150,
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

    return (<div className={"admin-table-wrapper"}>
        {modalUpdateOpen && <UpdateBetResultModal data={currentUpdateBet}
                                                  isOpen={modalUpdateOpen}
                                                  onUpdateSuccess={handleUpdateSuccess}
                                                  onClose={handleCloseModal}/>}

        <Card className={"card-player-list-wrapper"}>
            <Row>
                {Object.values(players).map(player =>
                    <Col span={6}>
                        <PlayerCard key={player.playerId} data={player}/>
                    </Col>)
                }
            </Row>
        </Card>

        <Card>
            <Tabs
                type={"card"}
                items={[
                    {
                        label: `Danh Sách Cược`,
                        key: '1',
                        children: <Table size="middle"
                                         className="table-bet-history"
                                         rowKey="id"
                                         bordered
                                         columns={columns}
                                         dataSource={betHistory}
                                         pagination={{
                                             pageSize: 10,
                                             showSizeChanger: false,
                                             showTotal: (total) => `Tổng: ${total} cược`
                                         }}
                        />,
                    },
                    {
                        label: `Dữ Liệu Gốc`,
                        key: '2',
                        children: <RawBetInfoCard onSuccessAction={handleRawBetActionSuccess}/>,
                    },
                ]}
            />
        </Card>
    </div>)
}

export default AdminPage