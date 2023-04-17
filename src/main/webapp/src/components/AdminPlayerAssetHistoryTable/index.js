import React, {useCallback} from "react";
import {Avatar, Row, Table, Tag} from "antd";
import {usePlayerContextHook} from "../../hooks";
import MoneyTextCell from "../MoneyTextCell";
import AssetHistoryStatisticForm from "./AssetHistoryStatisticForm";
import {doStatistic} from "../../apis/StatisticApi";

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


const AdminPlayerAssetHistoryTable = ({data, onStatisticSuccess}) => {
    const {players} = usePlayerContextHook()

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
                    render: (_, record) => <MoneyTextCell value={record.amount} />
                },
                {
                    title: 'Số Dư Đầu',
                    key: 'assetBefore',
                    render: (_, record) => <MoneyTextCell value={record.assetBefore} />
                },
                {
                    title: 'Số Dư Cuối',
                    key: 'assetAfter',
                    render: (_, record) => <MoneyTextCell value={record.assetAfter} />
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

    const handleSubmitStatistic = useCallback((values) => {
        const {dateRange} = values;
        const queryParams = {
            startDate: dateRange[0].format('YYYY-MM-DD'),
            endDate: dateRange[1].format('YYYY-MM-DD'),
            action: 'statistic',
        }
        doStatistic(queryParams).then(() => onStatisticSuccess())
    }, [onStatisticSuccess])

    return <>
        <AssetHistoryStatisticForm onSubmit={handleSubmitStatistic} />
        <Table size="middle"
               className="table-player-asset-history"
               rowKey="id"
               bordered
               columns={columns}
               dataSource={data}
               pagination={{
                   pageSize: 10,
                   showSizeChanger: false,
                   showTotal: (total) => `Tổng: ${total} dòng`
               }}
        />
    </>
}

export default AdminPlayerAssetHistoryTable