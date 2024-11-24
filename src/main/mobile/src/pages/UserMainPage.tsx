import React from 'react'
import { useGetPlayers } from '@/api/player'
import { Layout } from 'antd'
import './UserMainPage.css'

const { Header, Content } = Layout

const UserMainPage: React.FC = () => {
  const { data: players, isLoading } = useGetPlayers()
  return (
    <>
      <Layout className='main-layout'>
        <Header className='main-header'>
          <img src={'/assets/logo.png'} alt={'logo'} style={{ height: '48px' }} />
        </Header>
        <Content className='main-content'>{JSON.stringify(players)}</Content>
      </Layout>
    </>
  )
}

export default UserMainPage
