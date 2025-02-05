import { Layout } from 'antd'
import React from 'react'

import styles from './MainLayout.module.css'

import logo from '@/assets/logo.png'

const { Header, Content } = Layout

interface MainLayoutProps {
  children: React.ReactNode
}

function MainLayout({ children }: MainLayoutProps) {
  return (
    <Layout className={styles['main-layout']}>
      <Header className={styles['main-header']}>
        <img src={logo} alt='logo' style={{ height: '48px' }} />
      </Header>
      <Content className={styles['main-content']}>{children}</Content>
    </Layout>
  )
}

export default MainLayout
