import { Layout, Menu } from 'antd'
import { Link } from 'react-router-dom'
import Container from './container'
const { Header } = Layout

const Navbar = () => {
    return (
        <Header className="header">
            <Container>
                <div className="logo" />
                <Menu theme="dark" mode="horizontal" defaultSelectedKeys={['1']}>
                    <Menu.Item key="1">
                        <Link to="/">Home</Link>
                    </Menu.Item>
                    <Menu.Item key="2">
                        <Link to="/about">About</Link>
                    </Menu.Item>
                </Menu>
            </Container>
        </Header>
    )
}

export default Navbar
