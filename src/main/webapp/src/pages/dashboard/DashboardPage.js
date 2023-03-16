import React, {useEffect, useState} from "react";
import {getAllBetHistory} from '../../apis/BetHistoryApi'
import BetHistoryCard from "../../components/BetHistoryCard";

const DashboardPage = () => {
    const [betHistory, setBetHistory] = useState([])

    useEffect(() => {
        getAllBetHistory().then((data) => setBetHistory(data))
    }, [])

    return betHistory.map((ele) => <BetHistoryCard key={ele.id} data={ele} /> );
};

export default DashboardPage;
