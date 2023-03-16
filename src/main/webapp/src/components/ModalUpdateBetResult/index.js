import React, {useCallback, useState} from "react";
import {Col, Modal, Row, Select} from "antd";
import {updateBetResult} from "../../apis/BetHistoryApi";
import './index.scss'
import {BET_RESULT} from "../../common/Constant";
import {resultToText} from "../../utils/betHistoryUtil";

const {Option} = Select

const ModalUpdateBetResult = ({data, isOpen, onUpdateSuccess, onClose}) => {
    const [result, setResult] = useState(BET_RESULT.WIN)

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
                        .filter(res => res !== BET_RESULT.NOT_FINISHED)
                        .map(ele => <Option key={ele} value={ele}>{resultToText(ele)}</Option>)}
                </Select>
            </Col>
        </Row>

    </Modal>
}

export default ModalUpdateBetResult