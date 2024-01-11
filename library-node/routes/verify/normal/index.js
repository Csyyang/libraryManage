const router = require('express').Router();
const response = require("../../../util/response");
const book = require('./book')

// 登出
router.get('/logout', function (req, res, next) {
    req.session.destroy((err) => {
        if (err) {
            console.error(err);
            res.end(err)
        } else {
            response({}, res)
        }
    });
});
router.use('/book', book)

module.exports = router