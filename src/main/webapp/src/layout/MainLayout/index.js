import React from 'react';
import {Layout} from 'antd';
import './index.scss'

const {Content} = Layout;

const MainLayout = ({component}) => (
    <Layout>
        <Content className="main-layout">
            {component}
        </Content>
    </Layout>
);
export default MainLayout;