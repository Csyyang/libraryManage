const express = require('express');
const router = express.Router();
const conn = require('../../../../mysql/promiseSql')
const { body, query, validationResult } = require('express-validator');
const response = require("../../../../util/response");
const multer = require('multer');
const exceljs = require('exceljs');
// 图书新增
// router.post('/addBook', [
//     body('title').notEmpty().withMessage('图书名称不能为空'),
//     body('author').notEmpty().withMessage('作者不能为空'),
//     body('publisher').notEmpty().withMessage('出版社不能为空'),
//     body('publication_date').notEmpty().isDate().withMessage('出版日期格式不正确'),
//     body('isbn').notEmpty().withMessage('国际标准书号不能为空'),
//     body('category_id').notEmpty().withMessage('图书分类不能为空'),
//     body('copies_available').notEmpty().withMessage('可接数量不能为空'),
//     body('copies_total').notEmpty().withMessage('图书总量不能为空'),
// ], async function (req, res, next) {
//     // 参数校验
//     const errors = validationResult(req);
//     if (!errors.isEmpty()) {
//         return response(errors.array(), res, '01')
//     }

//     const body = req.body
//     const sql = `INSERT INTO books (title, author, publisher, publication_date, isbn, category_id, copies_available, copies_total) VALUES (?,?,?,?,?,?,?,?)`;


//     try {
//         await conn.query(sql, [body.title, body.author, body.publisher, body.publication_date, body.isbn, body.category_id, body.copies_available, body.copies_total])
//         response({}, res)
//     } catch (error) {
//         console.log(error);
//         response({}, res, '01')
//         return
//     }



// });


// 删除
// router.get('/delBook', [
//     query('book_id').notEmpty().withMessage('book_id不能为空'),
// ], async (req, res) => {
//     // 参数校验
//     const errors = validationResult(req);
//     if (!errors.isEmpty()) {
//         return response(errors.array(), res, '01')
//     }
//     const sql = `DELETE FROM books WHERE book_id = ${req.query.book_id};`
//     try {
//         const [result] = await conn.query(sql)
//         if (result.affectedRows === 0) {
//             return response('未找到图书', res, '01')
//         }
//         response({}, res)
//     } catch (err) {
//         console.log(err);
//         response(err, res, '01')
//         return
//     }
// })

// 更新书籍
// router.post('/updateBook', [
//     body('title').notEmpty().withMessage('图书名称不能为空'),
//     body('author').notEmpty().withMessage('作者不能为空'),
//     body('publisher').notEmpty().withMessage('出版社不能为空'),
//     body('publication_date').notEmpty().isDate().withMessage('出版日期格式不正确'),
//     body('isbn').notEmpty().withMessage('国际标准书号不能为空'),
//     body('category_id').notEmpty().withMessage('图书分类不能为空'),
//     body('copies_available').notEmpty().withMessage('可接数量不能为空'),
//     body('copies_total').notEmpty().withMessage('图书总量不能为空'),
//     body('book_id').notEmpty().withMessage('book_id不能为空')
// ], async (req, res) => {
//     // 参数校验
//     const errors = validationResult(req);
//     if (!errors.isEmpty()) {
//         return response(errors.array(), res, '01')
//     }


//     const body = req.body
//     const sql = `UPDATE books SET title = '${body.title}', author = '${body.author}',publisher = '${body.publisher}', publication_date = '${body.publication_date}', isbn = '${body.isbn}',call_number = '${body.call_number || ''}', category_id = '${body.category_id}',
//     copies_available = '${body.copies_available}', copies_total = '${body.copies_total}' WHERE book_id = ${body.book_id};`

//     try {
//         await conn.query(sql)
//         response({}, res)
//     } catch (err) {
//         console.log(err);
//         response(err, res, '01')
//         return
//     }
// })

// 获取所有图书
// router.get('/allBook', [
//     query('size').isInt().withMessage('size格式错误'),
//     query('page').isInt().withMessage('page格式错误'),
// ], async (req, res) => {
//     // 参数校验
//     const errors = validationResult(req);
//     if (!errors.isEmpty()) {
//         return response(errors.array(), res, '01')
//     }
//     const resObj = {}

//     // --获取总记录数
//     const sqlAll = `SELECT COUNT(*) as 'all' FROM books;`
//     try {
//         const all = await conn.query(sqlAll)
//         console.log(all)
//         resObj.all = all[0].all
//     } catch (error) {
//         console.log(error);
//         response(error, res, '01')
//         return
//     }

//     try {
//         const sql = `SELECT books.*, DATE_FORMAT(publication_date, '%Y-%m-%d') AS publication_date, book_categories.category_name
//         FROM books
//         INNER JOIN book_categories ON books.category_id = book_categories.category_id
//         LIMIT ? OFFSET ?`
//         const page = req.query.page;
//         const size = req.query.size;
//         const [sqlList] = await conn.query(sql, [parseInt(size), parseInt(page - 1)]);
//         resObj.list = sqlList
//         response(resObj, res)
//     } catch (error) {
//         console.log(error);
//         response(error, res, '01')
//         return
//     }
// })

// 借用待确认列表
router.get('/borrowConfirmList', [
    query('size').isInt().withMessage('size格式错误'),
    query('page').isInt().withMessage('page格式错误'),
], async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return response(errors.array(), res, '01')
    }

    const obj = {
        lists: [],
        total: 0
    }

    try {
        const totalSql = `SELECT COUNT(*) as total FROM borrow_records WHERE borrow_records.status = 'borrowedQ'`
        const [result] = await conn.query(totalSql)

        obj.total = result[0].total
    } catch (error) {
        console.log(error);
        response(error, res, '01')
        return
    }

    const sql = `SELECT  borrow_records.record_id AS 'key',
    borrow_records.*,
    DATE_FORMAT(borrow_records.borrow_date, '%Y-%m-%d') AS borrow_date,
    DATE_FORMAT(borrow_records.return_date, '%Y-%m-%d') AS return_date,
    books.title, readers.name
    FROM borrow_records
    JOIN books ON borrow_records.book_id = books.book_id
    JOIN readers ON borrow_records.reader_id = readers.reader_id
    WHERE borrow_records.status = 'borrowedQ'
    LIMIT ? OFFSET ?;`
    try {
        const page = req.query.page;
        const size = req.query.size;

        const [result] = await conn.query(sql, [parseInt(size), parseInt(page - 1)])
        obj.lists = result

        response(obj, res)
    } catch (err) {
        console.log(err);
        response(err, res, '01')
        return
    }
})

// 归还待确认列表
router.get('/returnConfirmList', [
    query('size').isInt().withMessage('size格式错误'),
    query('page').isInt().withMessage('page格式错误'),
], async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return response(errors.array(), res, '01')
    }

    const obj = {
        total: 0,
        lists: []
    }
    try {
        const totalSql = `SELECT COUNT(*) as total FROM borrow_records WHERE borrow_records.status = 'borrowedQ'`
        const [result] = await conn.query(totalSql)

        obj.total = result[0].total
    } catch (error) {
        console.log(error);
        response(error, res, '01')
        return
    }

    const sql = `SELECT  borrow_records.record_id AS 'key',
    borrow_records.*,
    DATE_FORMAT(borrow_records.borrow_date, '%Y-%m-%d') AS borrow_date,
    DATE_FORMAT(borrow_records.return_date, '%Y-%m-%d') AS return_date,
    books.title, readers.name
    FROM borrow_records
    JOIN books ON borrow_records.book_id = books.book_id
    JOIN readers ON borrow_records.reader_id = readers.reader_id
    WHERE borrow_records.status = 'returnedQ'
    LIMIT ? OFFSET ?;`
    const page = req.query.page;
    const size = req.query.size;
    try {
        const [result] = await conn.query(sql, [parseInt(size), parseInt(page - 1)])
        obj.lists = result

        response(obj, res)
    } catch (err) {
        console.log(err);
        response(err, res, '01')
        return
    }
})

// 借用确认
router.post('/borrowConfirm', [
    body('record_id').notEmpty().withMessage('参数异常')
], async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return response(errors.array(), res, '01')
    }

    const sql = `UPDATE borrow_records SET status = 'borrowed' WHERE record_id = ?;`

    try {
        const [result] = await conn.query(sql, [req.body.record_id])
        console.log(result.affectedRows)

        if (result.affectedRows > 0) {
            response('借用开始生效', res)
        } else {
            response('参数异常', res, '01')
        }
    } catch (err) {
        console.log(err);
        response(err, res, '01')
        return
    }
})

// 借阅拒绝
router.post('/borrowRefuse', [
    body('record_id').notEmpty().withMessage('参数异常'),
    body('book_id').notEmpty().withMessage('参数异常')
], async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return response(errors.array(), res, '01')
    }

    const body = req.body
    const connection = await conn.getConnection();

    try {
        // 开始事务
        await connection.beginTransaction();

        console.log(body.record_id)

        const sql = `UPDATE borrow_records SET status = 'borrowRefuse' WHERE record_id = '${body.record_id}';`

        const [result] = await connection.query(sql);

        if (result.affectedRows === 0) {
            await connection.rollback();
            throw new Error('参数异常')
        }

        const [inventory] = await connection.query(
            `UPDATE book_inventory SET lend = lend - 1,remaining = quantity - lend  WHERE book_id =  ${body.book_id}`
        );

        if (inventory.affectedRows === 0) {
            await connection.rollback();
            throw new Error('update book_inventory fail')
        }

        response('归还成功', res)
        // 提交事务
        await connection.commit();
    } catch (error) {
        console.log('error')
        console.log(error)
        // 出现错误时回滚事务
        await connection.rollback();
        response(error.toString(), res, '01')
    } finally {
        // 释放连接
        connection.release();
    }
})

// 归还确认
router.post('/returnConfirm', [
    body('record_id').notEmpty().withMessage('参数异常'),
    body('book_id').notEmpty().withMessage('参数异常')
], async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return response(errors.array(), res, '01')
    }

    const body = req.body

    const connection = await conn.getConnection();

    try {
        // 开始事务
        await connection.beginTransaction();

        console.log(body.record_id)

        const sql = `UPDATE borrow_records SET status = 'returned' WHERE record_id = '${body.record_id}';`

        console.log(sql)
        const [result] = await connection.query(sql);

        if (result.affectedRows === 0) {
            await connection.rollback();
            throw new Error('参数异常')
        }

        const [inventory] = await connection.query(
            `UPDATE book_inventory SET lend = lend - 1,remaining = quantity - lend  WHERE book_id =  ${body.book_id}`
        );

        if (inventory.affectedRows === 0) {
            await connection.rollback();
            throw new Error('update book_inventory fail')
        }

        response('归还成功', res)
        // 提交事务
        await connection.commit();
    } catch (error) {
        console.log('error')
        console.log(error)
        // 出现错误时回滚事务
        await connection.rollback();
        response(error.toString(), res, '01')
    } finally {
        // 释放连接
        connection.release();
    }
})

// 归还拒绝
router.post('/returnRefuse', [
    body('record_id').notEmpty().withMessage('参数异常'),
    body('book_id').notEmpty().withMessage('参数异常')
], async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return response(errors.array(), res, '01')
    }

    const body = req.body
    const connection = await conn.getConnection();

    try {
        // 开始事务
        await connection.beginTransaction();

        console.log(body.record_id)

        const sql = `UPDATE borrow_records SET status = 'returnRefuse' WHERE record_id = '${body.record_id}';`

        const [result] = await connection.query(sql);

        if (result.affectedRows === 0) {
            await connection.rollback();
            throw new Error('参数异常')
        }

        const [inventory] = await connection.query(
            `UPDATE book_inventory SET lend = lend - 1,remaining = quantity - lend  WHERE book_id =  ${body.book_id}`
        );

        if (inventory.affectedRows === 0) {
            await connection.rollback();
            throw new Error('update book_inventory fail')
        }

        response('归还成功', res)
        // 提交事务
        await connection.commit();
    } catch (error) {
        console.log('error')
        console.log(error)
        // 出现错误时回滚事务
        await connection.rollback();
        response(error.toString(), res, '01')
    } finally {
        // 释放连接
        connection.release();
    }
})


// 设置 Multer 中间件，用于处理上传的文件
const storage = multer.memoryStorage(); // 保存文件到内存
const upload = multer({ storage: storage });

// 图书批量入库
router.post('/warehousing', upload.single('excelFile'), async (req, res) => {
    // 获取excl数据转json
    // 遍历每条json
    // 判断是否已近包含
    // 1. 包含直接查找相关库存库并增加
    // 2. 未包含判断是否有类别，创建类型别，创建库存行。
    try {
        // 从内存中读取上传的Excel文件
        const excelBuffer = req.file.buffer;

        // 使用 ExcelJS 解析 Excel 文件
        const workbook = new exceljs.Workbook();
        workbook.xlsx.load(excelBuffer).then(async () => {
            const result = [];

            // 遍历每个工作表
            workbook.eachSheet(sheet => {
                const sheetData = [];
                // 遍历每行数据
                sheet.eachRow(row => {
                    const rowData = [];
                    // 遍历每个单元格
                    row.eachCell(cell => {
                        rowData.push(cell.value);
                    });
                    sheetData.push(rowData);
                });
                result.push({ sheetName: sheet.name, data: sheetData.slice(1) });
            });
            const connection = await conn.getConnection();
            try {
                for (let item of result[0].data) {
                    console.log(item)
                    const sql = `SELECT * FROM books WHERE isbn = ?`
                    const [sqlRes] = await conn.query(sql, [item[0]])
                    // response(result, res)

                    if (sqlRes.length > 0) {
                        await conn.query(`UPDATE book_inventory SET quantity = quantity + ?,remaining = remaining + ?  WHERE book_id = ?;`, [item[5], item[5], sqlRes[0].book_id])
                    } else {
                        // 设置新的 book 信息
                        const newTitle = item[1];
                        const newAuthor = item[2];
                        const newPublisher = item[4];
                        const newIsbn = item[0];
                        const newCategoryName = item[3];

                        // 判断是否存在对应的 category_name
                        const [rows] = await connection.execute('SELECT category_id FROM book_categories WHERE category_name = ?', [newCategoryName]);
                        let categoryId = rows.length > 0 ? rows[0].category_id : null;

                        // 如果不存在，创建新的 book_categories 记录
                        if (!categoryId) {
                            const [insertResult] = await connection.execute('INSERT INTO book_categories (category_name) VALUES (?)', [newCategoryName]);
                            categoryId = insertResult.insertId;
                        }

                        // 插入新的记录到 books 表
                        const [booksResult] = await connection.execute('INSERT INTO books (title, author, publisher, isbn, category_id) VALUES (?, ?, ?, ?, ?)', [newTitle, newAuthor, newPublisher, newIsbn, categoryId]);
                        console.log(booksResult)
                        book_id = booksResult.insertId
                        console.log(book_id)
                        await connection.execute('INSERT INTO book_inventory (book_id,quantity, lend, remaining) VALUES (?, ?, ?, ?)', [book_id, item[5], 0, item[5]]);
                        // 提交事务
                        await connection.commit();

                        console.log('New book inserted successfully!');
                    }
                }

                return response('更新成功', res)

            } catch (err) {
                console.log('error')
                console.log(err)
                // 出现错误时回滚事务
                await connection.rollback();
                response(err.toString(), res, '01')
            } finally {
                // 释放连接
                connection.release();
            }
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
})


// 编辑单条库存
router.post('/editItem', [
    body('book_id').notEmpty().withMessage('参数异常'),
    body('quantity').notEmpty().withMessage('参数异常')
], async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return response(errors.array(), res, '01')
    }

    const body = req.body
    const connection = await conn.getConnection();

    try {
        await connection.execute('UPDATE book_inventory SET quantity = ?,remaining = quantity - lend WHERE book_id = ?', [body.quantity, body.book_id]);

        response('修改成功', res)
    } catch (error) {
        console.log(error)
        response({}, res, '01')
        return
    }
})

// // 入库模板下载
// router.get('/dowdload', async(req,res) => {

// })

module.exports = router