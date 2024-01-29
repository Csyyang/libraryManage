const express = require('express');
const router = express.Router();
const conn = require('../../../mysql/index')

const book = require('./book')
const reader = require('./reader')
const category = require('./category')
const response = require("../../../util/response")
const { query, validationResult } = require('express-validator');
const path = require('path')
const fs = require('fs').promises;



router.use('/', (req, res, next) => {
    if (!req.session.user.isAdmin) {
        return response('权限不足', res, '01')
    }

    next()
})

// 书籍管理
router.use('/book', book)

// 读者管理
router.use('/reader', reader)


router.use('/category', category)


// 下载模板
router.get('/downLoadExcl', [
    query('type').notEmpty().withMessage('参数错误')
], async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return response(errors.array(), res, '01')
    }

    if (req.query.type === 'book') {
        const filePath = path.join(__dirname, '../../../public/excel/excleTemplate.xlsx');

        // 读取 Excel 文件内容
        const excelBuffer = await fs.readFile(filePath);

        // 设置响应头，告诉浏览器返回的是 Excel 文件
        res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
        res.setHeader('Content-Disposition', 'attachment; filename=downloaded-file.xlsx');

        // 发送 Excel 文件内容
        res.send(excelBuffer);
    } else {
        res.end()
    }
})

module.exports = router