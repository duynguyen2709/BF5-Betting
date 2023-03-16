import React, {useEffect, useState} from 'react';
import {Layout} from 'antd';
import {getAllPlayers} from "../../apis/PlayerApi";
import PlayersContext from "../../common/PlayersContext";
import './index.scss'

const {Header, Content} = Layout;

const MainLayout = ({component}) => {
    const [players, setPlayers] = useState({})
    useEffect(() => {
        getAllPlayers().then(data => setPlayers(data))
    }, [])

    return (
        <PlayersContext.Provider value={{
            players
        }}>
            <Layout className="main-layout">
                <Header className="main-header">
                    <h2 style={{color: '#fff'}}>BF5 Betting</h2>
                </Header>
                <Content className="main-content">
                    {component}
                </Content>
            </Layout>
        </PlayersContext.Provider>
    )
};
export default MainLayout;