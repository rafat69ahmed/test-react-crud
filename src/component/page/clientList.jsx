/* eslint-disable react/display-name */
// import React from 'react'
import React, { useEffect, useState } from 'react'
import PageHeader from 'component/common/pageHeader'
import Container from 'component/layout/container'
import useHttp from 'hook/useHttp'
import { Table, Tag, Input, Button, Space } from 'antd'
import ClientEditModal from 'component/content/clientEditModal'
import Highlighter from 'react-highlight-words'
import { SearchOutlined } from '@ant-design/icons'

const processUserData = (usersResponse) =>
    usersResponse.map((user, index) => {
        const { fields, name: nameUrl } = user?.document
        if (fields) {
            const { email, name, is_enable_push_notification, uid } = fields
            // console.log('skills', skills)
            return {
                id: index + 1,
                email: email?.stringValue,
                name: name?.stringValue,
                uid: uid?.stringValue,
                nameUrl,
                // eslint-disable-next-line prettier/prettier
                is_enable_push_notification: is_enable_push_notification?.booleanValue
                    ? 'enabled'
                    : 'disabled'
            }
        }
        return null
    })

const ClientList = () => {
    const { http } = useHttp()
    const [users, setUsers] = useState([])
    const [isEditModalVisible, setIsEditModalVisible] = useState(false)
    const [activeClient, setActiveClient] = React.useState('')
    const [searchText, setSearchText] = useState([])
    const [searchedColumn, setSearchedColumn] = useState([])
    const inputRef = React.useRef(null)

    const showEditModal = (client) => {
        setIsEditModalVisible(true)
        setActiveClient(client)
    }

    const getUsers = () => {
        const url =
            'https://firestore.googleapis.com/v1/projects/thefeelgoodfactory-c0649/databases/(default)/documents:runQuery'
        const query = {
            structuredQuery: {
                from: [
                    {
                        collectionId: 'users',
                        allDescendants: false
                    }
                ],
                where: {
                    fieldFilter: {
                        field: {
                            fieldPath: 'user_type'
                        },
                        op: 'EQUAL',
                        value: {
                            stringValue: 'client'
                        }
                    }
                }
            }
        }
        http.post(url, query)
            .then((res) => {
                // console.log(res.data)
                setUsers(processUserData(res.data))
            })
            .catch((err) => console.log(err))
    }
    useEffect(() => {
        getUsers()
    }, [])
    const handleSearch = (selectedKeys, confirm, dataIndex) => {
        confirm()
        setSearchText(selectedKeys[0])
        setSearchedColumn(dataIndex)
    }

    const handleReset = (clearFilters) => {
        clearFilters()
        setSearchText('')
    }
    const getColumnSearchProps = (dataIndex) => ({
        // eslint-disable-next-line react/display-name
        filterDropdown: ({ setSelectedKeys, selectedKeys, confirm, clearFilters }) => (
            <div style={{ padding: 8 }}>
                <Input
                    ref={inputRef}
                    placeholder={`Search ${dataIndex}`}
                    value={selectedKeys[0]}
                    onChange={(e) => setSelectedKeys(e.target.value ? [e.target.value] : [])}
                    onPressEnter={() => handleSearch(selectedKeys, confirm, dataIndex)}
                    style={{ marginBottom: 8, display: 'block' }}
                />
                <Space>
                    <Button
                        type="primary"
                        onClick={() => handleSearch(selectedKeys, confirm, dataIndex)}
                        icon={<SearchOutlined />}
                        size="small"
                        style={{ width: 90 }}>
                        Search
                    </Button>
                    <Button
                        onClick={() => handleReset(clearFilters)}
                        size="small"
                        style={{ width: 90 }}>
                        Reset
                    </Button>
                    <Button
                        type="link"
                        size="small"
                        onClick={() => {
                            confirm({ closeDropdown: false })
                            setSearchText(selectedKeys[0])
                            setSearchedColumn(dataIndex)
                        }}>
                        Filter
                    </Button>
                </Space>
            </div>
        ),
        filterIcon: (filtered) => (
            <SearchOutlined style={{ color: filtered ? '#1890ff' : undefined }} />
        ),
        onFilter: (value, record) =>
            record[dataIndex]
                ? record[dataIndex].toString().toLowerCase().includes(value.toLowerCase())
                : '',
        onFilterDropdownVisibleChange: (visible) => {
            if (visible) {
                setTimeout(() => inputRef.current.select(), 300)
            }
        },
        render: (text) =>
            searchedColumn === dataIndex ? (
                <Highlighter
                    highlightStyle={{ backgroundColor: '#ffc069', padding: 0 }}
                    searchWords={[searchText]}
                    autoEscape
                    textToHighlight={text ? text.toString() : ''}
                />
            ) : (
                text
            )
    })
    const columns = [
        {
            title: 'Name',
            width: 20,
            dataIndex: 'name',
            key: 'name',
            ...getColumnSearchProps('name')
        },
        {
            title: 'Email',
            width: 50,
            dataIndex: 'email',
            key: 'email',
            ...getColumnSearchProps('name')
        },
        {
            title: 'Notification Status',
            width: 50,
            dataIndex: 'is_enable_push_notification',
            key: 'is_enable_push_notification',
            ...getColumnSearchProps('is_enable_push_notification'),
            // eslint-disable-next-line react/display-name
            render: (is_enable_push_notification) => (
                <>
                    <Tag
                        color={is_enable_push_notification == 'enabled' ? 'green' : 'red'}
                        key={is_enable_push_notification}>
                        {is_enable_push_notification}
                    </Tag>
                </>
            )
        },
        {
            title: 'Action',
            key: 'operation',
            fixed: 'right',
            width: 60,
            // eslint-disable-next-line react/display-name
            render: (client) => {
                return (
                    <div>
                        <a href="#edit" onClick={() => showEditModal(client)}>
                            edit
                        </a>
                    </div>
                )
            }
        }
    ]

    return (
        <Container style={{ padding: '32px 0' }}>
            <PageHeader>Client List</PageHeader>
            <ClientEditModal
                isOpen={isEditModalVisible}
                setIsOpen={setIsEditModalVisible}
                activeClient={activeClient}
                getUsers={getUsers}
            />
            <Table columns={columns} dataSource={users} rowKey={(record) => record.email} />
        </Container>
    )
}

export default ClientList
