import React from 'react'
// import React, { useEffect, useState } from 'react'
import PageHeader from 'component/common/pageHeader'
// import { Row, Col } from 'antd'
// import { Button } from 'antd'
import Container from 'component/layout/container'
// import useHttp from 'hook/useHttp'
// import useHttp from 'hook/useHttp'
import { Table } from 'antd'

// const processUserData = (usersResponse) =>
//     usersResponse.map((user, index) => {
//         const { fields } = user?.document
//         if (fields) {
//             const { email, name } = fields
//             return {
//                 id: index + 1,
//                 email: email.stringValue,
//                 name: name.stringValue
//             }
//         }
//         return null
//     })

const Home = () => {
    // const { http } = useHttp()
    // const [users, setUsers] = useState([])
    // const [users, setUsers] = useState([])

    // useEffect(() => {
    //     const getUsers = () => {
    //         const url =
    //             'https://firestore.googleapis.com/v1/projects/thefeelgoodfactory-c0649/databases/(default)/documents:runQuery'
    //         const query = {
    //             structuredQuery: {
    //                 from: [
    //                     {
    //                         collectionId: 'users',
    //                         allDescendants: false
    //                     }
    //                 ]
    //             }
    //         }
    //         http.post(url, query)
    //             .then((res) => {
    //                 console.log(res.data)
    //                 setUsers(processUserData(res.data))
    //             })
    //             .catch((err) => console.log(err))
    //     }
    //     getUsers()
    // }, [])
    const data = []
    const columns = [
        {
            title: 'ID',
            width: 25,
            dataIndex: 'id',
            key: 'id',
            fixed: 'left',
            sorter: (a, b) => a.id - b.id
        },
        {
            title: 'Name',
            width: 20,
            dataIndex: 'name',
            key: 'name'
        },
        {
            title: 'Email',
            width: 150,
            dataIndex: 'email',
            key: 'email'
        }
    ]

    return (
        <Container style={{ padding: '32px 0' }}>
            {/* {console.log(users)} */}
            <PageHeader>Home Page</PageHeader>
            <Table columns={columns} dataSource={data} rowKey={(record) => record.email} />
        </Container>
    )
}

export default Home
