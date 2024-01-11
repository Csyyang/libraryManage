const express = require('express');
const router = express.Router();
const conn = require('../../mysql/promiseSql');

const { body, validationResult } = require('express-validator');
const response = require("../../util/response");

// 读者登录
router.post('/login', [
    // 使用express-validator中间件来验证参数
    body('id_card_number').notEmpty().withMessage('账号不能为空'),
    body('password').notEmpty().withMessage('密码不能为空'),
], async (req, res,) => {
    // 参数校验
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return response(errors.array(), res, '01')
    }
    const sql = `SELECT * FROM readers WHERE id_card_number = '${req.body.id_card_number}' AND password = '${req.body.password}';`
    try {
        const [result, _] = await conn.query(sql)
        if (!(result?.length)) {
            response('账号或密码错误', res, '01')
        } else {
            const user = result[0]
            // 判断当前账号是否冻结
            if (user.status === 'frozen') {
                response('当前账号被冻结，请咨询管理员', res, '01')
            } else if (user.isDelete === '1') {
                response('当前账号已删除', res, '01')
            }
            else {
                req.session.user = user
                response(user, res)
            }
        }
    } catch (error) {
        console.log(error);
        return response(error, res, '01')
    }
})

// 管理员登录
router.post('/AdmLogin', [
    body('username').notEmpty().withMessage('账号不能为空'),
    body('password').notEmpty().withMessage('密码不能为空'),
], async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return response(errors.array(), res, '01')
    }

    // 查询是否有此账号
    const sql = `SELECT * FROM administrators WHERE username = '${req.body.username}' AND password = '${req.body.password}';`

    try {
        const [result, _] = await conn.query(sql)
        if (!(result?.length)) {
            response('账号或密码错误', res, '01')
        } else {
            const user = result[0]
            console.log(user)
            req.session.user = user
            req.session.user.isAdmin = true
            response(user, res)
        }
    } catch (error) {
        console.log(error);
        return response(error, res, '01')
    }
})

// 注册

router.post('/register', [
    // 使用express-validator中间件来验证参数
    body('username').notEmpty().withMessage('账号不能为空'),
    body('password_hash').notEmpty().withMessage('密码不能为空'),
    body('first_name').notEmpty().withMessage('姓氏不能为空'),
    body('last_name').notEmpty().withMessage('姓名不能为空'),
], async (req, res,) => {
    // 参数校验
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return response(errors.array(), res, 400)
    }

    const body = req.body
    const sql = `SELECT * FROM users WHERE username = '${body.username}'`
    try {
        const result = await conn.query(sql)
        if (result?.length) {

        } else {
            response('当前账号已注册', res, '01')

        }
    } catch (error) {
        console.log(error);
        return response(error, res, '01')
    }

    const insertSql = 'INSERT INTO users (first_name, last_name, email, username, password_hash, is_admin) VALUES (?, ?, ?, ?, ?, ?)'


    try {
        await conn.query(insertSql, [body.first_name, body.last_name, body.email, body.username, body.password_hash, body.is_admin || 0])
        response('注册成功', res)
    } catch (error) {
        console.log(error);
        return response(error, res, '01')
    }
})

module.exports = router;
