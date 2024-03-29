import { UserOutlined } from '@ant-design/icons';
import { Breadcrumb, Layout, Menu, theme, Avatar, Dropdown, Button } from 'antd';
const { Header, Content, Sider } = Layout;
import styles from './index.module.css'
import routes from '@/router/router'
import React, { useMemo, useCallback } from 'react';
import { useNavigate, Outlet } from "react-router-dom"
import { useLocation } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux'
import clearCookie from '@/util/clearnCookie';
import { loginOut } from '@/api/login'
import { changeLoginState, changeAdminState } from '@/store/user'


const App = () => {
    const {
        token: { colorBgContainer, borderRadiusLG },
    } = theme.useToken();

    const isAdmin = useSelector((state) => state.user.isAdmin)

    const siderArr = useMemo(() => {
        const sortArr = routes.filter(item => item.meta.showMenu !== false && item.children.length >= 1 && Boolean(item.meta.isAdmin) === JSON.parse(isAdmin))
        const arr = sortArr.map(item => {
            if (item.children.length === 1) {
                return {
                    key: item.path + '/' + item.children[0].path,
                    icon: React.createElement(item.meta.icon),
                    label: item.children[0].meta.name
                }
            } else {
                return {
                    key: item.path,
                    icon: React.createElement(item.meta.icon),
                    label: item.meta.name,
                    children: item.children.map(chid => ({
                        key: item.path + '/' + chid.path,
                        label: chid.meta.name
                    }))
                }
            }
        })
        return arr
    }, [])


    const location = useLocation()
    const defaultSelectedKeys = location.pathname
    const historyList = useMemo(() => {
        return location.pathname.split('/').filter(item => Boolean(item)).map(item => ({ title: item }))
    }, [location])

    const navigate = useNavigate();
    const Jump = useCallback((e) => {
        navigate(e.key);
    }, [navigate])


    const dispatch = useDispatch()
    const cleanLogin = async () => {
        await loginOut()
        clearCookie('connect.sid')
        dispatch(changeLoginState(false))
        dispatch(changeAdminState(false))
        navigate('/login')
    }

    const items = [
        {
            key: '1',
            label: (
                <Button onClick={cleanLogin} type="link">登出</Button>
            ),
        },
    ]




    return (
        <Layout>

            <Header
                style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between'
                }}
            >
                <div className={styles.logo}>图书管理系统</div>

                <Dropdown
                    menu={{
                        items,
                    }}
                    placement="bottom"
                >
                    <Avatar style={{ backgroundColor: '#87d068', cursor: 'pointer' }} size={32} icon={<UserOutlined />} />
                </Dropdown>
            </Header>

            <Layout className={styles.Layout}>
                {/* 侧边栏 */}
                <Sider
                    width={200}
                    style={{
                        background: colorBgContainer,
                    }}
                >
                    <Menu
                        mode="inline"
                        defaultSelectedKeys={[defaultSelectedKeys]}
                        defaultOpenKeys={['/book']}
                        style={{
                            height: '100%',
                            borderRight: 0,
                        }}
                        onClick={Jump}
                        items={siderArr}
                    />
                </Sider>
                <Layout
                    style={{
                        padding: '0 24px 24px',
                    }}
                >
                    <Breadcrumb
                        style={{
                            margin: '16px 0',
                        }}

                        items={historyList}
                    />
                    <Content
                        style={{
                            padding: 24,
                            margin: 0,
                            minHeight: 280,
                            height: 'calc(100vh - 240px)',
                            background: colorBgContainer,
                            borderRadius: borderRadiusLG,
                            overflowY: 'auto'
                        }}
                    >
                        <Outlet />
                    </Content>
                </Layout>
            </Layout>
        </Layout>
    );
};
export default App;