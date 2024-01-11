function response(data, res, code) {
    switch (code) {
        case 400:
            res.status(code).send({
                code: '01',
                errors: data,
                msg: 'error'
            });
            break;
        case '01':
            res.send({
                code: '01',
                msg: data,
            })
            break;
        default:
            res.send({
                code: '00',
                data,
                msg: 'success'
            })

    }
}

module.exports = response