const mysql = require('mysql2/promise');


// 创建连接池，设置连接池的参数
const pool = mysql.createPool({
    host: 'localhost',
    user: 'root',
    password: 'root',
    database: 'library',
    connectionLimit: 10, // 连接池中的最大连接数
});

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

module.exports = pool;