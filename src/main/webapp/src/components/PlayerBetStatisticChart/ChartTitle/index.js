import React from "react";

const ChartTitle = ({text, style = {margin: '0.5rem 1rem', color: '#237804'}}) => {
    return <h2 style={style}>{text}</h2>
}

export default ChartTitle