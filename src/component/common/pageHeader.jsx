import React from 'react'
import { Typography } from 'antd'
const { Title } = Typography

const PageHeader = ({ children }) => {
    return <Title>{children} </Title>
}

export default PageHeader
