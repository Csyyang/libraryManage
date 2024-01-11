const express = require('express');
const router = express.Router();

const administrators = require('./administrators')


// 管理员
router.use('/administrators', administrators)

module.exports = router