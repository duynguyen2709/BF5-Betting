import React, {useCallback, useEffect, useState} from 'react';
import {Layout} from 'antd';
import {getAllPlayers} from "../../apis/PlayerApi";
import PlayersContext from "../../common/PlayersContext";
import './index.scss'

const {Header, Content} = Layout;

const MainLayout = ({component}) => {
    const [players, setPlayers] = useState({})

    const fetchPlayersData = useCallback(() => {
        setPlayers({})
        getAllPlayers().then(data => setPlayers(data))
    }, [])

    useEffect(() => {
        fetchPlayersData()
    }, [fetchPlayersData])

    return (
        <PlayersContext.Provider value={{
            players,
            fetchPlayersData
        }}>
            <Layout className="main-layout">
                <Header className="main-header">
                    <img src={"/bf5-betting-logo.png"} alt={"bf5-betting-logo"} style={{height: '48px'}}/>
                </Header>
                <Content className="main-content">
                    {component}
                </Content>
            </Layout>
        </PlayersContext.Provider>
    )
};
export default MainLayout;