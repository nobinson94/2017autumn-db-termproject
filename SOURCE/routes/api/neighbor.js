const express = require('express');
const mysql = require('mysql');
const crypto = require('crypto');
const passport = require('passport');
const geolib = require('geolib');

let router = express.Router();

let db = require(__DBdir);
let conn;

router.post('/append', (req, res, next) => {

  // check logic
  let tp1_coord = JSON.parse(req.body.np_tp1_coord);
  let tp2_coord = JSON.parse(req.body.np_tp2_coord);
  let path_coord = JSON.parse(req.body.np_path_coord);

  if (!((geolib.getDistance(tp1_coord, path_coord[0], 1) < 50
  && geolib.getDistance(tp2_coord, path_coord[1], 1) < 50) ||
  (geolib.getDistance(tp1_coord, path_coord[1], 1) < 50
  && geolib.getDistance(tp2_coord, path_coord[0], 1) < 50))) {
    res.send('1');
    return false;
  }


  db.getConnection()
  .then((connection) => {
    conn = connection;

    let sql = `
      SELECT
        COUNT(*) as count
      FROM T_NEIGHBOR_SPACE
      WHERE (n_SPACE_1 = ${req.body.np_tp1} AND n_SPACE_2 = ${req.body.np_tp2} AND n_PATH_ID = ${req.body.np_path})
       OR (n_SPACE_1 = ${req.body.np_tp2} AND n_SPACE_2 = ${req.body.np_tp1} AND n_PATH_ID = ${req.body.np_path})
    `;

    return conn.query(sql);
  })
  .then((sql_result) => {
    if (sql_result[0].count > 0) {
      res.send('-1');
      return false;
    }

    let sql = `
      INSERT INTO T_NEIGHBOR_SPACE
        (v_NEIGHBOR_NAME, n_SPACE_1, n_SPACE_2, n_PATH_ID)
        VALUES ('${req.body.np_name}', ${req.body.np_tp1}, ${req.body.np_tp2}, ${req.body.np_path})
    `;

    return conn.query(sql);
  })
  .then((sql_result) => {
    res.send('0');
  });
});


router.post('/search', (req, res, next) => {
  let post_data = req.body;

  let where_sql = [];

  // name conditions
  if (post_data.np_name != '') {
    where_sql.push(`BINARY NP.v_NEIGHBOR_NAME LIKE '%${post_data.np_name}%'`);
  }

  // tp conditions
  let tp1_list = post_data.np_tp1.split(',!,');
  let tp2_list = post_data.np_tp2.split(',!,');


  let tp_list = [];

  if (tp1_list[0] != '') {
    tp_list = tp_list.concat(tp1_list);
  }
  if (tp2_list[0] != '') {
    tp_list = tp_list.concat(tp2_list);
  }

  let tp_sql = "";

  if (tp_list.length > 1) {
    tp_list.map((tp1) => {
      tp_list.map((tp2) => {
        if (tp_sql != '') tp_sql += ' OR ';
        tp_sql += `NP.n_SPACE_1 = ${tp1} AND NP.n_SPACE_2 = ${tp2}`;
      });
    });
  }

  if (tp_list.length == 1) {
    tp_sql = `NP.n_SPACE_1 = ${tp_list[0]} OR NP.n_SPACE_2 = ${tp_list[0]}`;
  }

  if (tp_sql != "") where_sql.push(tp_sql);

  // path conditions
  if (post_data.np_path != '') {
    let path_list = post_data.np_path.split(',!,');
    let path_sql = "";

    path_list.map((path) => {
      if (path_sql != "") path_sql += ` OR `;
      path_sql += `NP.n_PATH_ID = '%${path}%'`;
    });

    if (path_sql != '') where_sql.push(path_sql);
  }

  let result_sql = "";
  where_sql.map((where) => {
    if (result_sql != '') result_sql += " AND ";
    result_sql += `(${where})`;
  });

  if (result_sql != "") result_sql = "WHERE " + result_sql;

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
      ${result_sql}
      GROUP BY NP.n_NEIGHBOR_ID
    `;

    return conn.query(sql);
  })
  .then((sql_result) => {
    res.send(sql_result);
  });
  //res.send([]);
});

// todo 시퀀스 체크
router.post('/delete', (req, res, next) => {
  db.getConnection()
  .then((connection) => {
    conn = connection;

    let sql = `
      SELECT
        SEQ.*,
        CPS.n_NEIGHBOR_ID
      FROM T_SEQUENCE as SEQ
      LEFT JOIN T_COMPOSED as CPS on SEQ.n_SEQ_ID = CPS.n_SEQ_ID
      WHERE CPS.n_NEIGHBOR_ID = ${req.body.np_id}
      GROUP BY SEQ.n_SEQ_ID
    `
    return conn.query(sql);
  })
  .then((sql_result) => {
    if (sql_result.length == 0)  return "false";

    let where_sql = "";
    for (let i = 0; i < sql_result.length; i++) {
      if (where_sql != "") where_sql += ' OR ';
      where_sql += `n_SEQ_ID = ${sql_result[i].n_SEQ_ID}`
    }

    if (where_sql != "") where_sql = 'WHERE ' + where_sql;
    let sql = `
      DELETE FROM T_SEQUENCE
      ${where_sql}
    `;

    return conn.query(sql);
  })
  .then((sql_result) => {
    if (sql_result == "false") return "false";

    let sql = `
      DELETE FROM T_NEIGHBOR_SPACE
      WHERE n_NEIGHBOR_ID = ${req.body.np_id}
    `;

    return conn.query(sql);
  })
  .then((sql_result) => {
    if (sql_result == "false") res.send('0');
    else res.send(`${sql_result['affectedRows']}`);
  });
});

module.exports = router;
