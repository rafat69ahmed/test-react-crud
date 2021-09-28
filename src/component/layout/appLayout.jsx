import React, { useContext } from 'react'
import { Layout, Menu, Typography } from 'antd'
import { UserOutlined } from '@ant-design/icons'
import { Link, useHistory } from 'react-router-dom'

const { Header, Content, Sider } = Layout
const { Title } = Typography
const { SubMenu } = Menu

const headerStyle = {
    color: 'white',
    margin: 0,
    height: '100%',
    display: 'flex',
    alignItems: 'center'
}

const AppLayout = ({ children }) => {
    return (
        <Layout>
            <Header className="header" style={{ display: 'flex', justifyContent: 'space-between' }}>
                <Title level={3} style={headerStyle}>
                    contact app
                </Title>

                <Menu theme="dark" mode="horizontal"></Menu>
            </Header>
            <Layout>
                <Sider width={200} className="site-layout-background">
                    <Menu
                        mode="inline"
                        defaultSelectedKeys={['1']}
                        style={{ height: '100%', borderRight: 0 }}>
                        <Menu.Item key="9">
                            <Link to="/contacts">contact List</Link>
                        </Menu.Item>
                        <Menu.Item key="10">
                            <Link to="/contact-create">contact Create</Link>
                        </Menu.Item>
                    </Menu>
                </Sider>
                <Layout style={{ padding: '0 24px 24px' }}>
                    <Content
                        className="site-layout-background"
                        style={{
                            padding: 24,
                            margin: 0,
                            minHeight: 280
                        }}>
                        {children}
                    </Content>
                </Layout>
            </Layout>
        </Layout>
    )
}

export default AppLayout
