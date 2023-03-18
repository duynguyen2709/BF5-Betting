import React, {useCallback, useState} from "react";
import {Col, Modal, Row, Select} from "antd";
import {updateBetResult} from "../../apis/BetHistoryApi";
import {BET_RESULT} from "../../common/Constant";

const {Option} = Select

const UpdateBetResultModal = ({data, isOpen, onUpdateSuccess, onClose}) => {
    const [result, setResult] = useState(BET_RESULT.Win.result)

    const handleChangeResult = useCallback((value) => {
        setResult(value)
    }, [])

    const handleConfirmUpdate = useCallback(() => {
        updateBetResult({
            betId: data.id,
            result
        }).then(() => onUpdateSuccess())
    }, [result, data, onUpdateSuccess])

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
        <Row style={{alignItems: 'center'}}>
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