const express = require('express');
const router = express.Router();
const conn = require('../../../../mysql/promiseSql');
const { body, query, validationResult } = require('express-validator');
const response = require("../../../../util/response");

// 新增管理员
router.get('/addAdmin', [
    query('user_id').notEmpty().withMessage('user_id不能为空'),
], async function (req, res, next) {
    // 参数校验
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return response(errors.array(), res, '01')
    }

    const body = req.body
    const sql = `UPDATE users SET is_admin = 1 WHERE user_id = ${req.query.user_id};`

    try {
        await conn.query(sql)
        response({}, res)
    } catch (err) {
        console.log(err);
        response({}, res, '01')
        return
    }


});


// 删除管理员
router.get('/delAdmin', [
    query('user_id').notEmpty().withMessage('user_id不能为空'),
], async (req, res) => {
    // 参数校验
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return response(errors.array(), res, '01')
    }

    const sql = `UPDATE users SET is_admin = 0 WHERE user_id = ${req.query.user_id};`
    try {
        const [result] = await conn.query(sql)
        if (result.affectedRows === 0) {
            return response('未找此用户', res, '01')
        }
        response({}, res)
    } catch (error) {
        if (error) {
            console.log(err);
            response(err, res, '01')
            return
        }
    }
})

// 更新管理员
router.post('/upAdmin', [
    body('user_id').notEmpty().withMessage('admin_id不能为空'),
    body('first_name').notEmpty().withMessage('first_name不能为空'),
    body('last_name').notEmpty().withMessage('last_name不能为空'),
    body('username').notEmpty().withMessage('username不能为空'),
    body('password_hash').notEmpty().withMessage('password_hash不能为空'),
    body('is_admin').notEmpty().withMessage('is_admin不能为空'),
], async (req, res) => {
    // 参数校验
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return response(errors.array(), res, '01')
    }


    const body = req.body
    const sql = `UPDATE users SET first_name = '${body.first_name}', last_name = '${body.last_name}',  email = '${body.email || ''}' ,username = '${body.username}', password_hash = '${body.password_hash}', is_admin = '${body.is_admin}' WHERE user_id = ${body.user_id};`

    try {
        await conn.query(sql)

        response({}, res)
    } catch (error) {
        console.log(error);
        response(error, res, '01')
        return
    }
})

// 获取普通用户
router.get('/getUsers', [
    query('size').isInt().withMessage('size格式错误'),
    query('page').isInt().withMessage('page格式错误'),
], async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return response(errors.array(), res, '01')
    }

    try {
        const sql = `SELECT * FROM users WHERE is_admin = 0 LIMIT ${req.query.size} OFFSET ${req.query.page - 1};`
        const [sqlList] = await conn.query(sql)
        response(sqlList, res)
    } catch (error) {
        console.log(error);
        response(error, res, '01')
        return
    }
})

// 获取管理员
router.get('/allAdmins', [
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
    const sqlAll = `SELECT COUNT(*) as 'all' FROM users WHERE is_admin = 1;`
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
        const sql = `SELECT * FROM users WHERE is_admin = 1  LIMIT ${req.query.size} OFFSET ${req.query.page - 1};`
        const [sqlList] = await conn.query(sql)

        resObj.list = sqlList
        response(resObj, res)
    } catch (error) {
        console.log(error);
        response(error, res, '01')
        return
    }
})


module.exports = router