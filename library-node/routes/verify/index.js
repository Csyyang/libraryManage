const express = require('express');
const router = express.Router();
const conn = require('../../mysql/promiseSql')
const response = require("../../util/response");
const suadmin = require("./suadmin")
const admin = require("./admin")
const normal = require('./normal')

// 登录校验
router.use('/', (req, res, next) => {
    if (req.session.user) {
        next()
    } else {
        response('未登录', res, 400)
    }
})

// 普通路由
router.use('/', normal)
// 超级管理路由
router.use('/suadmin', suadmin)
// 管理员路由
router.use('/admin', admin)

module.exports = router