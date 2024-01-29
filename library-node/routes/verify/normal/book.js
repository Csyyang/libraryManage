const router = require('express').Router();
const response = require("../../../util/response");
const { body, query, validationResult } = require('express-validator');
const conn = require('../../../mysql/promiseSql')


// 查询图书列表
router.get('/allBook', [
    query('size').isInt().withMessage('size格式错误'),
    query('page').isInt().withMessage('page格式错误'),
], async (req, res) => {
    // 参数校验
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return response(errors.array(), res, '01')
    }
    const resObj = {}
    const title = req.query.title || ''

    // --获取总记录数
    const sqlAll = `SELECT COUNT(*) as 'all' FROM books ${title ? 'WHERE title LIKE ?' : ''};`
    try {
        const [result, _] = await conn.query(sqlAll, title ? [`%${title}%`] : [])
        // const all = await conn.query(sqlAll)
        console.log(result)
        resObj.all = result[0].all
    } catch (error) {
        console.log(error);
        response(error, res, '01')
        return
    }

    try {
        const sql = `
    SELECT books.book_id AS 'key', books.title, books.author,books.publisher, books.isbn, books.category_id, book_inventory.remaining, book_inventory.quantity,categories.category_name
    FROM books
    LEFT JOIN 
    book_inventory ON books.book_id = book_inventory.book_id
    LEFT JOIN
    book_categories AS categories ON books.category_id = categories.category_id
    ${title ? ' WHERE books.title LIKE ?' : ''}
    LIMIT ? OFFSET ?;`
        const page = req.query.page;
        const size = req.query.size;
        const [sqlList] = await conn.query(sql, title ? [`%${title}%`, parseInt(size), parseInt(page - 1)] : [parseInt(size), parseInt(page - 1)]);
        resObj.list = sqlList
        response(resObj, res)
    } catch (error) {
        console.log(error);
        response(error, res, '01')
        return
    }
})

// 预约借书
router.post('/borrowing', [
    body('book_id').notEmpty().withMessage('书籍ID不能为空'),
    body('borrow_date').isDate({
        format: 'YYYY/MM/DD',
        delimiters: ['/', '-'],
        strictMode: false
    }).withMessage('借阅日期不能为空'),
    body('return_date').isDate({
        format: 'YYYY/MM/DD',
        delimiters: ['/', '-'],
        strictMode: false
    }).withMessage('归还日期不能为空'),
], async (req, res, next) => {
    // 参数校验
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return response(errors.array(), res, '01')
    }

    const body = req.body
    const connection = await conn.getConnection();
    try {
        // 开始事务
        await connection.beginTransaction();

        // 获取锁并检查库存是否大于0
        const [rows] = await connection.query(`SELECT remaining FROM book_inventory WHERE book_id = ${body.book_id}  FOR UPDATE`);

        if (rows.length === 0) {
            await connection.rollback();
            throw new Error('未找到图书');
        }

        const remaining = rows[0].remaining;
        if (remaining <= 0) {
            // 提前终止事务并回滚
            await connection.rollback();
            throw new Error('库存不足，无法借阅');
        } else {
            // 如果库存大于0，则插入借阅记录并更新库存
            await connection.query(
                'INSERT INTO borrow_records (reader_id, book_id, borrow_date, return_date) VALUES (?, ?, ?, ?)',
                [req.session.user.reader_id, body.book_id, body.borrow_date, body.return_date]
            );

            await connection.query(
                `UPDATE book_inventory SET lend = lend + 1,remaining = quantity - lend  WHERE book_id =  ${body.book_id}`
            );
            response('预约成功', res)
        }
        // 提交事务
        await connection.commit();
    } catch (error) {
        console.log('error')
        console.log(error)
        // 出现错误时回滚事务
        await connection.rollback();
        response(error.toString(), res, '01')
    } finally {
        // 释放连接
        connection.release();
    }
});

// 预约还书
router.post('/returnedQ', [
    body('record_id').notEmpty().withMessage('record_id不能为空'),
], async (req, res, next) => {
    // 参数校验
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return response(errors.array(), res, '01')
    }

    const body = req.body
    const connection = await conn.getConnection();
    try {
        // 开始事务
        await connection.beginTransaction();

        await connection.query(
            `UPDATE borrow_records SET status = 'returnedQ' WHERE record_id =  ${body.record_id}`
        );

        // await connection.query(
        //     `UPDATE book_inventory SET lend = lend - 1,remaining = quantity - lend  WHERE book_id =  ${body.book_id}`
        // );
        response('归还预约成功', res)

        // 提交事务
        await connection.commit();
    } catch (error) {
        console.log('error')
        console.log(error)
        // 出现错误时回滚事务
        await connection.rollback();
        response(error.toString(), res, '01')
    } finally {
        // 释放连接
        connection.release();
    }
});

// 发起图书归还
router.post('/returnApply', [
    body('record_id').notEmpty().withMessage('参数异常')
], async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return response(errors.array(), res, '01')
    }


    const sql = `UPDATE borrow_records SET status = 'returnedQ' WHERE record_id = ?;`


    try {
        const [result] = await conn.query(sql, [req.body.record_id])
        console.log(result.affectedRows)

        if (result.affectedRows > 0) {
            response('发起成功', res)
        } else {
            response('参数异常', res, '01')
        }
    } catch (err) {
        console.log(err);
        response(err, res, '01')
        return
    }
})

// 查询个人借书记录
router.get('/personBorrowed', [
    query('size').isInt().withMessage('size格式错误'),
    query('page').isInt().withMessage('page格式错误'),
], async (req, res) => {
    // 参数校验
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return response(errors.array(), res, '01')
    }
    const resObj = {}
    const title = req.query.title || ''

    try {
        const sql = `SELECT borrow_records.record_id AS 'key', borrow_records.record_id, borrow_records.reader_id, borrow_records.book_id, 
        DATE_FORMAT(borrow_records.borrow_date, '%Y-%m-%d') AS borrow_date,
        DATE_FORMAT(borrow_records.return_date, '%Y-%m-%d') AS return_date,
        borrow_records.status,
        books.title, readers.name 
     FROM borrow_records
     JOIN books ON borrow_records.book_id = books.book_id
     JOIN readers ON borrow_records.reader_id = readers.reader_id
     ${title ? ' WHERE books.title LIKE ?' : ''}
     LIMIT ? OFFSET ?;`;
        const page = req.query.page;
        const size = req.query.size;
        const [sqlList] = await conn.query(sql, title ? [`%${title}%`, parseInt(size), parseInt(page - 1)] : [parseInt(size), parseInt(page - 1)]);
        resObj.list = sqlList
        response(resObj, res)
    } catch (error) {
        console.log(error);
        response(error, res, '01')
        return
    }
})

module.exports = router