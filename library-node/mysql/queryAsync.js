const conn = require("./index")

// 使用 Promise 封装查询操作
function queryAsync(sql) {
    return new Promise((resolve, reject) => {
        conn.query(sql, (error, results) => {
            if (error) {
                reject(error);
            } else {
                resolve(results);
            }
        });
    });
}

//导出
module.exports = queryAsync;