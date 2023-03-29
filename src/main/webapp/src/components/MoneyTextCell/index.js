import React from "react";

const MoneyTextCell = ({value}) => {
    if (!value) return ''
    if (value > 0) return <span style={{color: 'green'}}>{value.toLocaleString()}đ</span>
    if (value < 0) return <span style={{color: 'red'}}>{value.toLocaleString()}</span>
    return `${value.toLocaleString()}đ`
}

export default MoneyTextCell