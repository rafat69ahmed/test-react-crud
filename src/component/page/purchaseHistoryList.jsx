/* eslint-disable react/display-name */
import React, { useEffect, useState } from 'react'
import PageHeader from 'component/common/pageHeader'
import Container from 'component/layout/container'
import useHttp from 'hook/useHttp'
import { Table } from 'antd'
import groupBy from 'lodash.groupby'
import { DatePicker, Modal } from 'antd'
import dayjs from 'dayjs'
import PurchaseHistoryDetail from 'component/content/purchaseHistoryDetail'

// const { Title } = Typography
const processUserData = (usersResponse) => {
    const groupedData = groupBy(usersResponse, 'fields.trainer_email.stringValue')
    // console.log('groupedData', groupedData)
    const emails = Object.keys(groupedData) || []
    const resultArr = emails.map((email, index) => {
        return {
            id: index + 1,
            trainer_email: email,
            trainer_total_amount: groupedData[email].reduce((amount, gdata) => {
                amount = amount + gdata.fields.amount.doubleValue
                return amount
            }, 0),
            trainer_total_purchase_hours: groupedData[email].reduce((remaining_hours, gdata) => {
                // gdata.fields.remaining_hours.doubleValue
                remaining_hours =
                    remaining_hours + parseInt(gdata.fields.hour_purchased.integerValue)
                return remaining_hours
            }, 0),
            trainer_name: groupedData[email][0].fields.trainer_name?.stringValue,
            trainer_phone: groupedData[email][0].fields.trainer_phone?.stringValue,
            trainer_detail_list: groupedData[email]
        }
    })
    // console.log('before', resultArr)
    return resultArr
}

const PurchaseHistoryList = () => {
    const { http } = useHttp()
    // eslint-disable-next-line no-unused-vars
    const [users, setUsers] = useState([])
    const [loading, setLoading] = useState(false)
    const [isModalVisible, setIsModalVisible] = useState(false)
    const [activeDataSet, setActiveDataSet] = React.useState()

    const showModal = (dataSet) => {
        setIsModalVisible(true)
        setActiveDataSet(dataSet)
    }
    const handleOk = () => {
        setIsModalVisible(false)
        console.log('active data', activeDataSet)
    }

    const handleCancel = () => {
        setIsModalVisible(false)
    }

    const getUsers = (date) => {
        // console.log('hello date', date)
        const urlDate = date ? date : dayjs().format('MM-YYYY')
        setLoading(true)
        const url = `https://firestore.googleapis.com/v1/projects/thefeelgoodfactory-c0649/databases/(default)/documents/purchase_history/by_month/${urlDate}`
        // const query = {
        // }
        http.get(url)
            .then((res) => {
                console.log(res.data)
                setUsers(processUserData(res.data.documents))
            })
            .catch((err) => console.log(err))
            .finally(() => {
                setLoading(false)
            })
    }

    function onChange(date, dateString) {
        console.log('date', date)
        console.log('dateString', dateString.split('-').reverse().join('-'))
        let urlDate = dateString.split('-').reverse().join('-')
        getUsers(urlDate)
    }

    useEffect(() => {
        let today = dayjs().format('MM-YYYY')
        console.log('today', today)
        getUsers(today)
    }, [])
    const columns = [
        {
            title: 'Name',
            width: 20,
            dataIndex: 'trainer_name',
            key: 'trainer_name'
        },
        {
            title: 'Email',
            width: 50,
            dataIndex: 'trainer_email',
            key: 'trainer_email'
        },
        {
            title: 'Phone',
            width: 50,
            dataIndex: 'trainer_phone',
            key: 'trainer_phone'
        },
        {
            title: 'Total Amount',
            width: 50,
            dataIndex: 'trainer_total_amount',
            key: 'trainer_total_amount',
            render: (trainer_total_amount) => {
                return <p>£{trainer_total_amount}</p>
            }
        },
        {
            title: 'Total Hours Purchased',
            width: 50,
            dataIndex: 'trainer_total_purchase_hours',
            key: 'trainer_total_purchase_hours'
        },
        {
            title: 'Action',
            key: 'operation',
            fixed: 'right',
            width: 60,
            render: (trainer) => {
                return (
                    <div>
                        <a href="#approve" onClick={() => showModal(trainer)}>
                            view
                        </a>
                    </div>
                )
            }
        }
    ]
    return (
        <Container style={{ padding: '32px 0' }}>
            <Modal
                title="View purchase history detail"
                visible={isModalVisible}
                onOk={handleOk}
                onCancel={handleCancel}
                width={1000}>
                <PurchaseHistoryDetail detailData={activeDataSet} />
            </Modal>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '16px' }}>
                <PageHeader>Purchase history List</PageHeader>
                <div style={{ display: 'flex', alignItems: 'center' }}>
                    <p style={{ marginRight: '16px', marginBottom: '0px' }}>
                        <strong>Select month</strong>
                    </p>
                    <DatePicker onChange={onChange} picker="month" />
                </div>
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

export default PurchaseHistoryList
