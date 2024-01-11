const mysql = require('mysql');

const sqlConfig = {
    host: 'localhost',
    user: 'root',
    password: 'root',
    database: 'library',
    connectionLimit: 10, // 连接池中的最大连接数
}

const pool = mysql.createPool(sqlConfig);


pool.on('acquire', (connection) => {
    console.log('连接 %d 获取', connection.threadId);
});

pool.on('enqueue', () => {
    console.log('查询进入等待队列');
});


pool.on('connection', (connection) => {
    console.log('新连接创建');
});


pool.on('release', (connection) => {
    console.log('连接 %d 被释放', connection.threadId);
});

// let conn
// function handleDisconnect() {
//     conn = mysql.createConnection(sqlConfig)
//     // 连接数据库
//     conn.connect(function (err) {
//         if (err) { console.log("连接失败") };
//         console.log("连接成功,当前连接线程ID" + conn.threadId);
//     })

//     conn.on('error', function (err) {
//         console.log('db error', err);
//         if (err.code === 'PROTOCOL_CONNECTION_LOST') { // Connection to the MySQL server is usually
//             handleDisconnect();                         // lost due to either server restart, or a
//         } else {                                      // connnection idle timeout (the wait_timeout
//             throw err;                                  // server variable configures this)
//         }
//     });
// }

// handleDisconnect();


//导出
module.exports = pool;