import React, {useCallback, useContext, useState} from "react";
import QueryRawBetInfoForm from "../QueryRawBetInfoForm";
import {Avatar, Button, Col, Popconfirm, Row, Table, Tag} from "antd";
import {QuestionCircleOutlined} from '@ant-design/icons';
import {getRawBetInfo, updateBetResultFromRaw} from "../../apis/BetHistoryApi";
import PlayersContext from "../../common/PlayersContext";
import {parseBetEvent} from "../../utils/betHistoryUtil";
import MoneyTextCell from "../MoneyTextCell";
import BetResultTag from "../BetResultTag";
import {BET_RESULT} from "../../common/Constant";
import InsertBetHistoryModal from "../InsertBetHistoryModal";

const RawStatusTag = ({text}) => {
    switch (text) {
        case "NEW":
            return <Tag color="warning">Chưa Xử Lý</Tag>;
        case "INSERTED":
            return <Tag color="cyan">
                <p style={{marginBottom: 0}}>Đã Lưu Dữ Liệu<br/>Chờ Kết Quả</p>
            </Tag>;
        case "RESULT_READY_TO_BE_UPDATED":
            return <Tag color="blue">
                <p style={{marginBottom: 0}}>Đã Có Kết Quả<br/>Chờ Cập Nhật</p>
            </Tag>;
        case "SETTLED":
            return <Tag color="success">Đã Hoàn Tất</Tag>;
        default:
            return <Tag>{text}</Tag>
    }
}

const RawBetInfoCard = ({onSuccessAction}) => {
    const [rawBetList, setRawBetList] = useState([])
    const [modalAddOpen, setModalAddOpen] = useState(false)
    const [currentAddBet, setCurrentAddBet] = useState()
    const playerContext = useContext(PlayersContext)
    const {players} = playerContext

    const handleFetchRawBetList = useCallback((values) => {
        const {sessionToken, dateRange} = values;
        const queryParams = {
            sessionToken,
            startDate: dateRange[0].format('YYYY-MM-DD'),
            endDate: dateRange[1].format('YYYY-MM-DD'),
        }
        setRawBetList([])
        getRawBetInfo(queryParams).then(data => setRawBetList(data))
    }, [])

    const handleOpenModalAddBet = useCallback((record) => {
        setCurrentAddBet(record)
        setModalAddOpen(true)
    }, [])

    const handleCloseModalAdd = useCallback(() => {
        setCurrentAddBet(null)
        setModalAddOpen(false)
    }, [])

    const handleConfirmUpdate = useCallback((record) => {
        updateBetResultFromRaw(record).then(() => onSuccessAction())
    }, [onSuccessAction])

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
                    key: 'profit',
                    width: 100,
                    render: (_, record) => {
                        if (record.actualProfit !== null) {
                            return record.actualProfit && <MoneyTextCell value={record.actualProfit}/>
                        }
                        return `${record.potentialProfit.toLocaleString()}đ`
                    }
                },
            ]
        },
        {
            title: 'Tỉ Số',
            key: 'score',
            dataIndex: 'score'
        },
        {
            title: 'Trạng Thái',
            key: 'rawStatus',
            render: (_, record) => <RawStatusTag text={record.rawStatus}/>
        },
        {
            title: 'Kết Quả',
            key: 'result',
            width: 140,
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
        },
        {
            title: 'Hành Động',
            key: 'action',
            width: 120,
            render: (_, record) => {
                return <>
                    {record.rawStatus === 'NEW' &&
                        (<Button type="primary" onClick={() => handleOpenModalAddBet(record)}>
                            Thêm Mới
                        </Button>)}
                    {record.rawStatus === 'RESULT_READY_TO_BE_UPDATED' &&
                        (<Popconfirm
                            title="Xác Nhận ?"
                            icon={<QuestionCircleOutlined style={{color: 'red',}}/>}
                            onConfirm={() => handleConfirmUpdate(record)}
                        >
                            <Button type="primary">
                                Cập Nhật
                            </Button>
                        </Popconfirm>)}
                </>
            }
        },
    ];

    return <>
        {modalAddOpen &&
            <InsertBetHistoryModal data={currentAddBet}
                                   isOpen={modalAddOpen}
                                   onClose={handleCloseModalAdd}
                                   onUpdateSuccess={onSuccessAction}
            />
        }
        <QueryRawBetInfoForm onSubmit={handleFetchRawBetList}/>
        {rawBetList && rawBetList.length > 0 &&
            <Table size="middle"
                   className="table-bet-history"
                   rowKey="id"
                   bordered
                   columns={columns}
                   dataSource={rawBetList}
                   pagination={{
                       pageSize: 10,
                       showSizeChanger: false,
                       showTotal: (total) => `Tổng: ${total} cược`
                   }}
            />}
    </>
}

export default RawBetInfoCard