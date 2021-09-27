/* eslint-disable react/display-name */
import React, { useEffect, useState } from 'react'
import PageHeader from 'component/common/pageHeader'
// import { Row, Col } from 'antd'
// import { Button } from 'antd'
import Container from 'component/layout/container'
import useHttp from 'hook/useHttp'
import { Table, Tag, Input, Button, Space } from 'antd'
import TrainerEditModal from 'component/content/trainerEditModal'
import Highlighter from 'react-highlight-words'
import { SearchOutlined } from '@ant-design/icons'

const processUserData = (usersResponse) =>
    usersResponse.map((user, index) => {
        console.log('user', user)
        const { fields, name: nameUrl } = user?.document
        if (fields) {
            const { email, name, phone, skills, remaining_hours, uid, trainer_bio } = fields
            // console.log('skills', skills)
            // console.log('fields', fields)
            // console.log('fields', fields)
            return {
                id: index + 1,
                email: email.stringValue,
                name: name.stringValue,
                phone: phone ? phone.stringValue : 'N/A',
                skills: skills?.arrayValue?.values || [],
                remaining_hours: remaining_hours ? remaining_hours.doubleValue : 0,
                uid: uid?.stringValue,
                nameUrl,
                trainer_bio: trainer_bio?.stringValue
            }
        }
        return null
    })

const TrainerList = () => {
    const { http } = useHttp()
    const [users, setUsers] = useState([])
    const [isEditModalVisible, setIsEditModalVisible] = useState(false)
    const [activeTrainer, setActiveTrainer] = React.useState('')
    const [searchText, setSearchText] = useState([])
    const [searchedColumn, setSearchedColumn] = useState([])
    const inputRef = React.useRef(null)

    const showEditModal = (trainer) => {
        console.log('TRAINER', trainer)
        setActiveTrainer(trainer)
        setIsEditModalVisible(true)
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
                    compositeFilter: {
                        op: 'AND',
                        filters: [
                            {
                                fieldFilter: {
                                    field: {
                                        fieldPath: 'user_type'
                                    },
                                    op: 'EQUAL',
                                    value: {
                                        stringValue: 'trainer'
                                    }
                                }
                            },
                            {
                                fieldFilter: {
                                    field: {
                                        fieldPath: 'is_approved'
                                    },
                                    op: 'EQUAL',
                                    value: {
                                        booleanValue: true
                                    }
                                }
                            }
                        ]
                    }
                }
            }
        }
        http.post(url, query)
            .then((res) => {
                console.log(res.data)
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
            ...getColumnSearchProps('email')
        },
        {
            title: 'Phone',
            width: 50,
            dataIndex: 'phone',
            key: 'phone',
            ...getColumnSearchProps('phone')
        },
        {
            title: 'Skills',
            width: 300,
            key: 'skills',
            dataIndex: 'skills',
            // ...getColumnSearchProps('skills'),
            render: (skills) => (
                <>
                    {skills.map((tag) => {
                        return (
                            <Tag color="blue" key={tag.stringValue}>
                                {tag.stringValue}
                            </Tag>
                        )
                    })}
                </>
            )
        },
        {
            title: 'Remaining Hour',
            width: 10,
            dataIndex: 'remaining_hours',
            key: 'remaining_hours',
            ...getColumnSearchProps('remaining_hours')
        },
        {
            title: 'Action',
            key: 'operation',
            fixed: 'right',
            width: 160,
            render: (trainer) => {
                return (
                    <div>
                        <a href="#edit" onClick={() => showEditModal(trainer)}>
                            edit
                        </a>
                    </div>
                )
            }
        }
    ]

    return (
        <Container style={{ padding: '32px 0' }}>
            <TrainerEditModal
                isOpen={isEditModalVisible}
                setIsOpen={setIsEditModalVisible}
                activeTrainer={activeTrainer}
                getUsers={getUsers}
            />
            <PageHeader>Trainer List</PageHeader>
            <Table columns={columns} dataSource={users} rowKey={(record) => record.email} />
        </Container>
    )
}

export default TrainerList
