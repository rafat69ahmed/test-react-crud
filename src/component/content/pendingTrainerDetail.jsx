import React, { useEffect, useState } from 'react'
import PageHeader from 'component/common/pageHeader'
import Container from 'component/layout/container'
import useHttp from 'hook/useHttp'
import { Table, Tag, Divider } from 'antd'
import { Modal, message, Button } from 'antd'

const PendingTrainerDetail = ({ isOpen, setIsOpen, activeTrainer }) => {
    // const [isModalVisible, setIsModalVisible] = useState(false)
    // const [form] = Form.useForm()
    const { http } = useHttp()
    const [confirmLoading, setConfirmLoading] = React.useState(false)

    const handleOk = () => {
        console.log('active trainer details', activeTrainer)
        setIsOpen(false)
    }

    const handleCancel = () => {
        setIsOpen(false)
    }
    return (
        <>
            <Modal
                title="Trainer details"
                width={1000}
                visible={isOpen}
                onOk={handleOk}
                onCancel={handleCancel}>
                <p>name: {activeTrainer.name}</p>
                <p>email: {activeTrainer.email}</p>
                <p>phone: {activeTrainer.phone}</p>
                <p>remaing hours: {activeTrainer.remaining_hours}</p>
                <p>skills: {activeTrainer?.skills?.map((skill) => skill.stringValue).join(',')}</p>
                <p>
                    cettificate link:
                    <a
                        href={activeTrainer?.trainer_certificate_image}
                        target="_blank"
                        rel="noreferrer">
                        {activeTrainer.trainer_certificate_image ? ' view certificate' : ' N/A'}
                    </a>
                </p>
            </Modal>
        </>
    )
}

export default PendingTrainerDetail
