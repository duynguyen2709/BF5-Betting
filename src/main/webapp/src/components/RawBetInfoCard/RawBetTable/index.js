import React from "react";
import {Button, Popconfirm, Table, Tag} from "antd";
import {QuestionCircleOutlined} from "@ant-design/icons";
import {buildCommonTableColumn} from "../../../utils/BetHistoryUtil";
import {RAW_BET_STATUS} from "../../../common/Constant";
import VerticalCenterRowCellWithDivider from "../../VerticalCenterRowCellWithDivider";

const RawStatusTag = ({text}) => {
    switch (text) {
        case RAW_BET_STATUS.New:
            return <Tag color="warning">Chưa Xử Lý</Tag>;
        case RAW_BET_STATUS.Inserted:
            return <Tag color="cyan">
                <p style={{marginBottom: 0}}>Đã Lưu Dữ Liệu<br/>Chờ Kết Quả</p>
            </Tag>;
        case RAW_BET_STATUS.ResultReadyToBeUpdated:
            return <Tag color="blue">
                <p style={{marginBottom: 0}}>Đã Có Kết Quả<br/>Chờ Cập Nhật</p>
            </Tag>;
        case RAW_BET_STATUS.Settled:
            return <Tag color="success">Đã Hoàn Tất</Tag>;
        default:
            return <Tag>{text}</Tag>
    }
}

const hasAtLeastOneMatchWithScore = (data) => {
    if (data) {
        for (const bet of data) {
            for (const event of bet.events) {
                if (event.score) {
                    return true
                }
            }
        }
    }
    return false
}

const RawBetTable = ({data, players, onClickAdd, onClickUpdate}) => {
    const columns = buildCommonTableColumn(players)
    const hasScoreColumn = hasAtLeastOneMatchWithScore(data)
    let index = 4
    if (hasScoreColumn) {
        columns.splice(index++, 0, {
            title: 'Tỉ Số',
            key: 'score',
            width: 80,
            render: (_, record) => {
                return record.events.map((event, index) =>
                    <VerticalCenterRowCellWithDivider key={event.id}
                                                      arrayLength={record.events.length}
                                                      index={index}>
                        {event.score}
                    </VerticalCenterRowCellWithDivider>)
            }
        })
    }
    columns.splice(index, 0, {
        title: 'Trạng Thái',
        key: 'rawStatus',
        render: (_, record) => <RawStatusTag text={record.rawStatus}/>
    })
    columns.push({
        title: 'Hành Động',
        key: 'action',
        width: 120,
        render: (_, record) => {
            return <>
                {record.rawStatus === RAW_BET_STATUS.New &&
                    (<Button type="primary" onClick={() => onClickAdd(record)}>
                        Thêm Mới
                    </Button>)}
                {record.rawStatus === RAW_BET_STATUS.ResultReadyToBeUpdated &&
                    (<Popconfirm
                        title="Xác Nhận ?"
                        icon={<QuestionCircleOutlined style={{color: 'red',}}/>}
                        onConfirm={() => onClickUpdate(record)}
                    >
                        <Button type="primary">
                            Cập Nhật
                        </Button>
                    </Popconfirm>)}
            </>
        }
    })

    return <Table size="middle"
                  className="table-bet-history"
                  rowKey="betId"
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

export default RawBetTable