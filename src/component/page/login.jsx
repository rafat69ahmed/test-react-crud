import { Form, Input, Button, notification } from 'antd'
import React, { useContext, useEffect } from 'react'
// import useHttp from 'hook/useHttp'
import useAuth from 'hook/useAuth'
import UserContext from 'context/userContext'
// import axios from 'axios'
import styles from './login.module.css'
import { Redirect } from 'react-router-dom'

const Login = () => {
    //const [data, setData] = React.useState()
    // const apiUrl = 'https://us-central1-thefeelgoodfactory-c0649.cloudfunctions.net/accessToken'
    // const { http } = useHttp()
    // const onFinish = (values) => {
    //     http.post(apiUrl, {
    //         username: values.username,
    //         secret: values.password
    //     }).then(function (response) {
    //         // setData(response.data)
    //         // localStorage.setItem('tfgf_access_token', response.data.access_token)
    //         console.log(response.data)
    //     })
    //     // http.post('/users', values).then((res) => setData(res.data))
    //     //console.log('Success:', values.password)
    //     // console.log('data', data)
    // }

    const { user } = useContext(UserContext)
    // eslint-disable-next-line no-unused-vars
    const { loginUser, error } = useAuth()

    useEffect(() => {
        if (error) {
            notification.error({
                message: 'Login error!',
                description: 'Check credential & try again!'
            })
        }
    }, [error])

    const handleLoginSubmit = async (values) => {
        const { username, secret } = values
        await loginUser({ username, secret })
    }
    if (user) {
        return <Redirect to="/pending-trainer-list" />
    }
    return (
        <div className={styles.loginContainer}>
            <Form
                name="basic"
                labelCol={{
                    span: 8
                }}
                wrapperCol={{
                    span: 16
                }}
                initialValues={{
                    remember: true
                }}
                onFinish={handleLoginSubmit}>
                <Form.Item
                    label="Username"
                    name="username"
                    rules={[
                        {
                            required: true,
                            message: 'Please input your username!'
                        }
                    ]}>
                    <Input />
                </Form.Item>

                <Form.Item
                    label="Password"
                    name="secret"
                    rules={[
                        {
                            required: true,
                            message: 'Please input your password!'
                        }
                    ]}>
                    <Input.Password />
                </Form.Item>

                <Form.Item
                    wrapperCol={{
                        offset: 8,
                        span: 16
                    }}>
                    <Button type="primary" htmlType="submit">
                        Submit
                    </Button>
                </Form.Item>
            </Form>
        </div>
    )
}

export default Login
