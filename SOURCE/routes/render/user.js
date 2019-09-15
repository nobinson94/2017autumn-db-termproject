let express = require('express');
let router = express.Router();

const mysql = require('mysql');
const db = require(__DBdir);

let conn;

/* GET home page. */
router.get('/', function(req, res, next) {
  if (req.isAuthenticated()) {
    // logined
    res.redirect('/user/manage/');
  } else {
    // not logined
    res.redirect('/');
  }
});

router.get('/manage/', (req, res, next) => {
  if (req.isAuthenticated()) {
    if (req.user.USER_POSITION != 0) {
      res.redirect('/');
    }

    let user_list, cctv_list;

    db.getConnection()
    .then((connection) => {
      conn = connection;

      let sql = `
        SELECT
          ADM.*,
          GROUP_CONCAT(CCTV.n_CCTV_ID SEPARATOR ',!,') as cctvs
        FROM T_ADMINISTRATOR as ADM
        LEFT JOIN T_SUPERVISE as SUP on ADM.n_ADMIN_ID = SUP.n_ADMIN_ID
        LEFT JOIN T_CCTV as CCTV on SUP.n_CCTV_ID = CCTV.n_CCTV_ID
        WHERE ADM.tn_POSITION != 0
        GROUP BY ADM.n_ADMIN_ID
      `;

      return conn.query(sql);
    })
    .then((sql_result) => {
      user_list = sql_result;

      let sql = `
        SELECT
          *
        FROM T_CCTV
      `;

      return conn.query(sql);
    })
    .then((sql_result) => {
      cctv_list = sql_result;

      res.render('user_manage', {
        'session': req.user,
        'pageType': 5,
        'data': {
          'userList': user_list,
          'cctvList': cctv_list
        },
        'test': {
        }
      });
    });
  } else {
    res.redirect('/');
  }
});

module.exports = router;
