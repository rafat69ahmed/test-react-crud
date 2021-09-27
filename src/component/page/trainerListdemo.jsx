/* eslint-disable react/display-name */
import React, { useEffect, useState } from 'react'
import PageHeader from 'component/common/pageHeader'
// import { Row, Col } from 'antd'
// import { Button } from 'antd'
import Container from 'component/layout/container'
import useHttp from 'hook/useHttp'
import { Table } from 'antd'

const processSkillstr = (skills) => {
    let skillStr = ''
    if (skills.length) {
        let counter = 0
        for (let skill of skills) {
            if (counter < 2) {
                skillStr += skill.stringValue
                if (counter < skills.length) {
                    skillStr += ' ,'
                }
            } else {
                skillStr += ' ...'
                break
            }
            counter++
        }
    }
    return skillStr
}
const processUserData = (usersResponse) =>
    usersResponse.map((user, index) => {
        const { fields } = user?.document
        if (fields) {
            const { email, name, phone, skills, remaining_hours } = fields
            console.log('skills', skills)
            return {
                id: index + 1,
                email: email.stringValue,
                name: name.stringValue,
                phone: phone ? phone.stringValue : 'N/A',
                // skills: [
                //     'hahshha',
                //     'ahdkjhfhsdfjsdf',
                //     'ajdsgjasgdhsdhgashd',
                //     'asdasdasd',
                //     'hahshha',
                //     'ahdkjhfhsdfjsdf',
                //     'ajdsgjasgdhsdhgashd',
                //     'asdasdasd'
                // ],
                skills: skills?.arrayValue?.values || [],
                // skills: skills?.arrayValue?.values.map((item) => {
                //     return item.stringValue ? item.stringValue[0] : 0
                // }),
                remaining_hours: remaining_hours ? remaining_hours.doubleValue : 0
            }
        }
        return null
    })

const TrainerList = () => {
    const { http } = useHttp()
    const [users, setUsers] = useState([])

    useEffect(() => {
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
                                stringValue: 'trainer'
                            }
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
        getUsers()
    }, [])
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
        },
        {
            title: 'Phone',
            width: 150,
            dataIndex: 'phone',
            key: 'phone'
        },
        // {
        //     title: 'Skills',
        //     width: 150,
        //     dataIndex: 'skills',
        //     key: 'skills'
        // },
        {
            title: 'Skills',
            width: 150,
            key: 'skills',
            dataIndex: 'skills',
            // const skilldata = processSkillstr()
            render: (skills) => {
                const skillStr = processSkillstr(skills) || 'N/A'
                return <p>{skillStr}</p>
            }
        },
        {
            title: 'Remaining Hour',
            width: 150,
            dataIndex: 'remaining_hours',
            key: 'remaining_hours'
        }
    ]

    return (
        <Container style={{ padding: '32px 0' }}>
            <PageHeader>Trainer List</PageHeader>
            <Table columns={columns} dataSource={users} rowKey={(record) => record.email} />
        </Container>
    )
}

export default TrainerList
