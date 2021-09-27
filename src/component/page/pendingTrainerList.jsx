/* eslint-disable react/display-name */
import React, { useEffect, useState } from 'react'
import PageHeader from 'component/common/pageHeader'
import Container from 'component/layout/container'
import useHttp from 'hook/useHttp'
import { Table, Tag, Divider, Input, Button, Space } from 'antd'
import { Modal, message } from 'antd'
import TrainerEditModal from 'component/content/trainerEditModal'
import PendingTrainerDetail from 'component/content/pendingTrainerDetail'
import Highlighter from 'react-highlight-words'
import { SearchOutlined } from '@ant-design/icons'

const processUserData = (usersResponse) =>
    usersResponse.map((user, index) => {
        const { fields, name: nameUrl } = user?.document
        if (fields) {
            const { email, name, phone, skills, remaining_hours, trainer_bio } = fields
            console.log('skills', skills)
            return {
                id: index + 1,
                email: email.stringValue,
                name: name.stringValue,
                phone: phone ? phone.stringValue : 'N/A',
                skills: skills?.arrayValue?.values || [],
                remaining_hours: remaining_hours ? remaining_hours.doubleValue : 0,
                trainer_bio: trainer_bio?.stringValue,
                trainer_certificate_image: fields?.trainer_certificate_image?.stringValue,
                nameUrl
            }
        }
        return null
    })

const PendingTrainerList = () => {
    const { http } = useHttp()
    const [users, setUsers] = useState([])
    const [searchText, setSearchText] = useState([])
    const [searchedColumn, setSearchedColumn] = useState([])
    const [isModalVisible, setIsModalVisible] = useState(false)
    const [isEditModalVisible, setIsEditModalVisible] = useState(false)
    const [isDetailModalVisible, setIsDetailModalVisible] = useState(false)
    const [confirmLoading, setConfirmLoading] = React.useState(false)
    const [activeTrainer, setActiveTrainer] = React.useState('')
    // const [searchInput, setSearchInput] = useState()
    const inputRef = React.useRef(null)

    const showModal = (trainer) => {
        setIsModalVisible(true)
        setActiveTrainer(trainer)
    }
    const showEditModal = (trainer) => {
        console.log('TRAINER', trainer)
        setActiveTrainer(trainer)
        setIsEditModalVisible(true)
    }
    const showDetailModal = (trainer) => {
        setIsDetailModalVisible(true)
        setActiveTrainer(trainer)
    }

    const handleOk = () => {
        // setModalText('The modal will be closed after two seconds')
        setConfirmLoading(true)
        // setTimeout(() => {
        //     setIsModalVisible(false)
        //     setConfirmLoading(false)
        // }, 2000)
        const data = {
            fields: {
                is_approved: {
                    booleanValue: true
                }
            }
        }
        http.patch(
            'https://firestore.googleapis.com/v1/' +
                activeTrainer.nameUrl +
                '?updateMask.fieldPaths=is_approved',
            data
        )
            .then(() => {
                message.success('approved')
                setUsers((prevusers) => prevusers.filter((user) => user.id !== activeTrainer.id))
            })
            .catch((err) => {
                console.log('error', err)
                // message.error('something went wrong')
            })
            .finally(() => {
                setConfirmLoading(false)
                setIsModalVisible(false)
            })
    }

    const handleCancel = () => {
        setIsModalVisible(false)
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
                                        booleanValue: false
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
            dataIndex: 'skills',
            key: 'skills',
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
                        <a
                            href="#view"
                            style={{ color: 'darkmagenta' }}
                            color="blue"
                            onClick={() => showDetailModal(trainer)}>
                            view
                        </a>
                        <Divider type="vertical" />
                        <a
                            href="#approve"
                            style={{ color: 'blue' }}
                            onClick={() => showModal(trainer)}>
                            approve
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

    return (
        <Container style={{ padding: '32px 0' }}>
            <Modal
                title="Trainer Approval "
                visible={isModalVisible}
                onOk={handleOk}
                confirmLoading={confirmLoading}
                onCancel={handleCancel}>
                <p>Are you sure you want to approve yhis trainer?</p>
            </Modal>
            {/* <Modal
                title="Trainer edit modal "
                visible={isModalVisible}
                onOk={handleOk}
                confirmLoading={confirmLoading}
                onCancel={handleCancel}>
                <p>trainer edit modal</p>
            </Modal> */}
            <TrainerEditModal
                isOpen={isEditModalVisible}
                setIsOpen={setIsEditModalVisible}
                activeTrainer={activeTrainer}
                getUsers={getUsers}
            />
            <PendingTrainerDetail
                isOpen={isDetailModalVisible}
                setIsOpen={setIsDetailModalVisible}
                activeTrainer={activeTrainer}
            />
            <PageHeader>Pending Trainer List</PageHeader>
            <Table columns={columns} dataSource={users} rowKey={(record) => record.email} />
        </Container>
    )
}

export default PendingTrainerList
