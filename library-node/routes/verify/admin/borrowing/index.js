const express = require('express');
const router = express.Router();
const conn = require('../../../../mysql/promiseSql');
const queryAsync = require('../../../../mysql/queryAsync');
const { body, query, validationResult } = require('express-validator');
const response = require("../../../../util/response");

// 新增借阅记录
router.post('/addBorrowing', [
    body('reader_id').notEmpty().withMessage('读者ID不能为空'),
    body('book_id').notEmpty().withMessage('书籍ID不能为空'),
    body('borrow_date').notEmpty().withMessage('借阅日期不能为空'),
    body('status').notEmpty().withMessage('借阅状态不能为空'),
], function (req, res, next) {
    // 参数校验
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return response(errors.array(), res, '01')
    }

    const body = req.body
    const sql = `INSERT INTO borrowing (reader_id, book_id, borrow_date, status ) VALUES ('${body.reader_id}', '${body.book_id}', '${body.borrow_date}', '${body.status}')`;

    conn.query(sql, function (err, result) {
        if (err) {
            console.log(err);
            response({}, res, '01')
            return
        }
        response({}, res)
    })
});


// 删除
router.get('/delBorrowing', [
    query('borrowing_id').notEmpty().withMessage('borrowing_id不能为空'),
], (req, res) => {
    // 参数校验
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return response(errors.array(), res, '01')
    }
    const sql = `DELETE FROM borrowing WHERE borrowing_id = ${req.query.borrowing_id};`

    conn.query(sql, function (err, result) {
        console.log(result)
        if (err) {
            console.log(err);
            response(err, res, '01')
            return
        }
        if (result.affectedRows === 0) {
            return response('未找此用户', res, '01')
        }
        response({}, res)
    })
})

// 更新借阅记录
router.post('/upBorrowing', [
    body('borrowing_id').notEmpty().withMessage('borrowing_id不能为空'),
    // body('return_date').notEmpty().withMessage('归还日期不能为空'),
    body('status').notEmpty().withMessage('借阅状态不能为空'),
], (req, res) => {
    // 参数校验
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return response(errors.array(), res, '01')
    }


    const body = req.body
    const sql = `UPDATE borrowing SET status = '${body.status}',  return_date = '${body.return_date || null}' WHERE reader_id = ${body.borrowing_id};`
    conn.query(sql, function (err, result) {
        if (err) {
            console.log(err);
            response(err, res, '01')
            return
        }
        response({}, res)
    })
})

// 获取所有借阅记录
router.get('/allBorrowing', [
    query('size').isInt().withMessage('size格式错误'),
    query('page').isInt().withMessage('page格式错误'),
], async (req, res) => {
    // 参数校验
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return response(errors.array(), res, '01')
    }
    const resObj = {}

    // --获取总记录数
    const sqlAll = `SELECT COUNT(*) as 'all' FROM borrowing;`
    try {
        const all = await queryAsync(sqlAll)
        console.log(all)
        resObj.all = all[0].all
    } catch (error) {
        console.log(error);
        response(error, res, '01')
        return
    }

    try {
        const sql = `SELECT * FROM borrowing LIMIT ${req.query.size} OFFSET ${req.query.page - 1};`
        const sqlList = await queryAsync(sql)

        resObj.list = sqlList
        response(resObj, res)
    } catch (error) {
        console.log(error);
        response(error, res, '01')
        return
    }
})


module.exports = router