const express = require('express');
const mysql = require('mysql');
const crypto = require('crypto');
const passport = require('passport');

let router = express.Router();

let db = require(__DBdir);
let conn;

router.post('/check', (req, res, next) => {
	let post_data = req.body;
	let admin_id = post_data['admin_id'];	

	db.getConnection()
  	.then((connection) => {
    conn = connection;

    let sql = `
    	SELECT v_SALT, v_PASSWORD
    	FROM T_ADMINISTRATOR 
    	WHERE n_ADMIN_ID = ${admin_id}
    `;

    return conn.query(sql);
	})
	.then((sql_result) => {
	
	let salt = sql_result[0]['v_SALT'];
	let userHashpass = crypto.createHash("sha512").update(post_data['checkedPw'] + salt).digest("hex").toString();
	if(userHashpass == sql_result[0]['v_PASSWORD']) {
		req.user.CHECKPW = 1;
		res.send('1');  
	} else {
		res.send('0'); 
	}

  	});
});

router.post('/change', (req, res, next) => {
	let post_data = req.body;
	let new_name = post_data['new_user_name'];
	let new_phoneNum = post_data['new_user_phoneNum'];
	let admin_id = post_data['admin_id'];

	db.getConnection()
	.then((connection) => {
		conn = connection;
		let sql = `
			UPDATE T_ADMINISTRATOR
			SET v_NAME= ${mysql.escape(new_name)}, v_PHONE_NUMBER= ${mysql.escape(new_phoneNum)}
			WHERE n_ADMIN_ID = ${mysql.escape(admin_id)}
			`;


		return conn.query(sql, (error, results, fields) => {
			
      		if (error) res.send(`${error.errno}`);
	     	db.releaseConnection(conn);
	     	req.user.USER_NAME = new_name;
    	  	res.send('0');
		});
	});
});

module.exports = router;
