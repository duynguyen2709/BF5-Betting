import React from "react";
import {Button, Popconfirm} from "antd";

const BatchUpdateRawBetButton = ({onUpdateBatchFromRaw}) => {
    return <Popconfirm placement="topRight"
                       showCancel={false}
                       onConfirm={onUpdateBatchFromRaw}
                       title={<span>Xác nhận cập nhật<br/>toàn bộ cược ?</span>}>
        <Button type={"primary"}>Cập Nhật Nhanh</Button>
    </Popconfirm>
}

export default BatchUpdateRawBetButton