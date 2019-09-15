let express = require('express');
let router = express.Router();

const mysql = require('mysql');
const db = require(__DBdir);

let conn;

/* GET home page. */
router.get('/', function(req, res, next) {
  if (req.isAuthenticated()) {
    // logined
    res.redirect('/sequence/manage/');
  } else {
    // not logined
    res.redirect('/');
  }
});

router.get('/manage/', (req, res, next) => {
  if (req.isAuthenticated()) {
    let np_list = [],
        seq_list = [],
        np_in_seq_list = [];

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
          TP1.f_LAT as tp1_lat,
          TP1.f_LNG as tp1_lng,
          TP2.v_ADDRESS as tp2_address,
          TP2.v_BUILDING as tp2_building,
          TP2.v_FLOOR as tp2_floor,
          TP2.v_SITE as tp2_site,
          TP2.n_TAKE_SPACE_ID as tp2_id,
          TP2.f_LAT as tp2_lat,
          TP2.f_LNG as tp2_lng,
          PATH.*
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
        SEQ.*,
        GROUP_CONCAT(NP.v_NEIGHBOR_NAME ORDER BY CPS.n_NP_INDEX SEPARATOR ", ") as NP_NAMES,
        GROUP_CONCAT(NP.n_NEIGHBOR_ID ORDER BY CPS.n_NP_INDEX SEPARATOR ", ") as NP_IDS,
        GROUP_CONCAT(CONCAT('"', TP1.n_TAKE_SPACE_ID, '": {"lat":', TP1.f_LAT , ', "lng":', TP1.f_LNG , '}') SEPARATOR ", ") as TP1_LOCATIONS,
        GROUP_CONCAT(CONCAT('"', TP2.n_TAKE_SPACE_ID, '": {"lat":', TP2.f_LAT , ', "lng":', TP2.f_LNG , '}') SEPARATOR ", ") as TP2_LOCATIONS,
        GROUP_CONCAT(CONCAT('"', PATH.n_PATH_ID, '": {"s_lat":', PATH.f_LAT_START, ', "s_lng":', PATH.f_LNG_START, ', "e_lat":', PATH.f_LAT_END, ', "e_lng":', PATH.f_LNG_END, '}') SEPARATOR ", ") as PATH_LOCATIONS
       FROM T_SEQUENCE as SEQ
       LEFT JOIN T_COMPOSED as CPS on SEQ.n_SEQ_ID = CPS.n_SEQ_ID
       LEFT JOIN T_NEIGHBOR_SPACE as NP on CPS.n_NEIGHBOR_ID = NP.n_NEIGHBOR_ID
       LEFT JOIN T_TAKE_SPACE as TP1 on NP.n_SPACE_1 = TP1.n_TAKE_SPACE_ID
       LEFT JOIN T_TAKE_SPACE as TP2 on NP.n_SPACE_2 = TP2.n_TAKE_SPACE_ID
       LEFT JOIN T_PATH as PATH on NP.n_PATH_ID = PATH.n_PATH_ID
       GROUP BY SEQ.n_SEQ_ID
      `;

      return conn.query(sql);
    }).then((sql_result) => {
      seq_list = sql_result;

      res.render(('sequence_manage'), {
        'session': req.user,
        'pageType': 7,
        'data': {
          'npList': np_list,
          'seqList': seq_list
        }
      });

    });

  } else {
    res.redirect('/');
  }
});

module.exports = router;
