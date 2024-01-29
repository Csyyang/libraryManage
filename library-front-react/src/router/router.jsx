
import Login from "@/pages/login";
import Layout from '@/components/Layout'
import BookList from "@/pages/book/bookList";
import BorrowedBooks from "@/pages/book/borrowedBooks";
import { LaptopOutlined, NotificationOutlined } from '@ant-design/icons';
import BeforeEach from './beforEach'
import Redirect from "./redirect";
import BorrowedQ from "@/pages/book/borrowedQ";
import BookReturnList from '@/pages/book/bookReturnList'
import Manage from "@/pages/inventory/manager";


export default [
    {
        path: '/',
        element: <Redirect />,
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
                path: 'BorrowedBooks',
                element: <BeforeEach render={BorrowedBooks} />,
                meta: {
                    name: '我的借书'
                }
            }
        ]
    },
    {
        path: '/examine',
        element: <Layout />,
        meta: {
            name: '审核',
            isAdmin: true,
            icon: NotificationOutlined,
        },
        children: [
            {
                path: 'borrowed',
                element: <BeforeEach render={BorrowedQ} />,
                meta: {
                    name: '借阅',
                }
            }, {
                path: 'returened',
                element: <BeforeEach render={BookReturnList} />,
                meta: {
                    name: '归还',
                }
            }
        ]

    },
    {
        path: '/inventory',
        element: <Layout />,
        meta: {
            name: '库存',
            icon: NotificationOutlined,
            isAdmin: true
        },
        children: [
            {
                path: 'manage',
                element: <BeforeEach render={Manage} />,
                meta: {
                    name: '库存管理',
                    isAdmin: true
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