import React, { useEffect, useState } from 'react'
import PageHeader from 'component/common/pageHeader'
import Container from 'component/layout/container'
import { Modal, Form, Input, Button, message, Row, Col, Select } from 'antd'
import useHttp from 'hook/useHttp'

const { Option } = Select
const TrainerEditModal = ({ isOpen, setIsOpen, activeTrainer, getUsers }) => {
    const [form] = Form.useForm()
    const { http } = useHttp()
    const [skills, setSkills] = useState([])
    const [selectedSkills, setSelectedSkills] = useState()
    const [confirmLoading, setConfirmLoading] = React.useState(false)

    useEffect(() => {
        console.log('activetrainer', activeTrainer)
        form.setFieldsValue({
            name: activeTrainer.name,
            skillSet:
                activeTrainer?.skills?.map((skill) => {
                    return skill.stringValue
                }) || [],
            phone: activeTrainer.phone,
            trainer_bio: activeTrainer.trainer_bio
        })
    }, [activeTrainer])

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
    const handleOk = () => {
        setConfirmLoading(true)
        form.submit()
    }

    const handleCancel = () => {
        setIsOpen(false)
        // form.resetFields()
    }
    // const confirmLoading = () => {
    //     setConfirmLoading(true)
    // }
    const onFinish = (values) => {
        const requestSkills = values?.skillSet?.map((skill) => ({ stringValue: skill })) || []
        // const testObj = { stringValue: value[0] }
        // const testObj = { stringValue: value[0] }
        // requestSkills.push({ stringValue: value })
        console.log('on trainer update', activeTrainer)
        setSelectedSkills(requestSkills)

        console.log('requestSkills of form: ', requestSkills)
        const url = `https://firestore.googleapis.com/v1/${activeTrainer.nameUrl}?updateMask.fieldPaths=user_type&updateMask.fieldPaths=remaining_hours&updateMask.fieldPaths=name&updateMask.fieldPaths=is_enable_push_notification&updateMask.fieldPaths=phone&updateMask.fieldPaths=trainer_bio&updateMask.fieldPaths=skills`
        const query = {
            fields: {
                user_type: {
                    stringValue: 'trainer'
                },
                // is_approved: {
                //     booleanValue: false
                // },
                // email: {
                //     stringValue: values.email
                // },
                remaining_hours: {
                    doubleValue: 0
                },
                name: {
                    stringValue: values.name
                },
                is_enable_push_notification: {
                    booleanValue: true
                },
                // uid: {
                //     stringValue: responseData.localId
                // },
                phone: {
                    stringValue: values.phone
                },
                trainer_bio: {
                    stringValue: values.trainer_bio
                },
                skills: {
                    arrayValue: {
                        values: requestSkills
                    }
                }
            }
        }
        http.patch(url, query)
            .then((res) => {
                console.log('trainer data updated', res.data)
                message.success('trainer updated successfully')
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
    function handleChange(skills) {
        const requestSkills = skills.map((skill) => ({ stringValue: skill }))
        // const testObj = { stringValue: value[0] }
        // requestSkills.push({ stringValue: value })
        setSelectedSkills(requestSkills)
        // console.log('selected', selectedSkills)
    }
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
                                {/* <Form.Item
                                    name="email"
                                    label="E-mail"
                                    initialValue={activeTrainer.email}
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
                                </Form.Item> */}
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
                                <Form.Item name="trainer_bio" label="Trainer Bio">
                                    <Input.TextArea />
                                </Form.Item>
                                {/* <Form.Item style={{ marginTop: '40px' }}>
                                    <Button type="primary" htmlType="submit">
                                        save
                                    </Button>
                                </Form.Item> */}
                            </Form>
                        </Col>
                    </Row>
                </Container>
            </Modal>
        </div>
    )
}

export default TrainerEditModal
