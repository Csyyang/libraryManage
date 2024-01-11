const express = require('express');
const router = express.Router();
const conn = require('../../../../mysql/promiseSql');
const queryAsync = require('../../../../mysql/queryAsync');
const { body, query, validationResult } = require('express-validator');
const response = require("../../../../util/response");

// 读者新增
router.post('/addReader', [
    body('name').notEmpty().withMessage('姓名不能为空'),
    body('phone').notEmpty().withMessage('手机号不能为空'),
    body('address').notEmpty().withMessage('地址不能为空'),
    body('email').notEmpty().withMessage('email不能为空'),
    body('join_date').notEmpty().isDate().withMessage('创建日期不能为空'),
], function (req, res, next) {
    // 参数校验
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return response(errors.array(), res, '01')
    }

    const body = req.body
    const sql = `INSERT INTO reader (name, email, phone, address, join_date ) VALUES ('${body.name}', '${body.email}', '${body.phone}', '${body.address}', '${body.join_date}')`;

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
router.get('/delReader', [
    query('reader_id').notEmpty().withMessage('reader_id不能为空'),
], (req, res) => {
    // 参数校验
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return response(errors.array(), res, '01')
    }
    const sql = `DELETE FROM reader WHERE reader_id = ${req.query.reader_id};`

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

// 更新读者信息
router.post('/upReader', [
    body('reader_id').notEmpty().withMessage('reader_id不能为空'),
    body('name').notEmpty().withMessage('姓名不能为空'),
    body('phone').notEmpty().withMessage('手机号不能为空'),
    body('address').notEmpty().withMessage('地址不能为空'),
    body('email').notEmpty().withMessage('email不能为空'),
    body('join_date').notEmpty().isDate().withMessage('创建日期不能为空'),
], (req, res) => {
    // 参数校验
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return response(errors.array(), res, '01')
    }


    const body = req.body
    const sql = `UPDATE reader SET name = '${body.name}', phone = '${body.phone}',address = '${body.address}', email = '${body.email}',
    join_date = '${body.join_date}' WHERE reader_id = ${body.reader_id};`
    conn.query(sql, function (err, result) {
        if (err) {
            console.log(err);
            response(err, res, '01')
            return
        }
        response({}, res)
    })
})

// 获取所有图书
router.get('/allReader', [
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
    const sqlAll = `SELECT COUNT(*) as 'all' FROM reader;`
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
        const sql = `SELECT *,DATE_FORMAT(join_date, '%Y-%m-%d') AS join_date FROM reader LIMIT ${req.query.size} OFFSET ${req.query.page - 1};`
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