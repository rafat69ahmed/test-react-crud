import React, { useEffect } from 'react'
import useHttp from 'hook/useHttp'
import Container from 'component/layout/container'
import { Modal, Form, Input, message, Row, Col } from 'antd'

const ContactEditModal = ({ isOpen, setIsOpen, activeClient, getUsers }) => {
    const [form] = Form.useForm()
    const { http } = useHttp()
    const [confirmLoading, setConfirmLoading] = React.useState(false)
    useEffect(() => {
        form.setFieldsValue({
            name: activeClient.name,
            phone: activeClient.phone,
            company: activeClient.company,
            address: activeClient.address
        })
    }, [activeClient])
    const handleOk = () => {
        setConfirmLoading(true)
        form.submit()
        // form.resetFields()
    }
    const handleCancel = () => {
        // form.resetFields()
        setIsOpen(false)
    }
    const onFinish = (values) => {
        // console.log('selected', selectedSkills)
    }
    const onFinishFailed = () => {
        setConfirmLoading(false)
    }
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
    return (
        <div>
            <Modal
                title="Trainer edit modal "
                visible={isOpen}
                onOk={handleOk}
                confirmLoading={confirmLoading}
                onCancel={handleCancel}>
                <Container>
                    <Row>
                        <Col span={24}>
                            <Form
                                {...formItemLayout}
                                form={form}
                                onFinishFailed={onFinishFailed}
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
                                    label="Company"
                                    rules={[
                                        {
                                            required: true,
                                            message: 'Please input your company!',
                                            whitespace: true
                                        }
                                    ]}>
                                    <Input />
                                </Form.Item>
                                <Form.Item
                                    name="address"
                                    label="address"
                                    rules={[
                                        {
                                            required: true,
                                            message: 'Please input your address!',
                                            whitespace: true
                                        }
                                    ]}>
                                    <Input />
                                </Form.Item>
                            </Form>
                        </Col>
                    </Row>
                </Container>
            </Modal>
        </div>
    )
}

export default ContactEditModal
