import React, { useState } from 'react'
import PageHeader from 'component/common/pageHeader'
import Container from 'component/layout/container'
import { Form, Input, Button, message, Row, Col } from 'antd'
import useHttp from 'hook/useHttp'

const ClientCreate = () => {
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

    const addUserData = (values, responseData) => {
        console.log('Received values of form: ', values)
        console.log('response from 1st call: ', responseData)
        const url = `https://firestore.googleapis.com/v1/projects/thefeelgoodfactory-c0649/databases/(default)/documents/users/${responseData.localId}`
        const query = {
            fields: {
                user_type: {
                    stringValue: 'client'
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
                }
            }
        }
        http.patch(url, query)
            .then((res) => {
                console.log('user data updated', res.data)
                message.success('user created successfully')
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
    return (
        <Container style={{ padding: '32px 0' }}>
            <PageHeader>Client Create</PageHeader>
            <Row>
                <Col span={8}>
                    <Form
                        {...formItemLayout}
                        form={form}
                        name="register"
                        onFinish={onFinish}
                        initialValues={{
                            residence: ['zhejiang', 'hangzhou', 'xihu'],
                            prefix: '86'
                        }}
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

export default ClientCreate
