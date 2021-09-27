/* eslint-disable react/display-name */
import React, { useEffect, useState } from 'react'
import PageHeader from 'component/common/pageHeader'
import Container from 'component/layout/container'
// import useHttp from 'hook/useHttp'
import { Table, Modal, Divider, Input, Button, Space } from 'antd'
// import dayjs from 'dayjs'
import ContactEditModal from 'component/content/contactEditModal'
import { SearchOutlined } from '@ant-design/icons'
import Highlighter from 'react-highlight-words'

const processUserData = (usersResponse) =>
    usersResponse?.map((user, index) => {
        if (user) {
            console.log('testo', user)
            const resultArr = {
                // id: index + 1,
                name: user?.name || 'N/A',
                phone: user?.phone || 'N/A',
                company: user?.company || 'N/A',
                address: user?.address || 'N/A',
                created_at: user?.created_at || 'N/A',
                uid: user?.uid || 'N/A'
            }
            return resultArr
        }
        return null
    })

const ContactList = () => {
    // const { http } = useHttp()
    const [users, setUsers] = useState([])
    const [loading, setLoading] = useState(false)
    const [isEditModalVisible, setIsEditModalVisible] = useState(false)
    const [isDeleteModalVisible, setIsDeleteModalVisible] = useState(false)
    const [activeClient, setActiveClient] = React.useState('')
    const [confirmLoading, setConfirmLoading] = React.useState(false)
    const [searchText, setSearchText] = useState([])
    const [searchedColumn, setSearchedColumn] = useState([])
    const inputRef = React.useRef(null)
    // function onChange(date, dateString) {
    //     let urlDate = dateString.split('-').reverse().join('-')
    //     getUsers(urlDate)
    // }
    const getUsers = () => {
        setUsers(processUserData(JSON.parse(localStorage.getItem('list'))))
    }
    const showEditModal = (client) => {
        setIsEditModalVisible(true)
        setActiveClient(client)
    }
    const showDeleteModal = (client) => {
        console.log('whats wrong', client)
        setIsDeleteModalVisible(true)
        setActiveClient(client)
    }
    const handleCancel = () => {
        setIsDeleteModalVisible(false)
        setActiveClient('')
    }
    const handleDeleteOk = () => {
        console.log('full list', users)
        console.log('receive client', activeClient)
        setUsers((users) => users.filter((user) => user.uid !== activeClient.uid))
        console.log('after delete', users)
        setIsDeleteModalVisible(false)
        setActiveClient('')
    }

    const handleSearch = (selectedKeys, confirm, dataIndex) => {
        confirm()
        setSearchText(selectedKeys[0])
        setSearchedColumn(dataIndex)
    }

    const handleReset = (clearFilters) => {
        clearFilters()
        setSearchText('')
    }
    // const async finalData = () => {

    // }
    useEffect(() => {
        // let today = dayjs().format('MM-YYYY')
        // let data = JSON.parse(localStorage.getItem('list'))
        // console.log('hello bello', data)
        getUsers()
    }, [])

    useEffect(() => {
        localStorage.setItem('list', JSON.stringify(users))
    }, [users])
    const columns = [
        {
            title: 'Name',
            width: 20,
            dataIndex: 'name',
            key: 'name'
            // ...getColumnSearchProps('name')
        },
        {
            title: 'Phone',
            width: 50,
            dataIndex: 'phone',
            key: 'phone'
        },
        {
            title: 'Company',
            width: 50,
            dataIndex: 'company',
            key: 'company'
        },
        {
            title: 'Address',
            width: 50,
            dataIndex: 'address',
            key: 'address'
        },
        {
            title: 'Created At',
            width: 50,
            dataIndex: 'created_at',
            key: 'created_at'
        },
        {
            title: 'Action',
            key: 'operation',
            fixed: 'right',
            width: 160,
            render: (trainer) => {
                return (
                    <div>
                        <a
                            href="#delete"
                            style={{ color: 'red' }}
                            onClick={() => showDeleteModal(trainer)}>
                            delete
                        </a>
                        <Divider type="vertical" />
                        <a href="#edit" onClick={() => showEditModal(trainer)}>
                            edit
                        </a>
                    </div>
                )
            }
        }
    ]

    const getColumnSearchProps = (dataIndex) => ({
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
    return (
        <Container style={{ padding: '32px 0' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '16px' }}>
                <PageHeader>contact List</PageHeader>
                <ContactEditModal
                    isOpen={isEditModalVisible}
                    setIsOpen={setIsEditModalVisible}
                    activeClient={activeClient}
                    getUsers={getUsers}
                    users={users}
                    setUsers={setUsers}
                />
                <Modal
                    title="delete modal"
                    visible={isDeleteModalVisible}
                    onOk={handleDeleteOk}
                    // confirmLoading={confirmLoading}
                    onCancel={handleCancel}>
                    <p>Are you sure you want to approve this contact?</p>
                </Modal>
            </div>
            <Table
                loading={loading}
                columns={columns}
                dataSource={users}
                rowKey={(record) => record.id}
            />
        </Container>
    )
}

export default ContactList
