import { borrowRecordQ } from "@/api/book"
import { useState } from "react"
import { useEffect } from "react"
import { Table } from 'antd'


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
    ]


    useEffect(() => {
        getList()
    }, [])

    return (
        <Table dataSource={list} columns={columns} pagination={{ total: page.total, pageSize: page.size }} onChange={onPageChange} />
    )
}

export default BorrowedQ