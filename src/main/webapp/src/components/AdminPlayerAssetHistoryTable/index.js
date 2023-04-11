import React, {useEffect, useState} from "react";
import {Avatar, Row, Table, Tag} from "antd";
import {getAllStatistics} from "../../apis/StatisticApi";
import {usePlayerContextHook} from "../../hooks";

const PaymentActionTag = ({action}) => {
    switch (action) {
        case "BET_WIN":
            return <Tag color={"success"}>Thắng Cược</Tag>
        case "BET_LOST":
            return <Tag color={"error"}>Thua Cược</Tag>
        case "CASHOUT":
            return <Tag color={"processing"}>Rút Tiền</Tag>
        default:
            return <Tag color={"warning"}>Nạp Tiền</Tag>
    }
}


const AdminPlayerAssetHistoryTable = () => {
    const [data, setData] = useState([])
    const {players} = usePlayerContextHook()

    useEffect(() => {
        getAllStatistics().then(data => setData(data))
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
                return <Row className={"vertical-center-row"}>
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
            title: 'Thời Gian Thanh Toán',
            key: 'paymentTime',
            dataIndex: 'paymentTime',
            width: 170,
        },
        {
            title: 'Hành Động',
            key: 'action',
            render: (_, record) => <PaymentActionTag action={record.action}/>
        },
        {
            title: 'Hình Thức Thanh Toán',
            key: 'paymentMethod',
            dataIndex: 'paymentMethod',
        },
        {
            title: 'Tài Sản',
            key: 'asset',
            children: [
                {
                    title: 'Số Tiền Thanh Toán',
                    key: 'amount',
                    dataIndex: 'amount',
                },
                {
                    title: 'Số Dư Đầu',
                    key: 'assetBefore',
                    dataIndex: 'assetBefore',
                },
                {
                    title: 'Số Dư Cuối',
                    key: 'assetAfter',
                    dataIndex: 'assetAfter',
                },
            ]
        },
        {
            title: 'Mã Cược',
            key: 'betId',
            dataIndex: 'betId',
        },
        {
            title: 'Thời Gian Cập Nhật',
            key: 'updatedAt',
            dataIndex: 'updatedAt',
            width: 150,
        },
    ];

    return <Table size="middle"
                  className="table-player-asset-history"
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
}

export default AdminPlayerAssetHistoryTable