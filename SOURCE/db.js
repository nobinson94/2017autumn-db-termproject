var mysql = require('promise-mysql');
var pool = mysql.createPool({
    connectionLimit: 1000,
    host: '124.5.206.45',
    user: 'root',
    database: 'CCTV_MANAGER',
    password: 'dlsMySQLPw0322^~^'
});

module.exports = pool;
