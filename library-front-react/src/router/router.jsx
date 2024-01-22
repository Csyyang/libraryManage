
import Login from "@/pages/login";
import Layout from '@/components/Layout'
import BookList from "@/pages/book/bookList";
import { Navigate } from "react-router-dom";
import { LaptopOutlined, NotificationOutlined } from '@ant-design/icons';
import BeforeEach from './beforEach'

export default [
    {
        path: '/',
        element: <Navigate to='/book/bookList' />,
        meta: {
            showMenu: false,
        }
    },
    {
        path: "/book",
        element: <Layout />,
        meta: {
            name: '图书',
            icon: LaptopOutlined
        },
        children: [
            {
                path: "bookList",
                element: <BeforeEach render={BookList} />,
                meta: {
                    name: '图书列表',
                }
            },
            {
                path: 'test',
                element: <div>图书馆测试</div>,
                meta: {
                    name: 'ttttt'
                }
            }
        ]
    },
    {
        path: '/test',
        element: <Layout />,
        meta: {
            name: '测试',
            icon: NotificationOutlined
        },
        children: [
            {
                path: 'testChild',
                element: <div>test</div>,
                meta: {
                    name: '测试1'
                }
            }
        ]
    },
    {
        path: '/login',
        element: <Login />,
        meta: {
            showMenu: false,
            name: '登录'
        }
    }
]