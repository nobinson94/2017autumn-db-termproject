let express = require('express');
let router = express.Router();

const mysql = require('mysql');
const db = require(__DBdir);

let conn;

/* GET home page. */
router.get('/', function(req, res, next) {
  if (req.isAuthenticated()) {
    // logined
    res.redirect('/neighbor/manage/');
  } else {
    // not logined
    res.redirect('/');
  }
});

router.get('/manage/', (req, res, next) => {
  if (req.isAuthenticated()) {
    let tp_list = [],
        path_list = [],
        np_list = [];

    db.getConnection()
    .then((connection) => {
      conn = connection;

      let sql = `
        SELECT
          NP.*,
          TP1.v_ADDRESS as tp1_address,
          TP1.v_BUILDING as tp1_building,
          TP1.v_FLOOR as tp1_floor,
          TP1.v_SITE as tp1_site,
          TP1.n_TAKE_SPACE_ID as tp1_id,
          TP2.v_ADDRESS as tp2_address,
          TP2.v_BUILDING as tp2_building,
          TP2.v_FLOOR as tp2_floor,
          TP2.v_SITE as tp2_site,
          TP2.n_TAKE_SPACE_ID as tp2_id,
          TP1.f_LAT as tp1_lat,
          TP1.f_LNG as tp1_lng,
          TP2.f_LAT as tp2_lat,
          TP2.f_LNG as tp2_lng,
          PATH.v_PATH_NAME as path_name,
          PATH.v_LOCATION as path_location,
          PATH.f_LAT_START as ps_lat,
          PATH.f_LNG_START as ps_lng,
          PATH.f_LAT_END as pe_lat,
          PATH.f_LNG_END as pe_lng
        FROM T_NEIGHBOR_SPACE as NP
        LEFT JOIN T_TAKE_SPACE as TP1 on NP.n_SPACE_1 = TP1.n_TAKE_SPACE_ID
        LEFT JOIN T_TAKE_SPACE as TP2 on NP.n_SPACE_2 = TP2.n_TAKE_SPACE_ID
        LEFT JOIN T_PATH as PATH on NP.n_PATH_ID = PATH.n_PATH_ID
        GROUP BY NP.n_NEIGHBOR_ID
      `;

      return conn.query(sql);
    })
    .then((sql_result) => {
      np_list = sql_result;

      let sql = `
        SELECT
          *
        FROM T_PATH
      `;

      return conn.query(sql);
    })
    .then((sql_result) => {
      path_list = sql_result;

      let sql = `
        SELECT
          *
        FROM T_TAKE_SPACE
      `;

      return conn.query(sql);
    })
    .then((sql_result) => {
      tp_list = sql_result;

      res.render('neighbor_manage', {
        'session': req.user,
        'pageType': 6,
        'data': {
          'npList': np_list,
          'pathList': path_list,
          'tpList': tp_list
        }
      });
    });
  } else {
    res.redirect('/');
  }
});

module.exports = router;
