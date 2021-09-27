import React, { useContext } from 'react'
import { Layout, Menu, Typography } from 'antd'
import { UserOutlined } from '@ant-design/icons'
import { Link, useHistory } from 'react-router-dom'
// import UserContext from 'context/userContext'
// import useAuth from 'hook/useAuth'

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

// const UserMenu = () => {
//     const { logoutUser } = useAuth()
//     const handleLogout = () => logoutUser()
//     return (
//         <Menu>
//             <Menu.Item key="1" icon={<UserOutlined />} onClick={handleLogout}>
//                 Logout
//             </Menu.Item>
//         </Menu>
//     )
// }

const AppLayout = ({ children }) => {
    // const { user } = useContext(UserContext)
    // const { logoutUser } = useAuth()
    // const handleLogout = () => logoutUser()
    const history = useHistory()
    const handleContactList = () => {
        history.push('/login')
        console.log('contact list')
    }
    const handleContactCreate = () => {
        history.push('/contact-create')
        console.log('contact create')
    }
    return (
        <Layout>
            <Header className="header" style={{ display: 'flex', justifyContent: 'space-between' }}>
                <Title level={3} style={headerStyle}>
                    contact app
                </Title>

                <Menu theme="dark" mode="horizontal">
                    {/* <SubMenu key="SubMenu" icon={<UserOutlined />} title={user?.name || 'Admin'}>
                        <Menu.Item key="setting:1" onClick={handleLogout}>
                            Logout
                        </Menu.Item>
                    </SubMenu> */}
                </Menu>
            </Header>
            <Layout>
                <Sider width={200} className="site-layout-background">
                    <Menu
                        mode="inline"
                        defaultSelectedKeys={['1']}
                        style={{ height: '100%', borderRight: 0 }}>
                        {/* <SubMenu key="sub1" title="Trainers">
                            <Menu.Item key="1">
                                <Link to="/trainer-list">Trainer List</Link>
                            </Menu.Item>
                            <Menu.Item key="2">
                                <Link to="/pending-trainer-list">Pending Trainer List</Link>
                            </Menu.Item>
                            <Menu.Item key="3">
                                <Link to="/trainer-create">Create Trainer</Link>
                            </Menu.Item>
                        </SubMenu> */}
                        {/* <Menu.Item key="8">Purchase History</Menu.Item> */}
                        {/* <SubMenu key="sub2" title="Clients">
                            <Menu.Item key="4">
                                <Link to="/contacts">contact List</Link>
                            </Menu.Item>
                            <Menu.Item key="5">
                                <Link to="/client-create">Create Client</Link>
                            </Menu.Item>
                        </SubMenu> */}
                        {/* <SubMenu key="sub3" title="Bookings">
                        </SubMenu> */}
                        {/* <Menu.Item key="6">
                            <Link to="/booking-list">Booking List</Link>
                        </Menu.Item>
                        <Menu.Item key="7">
                            <Link to="/purchase-history-list">Purchase History</Link>
                        </Menu.Item> */}
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
