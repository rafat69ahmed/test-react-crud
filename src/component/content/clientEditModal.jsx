import React, { useEffect } from 'react'
import useHttp from 'hook/useHttp'
import Container from 'component/layout/container'
import { Modal, Form, Input, message, Row, Col } from 'antd'

const ClientEditModal = ({ isOpen, setIsOpen, activeClient, getUsers }) => {
    const [form] = Form.useForm()
    const { http } = useHttp()
    const [confirmLoading, setConfirmLoading] = React.useState(false)
    useEffect(() => {
        form.setFieldsValue({
            name: activeClient.name
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

        // console.log('Received values of form: ', values)
        const url = `https://firestore.googleapis.com/v1/${activeClient.nameUrl}?updateMask.fieldPaths=user_type&updateMask.fieldPaths=name`
        const query = {
            fields: {
                user_type: {
                    stringValue: 'client'
                },
                // is_approved: {
                //     booleanValue: false
                // },
                // email: {
                //     stringValue: values.email
                // },
                // remaining_hours: {
                //     doubleValue: 0
                // },
                name: {
                    stringValue: values.name
                }
                // is_enable_push_notification: {
                //     booleanValue: true
                // }
                // uid: {
                //     stringValue: activeClient.uid
                // }
                // phone: {
                //     stringValue: values.phone
                // },
                // trainer_bio: {
                //     stringValue: values.trainer_bio
                // },
                // skills: {
                //     arrayValue: {}
                // }
            }
        }
        http.patch(url, query)
            .then((res) => {
                console.log('client data updated', res.data)
                message.success('client updated successfully')
                getUsers()
            })
            .catch((err) => console.log(err))
            .finally(() => {
                setIsOpen(false)
                setConfirmLoading(false)
            })
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
                            </Form>
                        </Col>
                    </Row>
                </Container>
            </Modal>
        </div>
    )
}

export default ClientEditModal
