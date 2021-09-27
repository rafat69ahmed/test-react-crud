import React, { useEffect, useState } from 'react'
import PageHeader from 'component/common/pageHeader'
import Container from 'component/layout/container'
import { Form, Input, Button, message, Row, Col, Select } from 'antd'
import useHttp from 'hook/useHttp'

const { Option } = Select
const TrainerCreate = () => {
    const formItemLayout = {
        labelCol: {
            xs: {
                span: 24
            }
            // sm: {
            //     span: 8
            // }
        },
        wrapperCol: {
            xs: {
                span: 24
            }
            // sm: {
            //     span: 16
            // }
        }
    }
    const tailFormItemLayout = {
        wrapperCol: {
            xs: {
                span: 24,
                offset: 0
            },
            sm: {
                span: 16,
                offset: 8
            }
        }
    }
    const [form] = Form.useForm()
    const { http } = useHttp()
    const [skills, setSkills] = useState([])
    const [selectedSkills, setSelectedSkills] = useState()

    // const children = []
    const processSkillData = (skillResponse) =>
        skillResponse.map((skill, index) => {
            if (skill) {
                return (
                    <Option key={index} value={skill.stringValue}>
                        {skill.stringValue}
                    </Option>
                )
            }
            return null
        })

    useEffect(() => {
        const getSkills = () => {
            const url =
                'https://firestore.googleapis.com/v1/projects/thefeelgoodfactory-c0649/databases/(default)/documents/static_contents/trainer'
            http.get(url)
                .then((res) => {
                    setSkills(processSkillData(res.data.fields.categories.arrayValue.values))
                })
                .catch((err) => console.log(err))
        }
        getSkills()
    }, [])

    const addUserData = (values, responseData) => {
        // console.log('Received values of form: ', values)
        // console.log('response from 1st call: ', responseData)
        const url = `https://firestore.googleapis.com/v1/projects/thefeelgoodfactory-c0649/databases/(default)/documents/users/${responseData.localId}`
        const query = {
            fields: {
                user_type: {
                    stringValue: 'trainer'
                },
                is_approved: {
                    booleanValue: false
                },
                email: {
                    stringValue: values.email
                },
                remaining_hours: {
                    doubleValue: 0
                },
                name: {
                    stringValue: values.name
                },
                is_enable_push_notification: {
                    booleanValue: true
                },
                uid: {
                    stringValue: responseData.localId
                },
                phone: {
                    stringValue: values.phone
                },
                trainer_bio: {
                    stringValue: values.trainer_bio
                },
                skills: {
                    arrayValue: {
                        values: selectedSkills
                    }
                }
            }
        }
        http.patch(url, query)
            .then((res) => {
                console.log('user data updated', res.data)
                message.success('trainer created successfully')
                form.resetFields()
            })
            .catch((err) => console.log(err))
    }

    const onFinish = (values) => {
        console.log('Received values of form: ', values)
        const url =
            'https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=AIzaSyAvEvny-VVw5c7gjAxIc9WAd3AB5E7U18o'
        const query = {
            email: values.email,
            password: values.password,
            returnSecureToken: true
        }
        http.post(url, query)
            .then((res) => {
                console.log('user created', res.data)
                addUserData(values, res.data)
            })
            .catch((err) => console.log(err))
    }
    // const children = []

    // for (let i = 10; i < 36; i++) {
    //     children.push(<Option key={i.toString(36) + i}>{i.toString(36) + i}</Option>)
    // }
    function handleChange(skills) {
        const requestSkills = skills.map((skill) => ({ stringValue: skill }))
        // const testObj = { stringValue: value[0] }
        // requestSkills.push({ stringValue: value })
        setSelectedSkills(requestSkills)
        console.log('selected', selectedSkills)
    }
    return (
        <Container style={{ padding: '32px 0' }}>
            {console.log('children', skills)}
            <PageHeader>Trainer Create</PageHeader>
            <Row>
                <Col span={8}>
                    <Form
                        {...formItemLayout}
                        form={form}
                        name="register"
                        onFinish={onFinish}
                        scrollToFirstError
                        size="large">
                        <Form.Item
                            name="name"
                            label="Name"
                            rules={[
                                {
                                    required: true,
                                    message: 'Please input your name!',
                                    whitespace: true
                                }
                            ]}>
                            <Input />
                        </Form.Item>
                        <Form.Item
                            name="email"
                            label="E-mail"
                            rules={[
                                {
                                    type: 'email',
                                    message: 'The input is not valid E-mail!'
                                },
                                {
                                    required: true,
                                    message: 'Please input your E-mail!'
                                }
                            ]}>
                            <Input />
                        </Form.Item>
                        <Form.Item
                            name="skillSet"
                            label="Skills"
                            rules={[{ required: true, message: 'Please select skills!' }]}>
                            <Select
                                mode="multiple"
                                allowClear
                                style={{ width: '100%' }}
                                placeholder="Please select"
                                onChange={handleChange}>
                                {skills}
                            </Select>
                        </Form.Item>
                        <Form.Item
                            name="phone"
                            label="Phone Number"
                            rules={[
                                {
                                    required: true,
                                    message: 'Please input your phone number!'
                                }
                            ]}>
                            <Input
                                style={{
                                    width: '100%'
                                }}
                            />
                        </Form.Item>
                        <Form.Item
                            name="trainer_bio"
                            label="Trainer Bio"
                            // rules={[
                            //     {
                            //         required: true,
                            //         message: 'Please input your phone number!'
                            //     }
                            // ]}
                        >
                            <Input.TextArea />
                        </Form.Item>
                        <Form.Item
                            name="password"
                            label="Password"
                            rules={[
                                {
                                    required: true,
                                    message: 'Please input your password!'
                                }
                            ]}
                            hasFeedback>
                            <Input.Password />
                        </Form.Item>

                        <Form.Item
                            name="confirm"
                            label="Confirm Password"
                            dependencies={['password']}
                            hasFeedback
                            rules={[
                                {
                                    required: true,
                                    message: 'Please confirm your password!'
                                },
                                ({ getFieldValue }) => ({
                                    validator(_, value) {
                                        if (!value || getFieldValue('password') === value) {
                                            return Promise.resolve()
                                        }

                                        return Promise.reject(
                                            new Error(
                                                'The two passwords that you entered do not match!'
                                            )
                                        )
                                    }
                                })
                            ]}>
                            <Input.Password />
                        </Form.Item>
                        <Form.Item style={{ marginTop: '40px' }}>
                            <Button type="primary" htmlType="submit">
                                Register
                            </Button>
                        </Form.Item>
                    </Form>
                </Col>
            </Row>
        </Container>
    )
}

export default TrainerCreate
