import React, { useState } from 'react'
import PageHeader from 'component/common/pageHeader'
import Container from 'component/layout/container'
import { Form, Input, Button, message, Row, Col } from 'antd'
import dayjs from 'dayjs'
import { v4 as uuidv4 } from 'uuid'

const ContactCreate = () => {
    const formItemLayout = {
        labelCol: {
            xs: {
                span: 24
            }
        },
        wrapperCol: {
            xs: {
                span: 24
            }
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
    const contacts = JSON.parse(localStorage.getItem('list')) || []

    const onFinish = (values) => {
        values['uid'] = uuidv4()
        values['created_at'] = new Date().toLocaleDateString()
        values['updated_at'] = null
        console.log('Received values of form: ', values)
        contacts.push(values)
        console.log('cars', contacts)
        localStorage.setItem('list', JSON.stringify(contacts))
    }
    return (
        <Container style={{ padding: '32px 0' }}>
            <PageHeader>Contact Create</PageHeader>
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
                            name="phone"
                            label="Phone"
                            rules={[
                                {
                                    required: true,
                                    message: 'Please input your phone!'
                                }
                            ]}>
                            <Input />
                        </Form.Item>
                        <Form.Item
                            name="company"
                            label="company"
                            rules={[
                                {
                                    required: true,
                                    message: 'Please input your company name!'
                                }
                            ]}
                            hasFeedback>
                            <Input />
                        </Form.Item>
                        <Form.Item
                            name="address"
                            label="address"
                            rules={[
                                {
                                    required: true,
                                    message: 'Please input your company address!'
                                }
                            ]}
                            hasFeedback>
                            <Input />
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

export default ContactCreate
