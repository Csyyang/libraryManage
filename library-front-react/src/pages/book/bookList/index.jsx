
import { useState } from 'react';
import { Button, Form, Input, Table, Divider, Modal, DatePicker, message } from 'antd';
import { getBookList, borrowing } from '@/api/book'
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
            title: '库存',
            dataIndex: 'remaining',
            key: 'remaining',
        },
        {
            title: '操作',
            key: '操作',
            render: (_, columns) => {
                return <Button type="link" onClick={() => {
                    props.changChosed(columns.key)
                    props.setIsModalOpen(true)
                }}>借出</Button>
            }
        }
    ];


    return <Table dataSource={dataSource} columns={columns} pagination={{ total: total, pageSize: 10 }} onChange={props.onPageChange}
    />;
}
// model 
const SendModal = ({ isModalOpen, setIsModalOpen, chosed, init }) => {
    const [form] = Form.useForm();

    const handleOk = async () => {
        const { borrow_date, return_date } = form.getFieldsValue();

        await borrowing({
            book_id: chosed,
            borrow_date: borrow_date.format('YYYY-MM-DD'),
            return_date: return_date.format('YYYY-MM-DD')
        })

        message.success('预约成功，请等待审核')
        setIsModalOpen(false)
        form.resetFields()
        init()
    }

    const handleCancel = () => {
        setIsModalOpen(false)
    }

    const onFinish = (values) => {
        console.log('Success:', values);
    };
    const onFinishFailed = (errorInfo) => {
        console.log('Failed:', errorInfo);
    };


    return (
        <Modal title="Basic Modal" open={isModalOpen} onOk={handleOk} onCancel={handleCancel}>
            <Form
                form={form}
                name="basic"
                labelCol={{
                    span: 8,
                }}
                wrapperCol={{
                    span: 16,
                }}
                style={{
                    maxWidth: 600,
                }}
                initialValues={{
                    remember: true,
                }}
                onFinish={onFinish}
                onFinishFailed={onFinishFailed}
                autoComplete="off"
            >
                <Form.Item
                    label="借阅日期"
                    name="borrow_date"
                    rules={[
                        {
                            required: true,
                            message: '请选择',
                        },
                    ]}
                >
                    <DatePicker allowClear format="YYYY-MM-DD" />
                </Form.Item>

                <Form.Item
                    label="归还日期"
                    name="return_date"
                    rules={[
                        {
                            required: true,
                            message: '请选择',
                        },
                    ]}
                >
                    <DatePicker allowClear />
                </Form.Item>
            </Form>
        </Modal>)
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

    const [isModalOpen, setIsModalOpen] = useState(false)

    const [chosed, changChosed] = useState(null)


    return (
        <>
            <SearchForm form={form} onSearch={onSearch} />
            <Divider />
            <Tables dataSource={dataSource} total={total} onPageChange={changePageSize} setIsModalOpen={setIsModalOpen} changChosed={changChosed} />
            <SendModal isModalOpen={isModalOpen} setIsModalOpen={setIsModalOpen} chosed={chosed} init={init} />
        </>
    )
}


export default BookList