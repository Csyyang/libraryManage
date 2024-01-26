import styles from './index.module.css';
import { Card, Button, Form, Input } from 'antd';
import { login, admLogin } from '@/api/login';
import { useState, useCallback } from 'react';
import { useMemo } from 'react';
import { useNavigate } from "react-router-dom";
import { useDispatch } from 'react-redux'
import {  changeLoginState, changeAdminState } from '@/store/user'


const Login = () => {

    const dispatch = useDispatch()

    const users = useMemo(() => [
        {
            title: '普通用户登录',
            fetch: login
        },
        {
            title: '管理员登录',
            fetch: admLogin
        }
    ], [])

    const [status, setStatus] = useState(0)


    const changeStatus = useCallback((val) => {
        setStatus(val)
    }, [])


    const navigate = useNavigate()
    const onFinish = useCallback(async (val) => {
        const res = await users[status].fetch(val);
        dispatch(changeLoginState(true))
        
        if(res.data.isAdmin) {
            dispatch(changeAdminState(true))
        }
        navigate('/')
        console.log(res);
    }, [users, status, dispatch, navigate])

    return (
        <div className={styles.center}>
            <Card style={{ width: 450 }}>
                <div className={styles.title}>{users[status].title}</div>
                <Form
                    name="basic"
                    labelCol={{
                        span: 6,
                    }}
                    wrapperCol={{
                        span: 18,
                    }}
                    style={{
                        maxWidth: 600,
                    }}
                    onFinish={onFinish}
                    autoComplete="off"
                    initialValues={{
                        username: 'root',
                        password: 'root'
                    }}
                >
                    <Form.Item
                        label="用户名"
                        name="username"
                        rules={[
                            {
                                required: true,
                                message: '请输入',
                            },
                        ]}
                    >
                        <Input />
                    </Form.Item>

                    <Form.Item
                        label="密码"
                        name="password"
                        rules={[
                            {
                                required: true,
                                message: '请输入',
                            },
                        ]}
                    >
                        <Input.Password />
                    </Form.Item>

                    <Form.Item
                        wrapperCol={{
                            offset: 5,
                            span: 19,
                        }}>
                        {status === 0 ? <Button type="link" onClick={() => changeStatus(1)}>切换为管理员登录</Button> : <Button type="link" onClick={() => changeStatus(0)}>切换为普通用户登录</Button>}
                    </Form.Item>

                    <Form.Item
                        wrapperCol={{
                            offset: 8,
                            span: 16,
                        }}
                    >
                        <Button type="primary" htmlType="submit">
                            登录
                        </Button>
                    </Form.Item>
                </Form>
            </Card>
        </div>
    )
}

export default Login