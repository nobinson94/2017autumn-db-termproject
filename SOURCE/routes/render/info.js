let express = require('express');
const passport = require('passport');

let router = express.Router();

const mysql = require('mysql');
const db = require(__DBdir);

let conn;
router.get('/', function(req, res, next) {
  if (req.isAuthenticated()) {
    // logined
    res.redirect('/info/show/');
  } else {
    // not logined
    res.redirect('/');
  }
});

router.get('/show/',(req,res,next)=>{
	if(req.isAuthenticated()) {
		db.getConnection()
		.then((connection)=>{
			let sql = `
				SELECT * FROM T_ADMINISTRATOR WHERE n_ADMIN_ID = ${req.user.USER_INDEX}
				`;
			return connection.query(sql);

		}).then((sql_result)=>{
			userData = sql_result;
			res.render('info_show', {
				'session': req.user,
				'user_data': userData,
				'pageType': 8
    		});
		});
	} else {
		res.redirect('/');
	}
});
router.get('/manage/',(req,res,next)=>{

	if(req.isAuthenticated() && req.user.CHECKPW) {
		db.getConnection()
		.then((connection)=>{
			let sql = `
				SELECT * FROM T_ADMINISTRATOR WHERE n_ADMIN_ID = ${req.user.USER_INDEX}
				`;
			return connection.query(sql);

		}).then((sql_result)=>{
			userData = sql_result;
			res.render('info_manage', {
				'session': req.user,
				'user_data': userData,
				'pageType': 8
    		});
		});
		req.user.CHECKPW = 0;
	} else {
		res.redirect('/');
	}
});


module.exports = router;
