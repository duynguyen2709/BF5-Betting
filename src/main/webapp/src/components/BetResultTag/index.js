import {Tag} from 'antd';

const BetResultTag = ({result}) => {
  switch (result) {
      case "WIN":
          return <Tag color="success">Thắng</Tag>
      case "HALF_WIN":
          return <Tag color="success">Thắng Nửa Tiền</Tag>
      case "LOST":
          return <Tag color="error">Thua</Tag>
      case "HALF_LOST":
          return <Tag color="error">Thua Nửa Tiền</Tag>
      case "DRAW":
          return <Tag color="processing">Hoà</Tag>
      default:
          return <Tag color="warning">Chưa Hoàn Tất</Tag>
  }
}

export default BetResultTag