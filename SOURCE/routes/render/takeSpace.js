let express = require('express');
let router = express.Router();

const mysql = require('mysql');
const db = require(__DBdir);

let conn;
/* GET home page. */
router.get('/', function(req, res, next) {
  if (req.isAuthenticated()) {
    // logined
    res.redirect('/takeSpace/manage/');
  } else {
    // not logined
    res.redirect('/');
  }
});

router.get('/manage', (req, res, next) => {
  if (req.isAuthenticated()) {
    let tp_list;

    db.getConnection()
    .then((connection) => {
      conn = connection;

      let sql = `
        SELECT
          *
        FROM T_TAKE_SPACE
      `;

      return conn.query(sql);
    })
    .then((sql_result) => {
      tp_list = sql_result;

      res.render('takespace_manage', {
        'session': req.user,
        'pageType': 9,
        'data': {
          'tpList': tp_list
        }
      });
    });

  } else {
    res.redirect('/');
  }
});

module.exports = router;
