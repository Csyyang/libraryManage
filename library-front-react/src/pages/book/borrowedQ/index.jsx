import { borrowRecordQ, borrowConfirm, borrowRefuse } from "@/api/book"
import { useState } from "react"
import { useEffect } from "react"
import { Table, Button, message } from 'antd'


const BorrowedQ = () => {
    const [list, setList] = useState([])
    const [page, setPage] = useState({
        total: 0,
        size: 10,
        page: 1
    })
    const onPageChange = () => {
        setPage((prev) => {
            const obj = {
                ...prev
            }
            obj.page++

            return obj
        })
    }

    const getList = async () => {
        const res = await borrowRecordQ(page)
        setList(res.data.lists)
    }

    const aggre = async ({ record_id }) => {
        console.log(columns)
        await borrowConfirm({
            record_id
        })
        message.success('操作成功')

        setPage({
            total: 0,
            size: 10,
            page: 1
        })

    }


    const refuse = async ({ record_id, book_id }) => {
        await borrowRefuse({
            record_id,
            book_id
        })

        message.success('操作成功')

        setPage({
            total: 0,
            size: 10,
            page: 1
        })
    }

    const columns = [
        {
            title: '书名',
            dataIndex: 'title',
            key: 'title',
        },
        {
            title: '借阅者',
            dataIndex: 'name',
            key: 'name',
        },
        {
            title: '预计借阅日期',
            dataIndex: 'borrow_date',
            key: 'borrow_date',
        },
        {
            title: '预计归还日期',
            dataIndex: 'return_date',
            key: 'return_date',
        },
        {
            title: '操作',
            key: '操作',
            render: (_, columns) => {
                return (
                    <div>
                        <Button type="link" onClick={() => aggre(columns)}>同意</Button>
                        <Button type="link" onClick={() => refuse(columns)}>拒绝</Button>
                    </div>
                )
            }
        }
    ]

    useEffect(() => {
        getList()
    }, [page])

    return (
        <Table dataSource={list} columns={columns} pagination={{ total: page.total, pageSize: page.size }} onChange={onPageChange} />
    )
}

export default BorrowedQ