let express = require('express');
let router = express.Router();

const mysql = require('mysql');
const db = require(__DBdir);

let conn;
/* GET home page. */
router.get('/', function(req, res, next) {
  if (req.isAuthenticated()) {
    // logined
    res.redirect('/path/manage/');
  } else {
    // not logined
    res.redirect('/');
  }
});

router.get('/manage', (req, res, next) => {
  if (req.isAuthenticated()) {
    let path_list;

    db.getConnection()
    .then((connection) => {
      conn = connection;

      let sql = `
        SELECT
          *
        FROM T_PATH
      `;

      return conn.query(sql);
    })
    .then((sql_result) => {
      path_list = sql_result;

      res.render('path_manage', {
        'session': req.user,
        'pageType': 10,
        'data': {
          'pathList': path_list
        }
      });
    });

  } else {
    res.redirect('/');
  }
});

module.exports = router;
