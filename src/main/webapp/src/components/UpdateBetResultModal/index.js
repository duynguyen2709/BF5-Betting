import React, {useCallback, useEffect, useState} from "react";
import {Col, message, Modal, Row, Select} from "antd";
import {updateBetResult} from "../../apis/BetHistoryApi";
import {BET_RESULT} from "../../common/Constant";
import BetHistoryCard from "../BetHistoryCard";
import {isAccumulatorBet, isSingleBet} from "../../utils/BetHistoryUtil";

const {Option} = Select

const UpdateBetResultModal = ({data, isOpen, onUpdateSuccess, onClose}) => {
    const [result, setResult] = useState(BET_RESULT.Win.result)
    const [matchResults, setMatchResults] = useState({})

    useEffect(() => {
        if (data) {
            const eventResults = {}
            data.events.forEach(event => eventResults[event.id] = event.result)
            setMatchResults(eventResults)
        }
    }, [data])

    const handleChangeMatchResult = useCallback((eventId, value) => {
        const obj = {...matchResults}
        obj[eventId] = value
        setMatchResults(obj)
    }, [matchResults])

    const handleChangeResult = useCallback((value) => {
        setResult(value)
    }, [])

    const handleConfirmUpdate = useCallback(() => {
        const obj = {...data, result}
        if (isSingleBet(data)) {
            obj.events.result = result
        } else {
            for (let matchResult of Object.values(matchResults)) {
                if (matchResult === BET_RESULT.Unfinished.result) {
                    message.error('Vui lòng chọn kết quả cho tất cả trận đấu', 3)
                    return
                }
            }

            for (let event of obj.events) {
                event.result = matchResults[event.id]
            }
        }

        updateBetResult(obj).then(() => onUpdateSuccess())
    }, [result, matchResults, data, onUpdateSuccess])

    return <Modal
        title="Cập Nhật Kết Quả Cược"
        destroyOnClose
        centered
        maskClosable={false}
        closable={false}
        open={isOpen}
        onOk={handleConfirmUpdate}
        onCancel={onClose}
    >
        {data && <BetHistoryCard data={data} isHistoryViewMode={false} />}

        {data && isAccumulatorBet(data) && data.events.map((event, index) => {
            return <Row key={event.id} style={{alignItems: 'center', margin: '1rem 0.5rem 0 0.5rem'}}>
                <Col span={4}>{`Game ${index + 1}:`}</Col>
                <Col span={19} offset={1}>
                    <Select allowClear={false}
                            onChange={(value) => handleChangeMatchResult(event.id, value)}
                            style={{width: '100%'}}>
                        {Object.values(BET_RESULT)
                            .filter(res => res.result !== BET_RESULT.Unfinished.result)
                            .map(ele => <Option key={ele.result} value={ele.result}>{ele.text}</Option>)}
                    </Select>
                </Col>
            </Row>
        })}

        <Row style={{alignItems: 'center', margin: '1rem 0.5rem 0 0.5rem'}}>
            <Col span={4}>Kết Quả:</Col>
            <Col span={19} offset={1}>
                <Select allowClear={false}
                        value={result}
                        onChange={handleChangeResult}
                        style={{width: '100%'}}>
                    {Object.values(BET_RESULT)
                        .filter(res => res.result !== BET_RESULT.Unfinished.result)
                        .map(ele => <Option key={ele.result} value={ele.result}>{ele.text}</Option>)}
                </Select>
            </Col>
        </Row>

    </Modal>
}

export default UpdateBetResultModal