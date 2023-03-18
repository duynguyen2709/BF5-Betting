import {Tag} from 'antd';
import {BET_RESULT} from "../../common/Constant";

const BetResultTag = ({result}) => {
    const betResultObj = Object.values(BET_RESULT).find(ele => ele.result === result)
    let color
    switch (betResultObj) {
        case BET_RESULT.Win:
        case BET_RESULT.HalfWin:
            color = "success"
            break
        case BET_RESULT.Lost:
        case BET_RESULT.HalfLost:
            color = "error"
            break
        case BET_RESULT.Draw:
            color = "processing"
            break
        default:
            color = "warning"
    }
    return <Tag color={color}>{betResultObj?.text}</Tag>
}

export default BetResultTag