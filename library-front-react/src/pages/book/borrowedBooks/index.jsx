import { Button, Form, Input, Table, Divider, Tag} from 'antd';
import { useState, useEffect } from 'react';
import { borrowRecord } from '@/api/book'

const SearchForm = ({ title, setTitle, setDataSource, paging, setPaging, setTotal }) => {

    const onSearch = (values) => {
        setPaging({
            size: 10,
            page: 1
        })
        setTotal(0)
        setTitle(values.title)
        setDataSource([])

    }

    const getBorrowedfetch = async () => {
        const res = await borrowRecord({
            ...paging,
            title
        })
        setDataSource(prevDataSource => prevDataSource.concat(res.data.list))
        setTotal(res.data.all)
        setPaging(prevDataSource => {
            prevDataSource.size++
            return prevDataSource
        })
    }

    useEffect(() => {
        getBorrowedfetch()
    }, [title, paging])

    return (
        <Form
            layout='inline'
            onFinish={onSearch}
        >
            <Form.Item label="书名" name="title">
                <Input placeholder="请输入" allowClear />
            </Form.Item>
            <Form.Item>
                <Button type="primary" htmlType="submit">搜索</Button>
            </Form.Item>
        </Form>
    );
}

const Tables = ({ dataSource, total, setPaging }) => {

    const columns = [
        {
            title: '书名',
            dataIndex: 'title',
            key: 'title',
        },
        {
            title: '借书人',
            dataIndex: 'name',
            key: 'name',
        },
        {
            title: '借阅日期',
            dataIndex: 'borrow_date',
            key: 'borrow_date',
        },
        {
            title: '预计归还日期',
            dataIndex: 'return_date',
            key: 'return_date',
        },
        {
            title: '状态',
            dataIndex: 'status',
            key: 'status',
            render: (_, tags) => {
                console.log(tags)
                switch (tags.status) {
                    case 'borrowed':
                        return <Tag key={tags.key} color="gold">待归还</Tag>
                    case 'borrowedQ':
                        return <Tag key={tags.key}color="orange">借阅审核中</Tag>
                    case 'returned':
                        return <Tag key={tags.key} color="cyan">已归还</Tag>
                    case 'returnedQ':
                        return <Tag key={tags.key} color="green">归还审核中</Tag>

                }
            }
        },
        {
            title: '操作',
            key: '操作',
            render: (_, columns) => {
                console.log(columns)
                return <Button type="link" onClick={() => {
                    // props.changChosed(columns.key)
                    // props.setIsModalOpen(true)
                }}>借出</Button>
            }
        }
    ];

    const onPageChange = ({ current }) => {
        setPaging((prew) => {
            prew.page = current
            return { ...prew }
        })
    }


    return <Table dataSource={dataSource} columns={columns} pagination={{ total: total, pageSize: 10 }} onChange={onPageChange}
    />;
}

const BorrowedBooks = () => {
    const [paging, setPaging] = useState({
        size: 10,
        page: 1
    })
    const [total, setTotal] = useState(0)
    const [title, setTitle] = useState('')
    const [dataSource, setDataSource] = useState([])


    return (
        <>
            <SearchForm title={title} setTitle={setTitle} setDataSource={setDataSource} paging={paging} setPaging={setPaging} setTotal={setTotal} />
            <Divider />
            <Tables dataSource={dataSource} total={total} setPaging={setPaging} />
        </>
    )
}

export default BorrowedBooks