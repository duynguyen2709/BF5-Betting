import { Layout } from 'antd'
import React from 'react'
import './index.css'

const { Header, Content } = Layout

const DashboardLayout: React.FC<React.PropsWithChildren> = ({ children }) => {
  return (
    <Layout className='main-layout'>
      <Header className='main-header'>
        <img className='main-header-logo' src={'/logo.png'} alt={'logo'} />
      </Header>
      <Content className='main-content'>{children}</Content>
    </Layout>
  )
}

export default DashboardLayout
