
import { useState } from 'react';
import { Button, Form, Input, Table, Divider } from 'antd';
import { getBookList } from '@/api/book'
import { useEffect, useCallback } from 'react';

// 搜索表单
const SearchForm = (props) => {
    const form = props.form
    const [formLayout] = useState('inline');
    const onSearch = props.onSearch

    const formItemLayout =
        formLayout === 'horizontal'
            ? {
                labelCol: {
                    span: 4,
                },
                wrapperCol: {
                    span: 14,
                },
            }
            : null;
    const buttonItemLayout =
        formLayout === 'horizontal'
            ? {
                wrapperCol: {
                    span: 14,
                    offset: 4,
                },
            }
            : null;
    return (
        <Form
            {...formItemLayout}
            layout={formLayout}
            form={form}
            initialValues={{
                layout: formLayout,
            }}
            onFinish={onSearch}
            style={{
                maxWidth: formLayout === 'inline' ? 'none' : 600,
            }}
        >
            <Form.Item label="书名" name="title">
                <Input placeholder="请输入" allowClear />
            </Form.Item>
            <Form.Item {...buttonItemLayout}>
                <Button type="primary" htmlType="submit">搜索</Button>
            </Form.Item>
        </Form>
    );
};



// table
const Tables = (props) => {

    // const getFormList

    const dataSource = props.dataSource
    const total = props.total

    const columns = [
        {
            title: 'isbn',
            dataIndex: 'isbn',
            key: 'isbn',
        },
        {
            title: '书名',
            dataIndex: 'title',
            key: 'title',
        },
        {
            title: '类目',
            dataIndex: 'category_name',
            key: 'category_name',
        },
        {
            title: '作者类目',
            dataIndex: 'author',
            key: 'author',
        },
        {
            title: '出版社',
            dataIndex: 'publisher',
            key: 'publisher',
        },
        {
            title: '操作',
            key: '操作',
            render: (_, record) => {
                return <Button type="link">Link Button</Button>
            }
        }
    ];


    return <Table dataSource={dataSource} columns={columns} pagination={{ total: total, pageSize: 10 }} onChange={props.onPageChange}
    />;
}

const BookList = () => {
    const [form] = Form.useForm();
    const onSearch = () => {
        init()
    };

    const init = () => {
        setPaging({
            size: 10,
            page: 1
        })

        setDataSource([])
    }


    const [dataSource, setDataSource] = useState([])
    const [paging, setPaging] = useState({
        size: 10,
        page: 1
    })
    const [total, setTotal] = useState(0)
    const changePageSize = ({ current }) => {
        setPaging((prew) => {
            prew.page = current
            return { ...prew }
        })
    }

    const getTableListFetch = useCallback(async (form, paging) => {
        const res = await getBookList(Object.assign({}, form, paging))
        setDataSource(prevDataSource => prevDataSource.concat(res.data.list))
        setTotal(res.data.all)
        setPaging(prevDataSource => {
            prevDataSource.size++
            return prevDataSource
        })
    }, [])

    useEffect(() => {
        getTableListFetch(form.getFieldsValue(), paging)
    }, [paging])

    return (
        <>
            <SearchForm form={form} onSearch={onSearch} />
            <Divider />
            <Tables dataSource={dataSource} total={total} onPageChange={changePageSize} />
        </>
    )
}


export default BookList