const express = require('express');
const router = express.Router();
const conn = require('../../../../mysql/promiseSql')
const { body, query, validationResult } = require('express-validator');
const response = require("../../../../util/response");


// 获取所有类别
router.get('/allCategory', [
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
    const sqlAll = `SELECT COUNT(*) as 'all' FROM book_categories;`
    try {
        const [all] = await conn.query(sqlAll)
        console.log(all)
        resObj.all = all[0].all
    } catch (error) {
        console.log(error);
        response(error, res, '01')
        return
    }

    try {
        const sql = `SELECT * FROM book_categories LIMIT ${req.query.size} OFFSET ${req.query.page - 1};`
        const [sqlList] = await conn.query(sql)

        resObj.list = sqlList
        response(resObj, res)
    } catch (error) {
        console.log(error);
        response(error, res, '01')
        return
    }
})

// 图书新增
router.post('/addCategory', [
    body('category_name').notEmpty().withMessage('图书名称不能为空'),
], async function (req, res, next) {
    // 参数校验
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return response(errors.array(), res, '01')
    }

    const body = req.body
    const sql = `INSERT INTO book_categories (category_name, description) VALUES (?,?)`;

    try {
        await conn.query(sql, [body.category_name, body.description || ''])
        response({}, res)
    } catch (error) {
        console.log(error);
        response({}, res, '01')
        return
    }



});


// 删除
router.get('/delCategory', [
    query('category_id').notEmpty().withMessage('category_id不能为空'),
], async (req, res) => {
    // 参数校验
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return response(errors.array(), res, '01')
    }
    const sql = `DELETE FROM book_categories WHERE category_id = ${req.query.category_id};`
    try {
        const [result] = await conn.query(sql)
        if (result.affectedRows === 0) {
            return response('未找到图书', res, '01')
        }
        response({}, res)
    } catch (err) {
        if (err) {
            console.log(err);
            response(err, res, '01')
            return
        }
    }
})

// 更新书籍
router.post('/updateCategory', [
    body('category_id').notEmpty().withMessage('category_id不能为空'),
    body('category_name').notEmpty().withMessage('category_name不能为空'),
], async (req, res) => {
    // 参数校验
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return response(errors.array(), res, '01')
    }


    const body = req.body
    const sql = `UPDATE book_categories SET category_name = '${body.category_name}', description = '${body.description || ''}' WHERE category_id = ${body.category_id};`

    try {
        await conn.query(sql)
        response({}, res)
    } catch (err) {
        console.log(err);
        response(err, res, '01')
        return
    }
})


module.exports = router