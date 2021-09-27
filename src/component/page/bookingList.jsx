/* eslint-disable react/display-name */
import React, { useEffect, useState } from 'react'
import PageHeader from 'component/common/pageHeader'
import Container from 'component/layout/container'
import useHttp from 'hook/useHttp'
import { Table, Tag, DatePicker } from 'antd'
import dayjs from 'dayjs'

const processUserData = (usersResponse) =>
    usersResponse?.map((user, index) => {
        if (user) {
            const resultArr = {
                id: index + 1,
                email: user.fields?.trainer_email?.stringValue || 'N/A',
                name: user.fields?.trainer_name?.stringValue || 'N/A',
                phone: user?.fields?.trainer_phone?.stringValue || 'N/A',
                slots: user?.fields?.slots?.arrayValue?.values || [],
                booking_date: user?.fields?.create_time?.timestampValue || 'N/A'
            }
            return resultArr
        }
        return null
    })

const BookingList = () => {
    const { http } = useHttp()
    const [users, setUsers] = useState([])
    const [loading, setLoading] = useState(false)
    function onChange(date, dateString) {
        let urlDate = dateString.split('-').reverse().join('-')
        getUsers(urlDate)
    }
    const getUsers = (date) => {
        setLoading(true)
        const url = `https://firestore.googleapis.com/v1/projects/thefeelgoodfactory-c0649/databases/(default)/documents/trainer_calendar/all_bookings/${date}`
        http.get(url)
            .then((res) => {
                setUsers(processUserData(res.data.documents))
            })
            .catch((err) => console.log(err))
            .finally(() => {
                setLoading(false)
            })
    }
    useEffect(() => {
        let today = dayjs().format('MM-YYYY')
        getUsers(today)
    }, [])
    const columns = [
        {
            title: 'Name',
            width: 20,
            dataIndex: 'name',
            key: 'name'
        },
        {
            title: 'Email',
            width: 50,
            dataIndex: 'email',
            key: 'email'
        },
        {
            title: 'Phone',
            width: 50,
            dataIndex: 'phone',
            key: 'phone'
        },
        {
            title: 'Booked Slots',
            width: 300,
            key: 'slots',
            dataIndex: 'slots',
            render: (slots) => (
                <>
                    {slots.map((slot, index) => {
                        return (
                            <Tag color="blue" key={index}>
                                {slot.stringValue}
                            </Tag>
                        )
                    })}
                </>
            )
        },
        {
            title: 'Booking Date',
            width: 10,
            dataIndex: 'booking_date',
            key: 'booking_date',
            render: (booking_date) => {
                return <p>{new Date(booking_date).toLocaleDateString()}</p>
            }
        }
    ]

    return (
        <Container style={{ padding: '32px 0' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '16px' }}>
                <PageHeader>Booking List</PageHeader>
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

export default BookingList
