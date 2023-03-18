import React, {useCallback, useState} from "react";
import QueryRawBetInfoForm from "../QueryRawBetInfoForm";
import {Button, Col, Row, Table} from "antd";
import {parseBetEvent} from "../../utils/betHistoryUtil";
import MoneyTextCell from "../MoneyTextCell";
import BetResultTag from "../BetResultTag";
import {BET_RESULT} from "../../common/Constant";
import {getRawBetInfo, insertBetHistory} from "../../apis/BetHistoryApi";
import InsertBetHistoryModal from "../InsertBetHistoryModal";

const RawBetInfoCard = ({onSuccessAction}) => {
    const [rawBetList, setRawBetList] = useState([])
    const [modalAddOpen, setModalAddOpen] = useState(false)
    const [currentAddBet, setCurrentAddBet] = useState()

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

    const columns = [
        {
            title: 'Mã Cược',
            key: 'id',
            dataIndex: 'id',
            width: 130,
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
                    title: 'Lợi Nhuận Tiềm Năng',
                    key: 'potentialProfit',
                    width: 100,
                    render: (_, record) => (`${record.potentialProfit.toLocaleString()}đ`)
                },
                {
                    title: 'Lời / Lỗ',
                    key: 'actualProfit',
                    width: 100,
                    render: (_, record) => {
                        return record.actualProfit && <MoneyTextCell value={record.actualProfit}/>
                    }
                },
            ]
        },

        {
            title: 'Trạng Thái',
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
            width: 150,
        },
        {
            title: 'Hành Động',
            key: 'action',
            width: 120,
            render: (_, record) => {
                return <Button type="primary" onClick={() => handleOpenModalAddBet(record)}>
                    Cập Nhật
                </Button>
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