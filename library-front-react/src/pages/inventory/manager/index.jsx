import { Button, Modal, Steps, Upload, message, Table, Form, Input } from 'antd'
import styles from './index.module.css'
import { downLoadExcl, uploadExcl, getBookList, editItem } from '@/api/book'
import { useEffect, useCallback, useState } from 'react'

// 批量导入
const BatchImport = ({ isModalOpen, setIsModalOpen, initSearch }) => {

    const [step, setStep] = useState(0)

    const handleOk = () => {
        if (step === 0) {
            setStep(prew => ++prew)
        } else {
            upload()
        }
        // setIsModalOpen(false);
    };

    const handleCancel = () => {
        setStep(0)
        setIsModalOpen(false);
    };

    const [fileList, setFileList] = useState([]);
    const props = {
        onRemove: (file) => {
            const index = fileList.indexOf(file);
            const newFileList = fileList.slice();
            newFileList.splice(index, 1);
            setFileList(newFileList);
        },
        beforeUpload: (file) => {
            setFileList([...fileList, file]);
            return false;
        },
        fileList,
    };

    const down = async () => {
        if (step === 0) {
            const response = await downLoadExcl()

            const blob = new Blob([response], { type: response.type });
            const link = document.createElement('a');
            link.href = window.URL.createObjectURL(blob);
            link.download = 'excelFile.xlsx';
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
        }
    }

    const upload = async () => {
        const formData = new FormData()
        formData.append('excelFile', fileList[0]);
        await uploadExcl(formData)
        initSearch()
        message.success('上传成功')
        setIsModalOpen(false)
        setStep(0)
        setFileList([])
    }

    return (
        <Modal title={step === 0 ? '下载模板' : '上传Excel'} open={isModalOpen} onOk={handleOk} onCancel={handleCancel} okText={step === 0 ? '已下载，下一步' : '上传'}>
            <Steps
                current={step}
                items={[
                    {
                        title: '第一步',
                        description: '下载模板',
                    },
                    {
                        title: '第二步',
                        description: '上传Excel',
                    }
                ]}
            />

            <div className={styles.downLoad} onClick={down}>
                {step === 0 ? <span >点击此处下载模板</span> : <Upload {...props}>选择文件</Upload>}
            </div>

        </Modal>
    )
}


//
const Tables = ({ paging, setPaging, dataSource, setDataSource, total, setTotal, setInitialValues, setOpen }) => {

    const edit = useCallback((val) => {
        setInitialValues(val)
        setOpen(true)
    })


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
            dataIndex: 'quantity',
            key: 'quantity',
        },
        {
            title: '操作',
            key: '操作',
            render: (_, columns) => {
                return <Button type="link" onClick={() => {
                    edit(columns)
                }}>编辑</Button>
            }
        }
    ];

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
        getTableListFetch({}, paging)
    }, [paging])

    const onPageChange = (current) => {
        setPaging((prew) => {
            prew.page = current
            return { ...prew }
        })
    }

    return <Table dataSource={dataSource} columns={columns} pagination={{ total: total, pageSize: 10 }} onChange={onPageChange}
    />;
}


// 编辑
const EditItem = ({ open, setOpen, initialValues, initSearch }) => {

    const [form] = Form.useForm();
    const handleOk = () => {
        const obj = form.getFieldsValue()
        obj.book_id = initialValues.key
        editItem(obj)
        message.success('修改成功')
        initSearch()
        setOpen(false)
    }

    const handleCancel = () => {
        setOpen(false)
    }

    return (
        <Modal title="编辑" open={open} onOk={handleOk} onCancel={handleCancel}>
            <Form
                form={form}
                initialValues={initialValues}
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
                autoComplete="off"
            >
                <Form.Item
                    label="ISBN"
                    name="isbn"
                    rules={[
                        {
                            required: true,
                            message: 'Please input your username!',
                        },
                    ]}
                >
                    <Input disabled />
                </Form.Item>

                <Form.Item
                    label="书名"
                    name="title"
                    rules={[
                        {
                            required: true,
                            message: 'Please input your password!',
                        },
                    ]}
                >
                    <Input disabled />
                </Form.Item>

                <Form.Item
                    label="出版社"
                    name="publisher"
                    rules={[
                        {
                            required: true,
                            message: 'Please input your password!',
                        },
                    ]}
                >
                    <Input disabled />
                </Form.Item>

                <Form.Item
                    label="类别"
                    name="category_name"
                    rules={[
                        {
                            required: true,
                            message: 'Please input your password!',
                        },
                    ]}
                >
                    <Input disabled />
                </Form.Item>

                <Form.Item
                    label="库存"
                    name="quantity"
                    rules={[
                        {
                            required: true,
                            message: 'Please input your password!',
                        },
                    ]}
                >
                    <Input />
                </Form.Item>
            </Form>
        </Modal>
    )
}


const Manage = () => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [open, setOpen] = useState(false);


    const [dataSource, setDataSource] = useState([])
    const [total, setTotal] = useState(0)
    const [paging, setPaging] = useState({
        size: 10,
        page: 1
    })


    const showModal = () => {
        setIsModalOpen(true);
    };

    const initSearch = () => {
        setDataSource([])
        setTotal(0)
        setPaging({
            size: 10,
            page: 1
        })
    }

    const [initialValues, setInitialValues] = useState({})

    const props = {
        paging,
        setPaging,
        dataSource,
        setDataSource,
        total,
        setTotal,
        setInitialValues,
        setOpen
    }

    const editProps = {
        open,
        setOpen,
        initialValues,
        initSearch
    }

    return (
        <div>
            <Button className={styles.marR} type="primary" onClick={showModal}>批量导入</Button>
            <Tables {...props} />

            <BatchImport isModalOpen={isModalOpen} setIsModalOpen={setIsModalOpen} initSearch={initSearch}></BatchImport>
            <EditItem {...editProps} />
        </div>
    )
}

export default Manage