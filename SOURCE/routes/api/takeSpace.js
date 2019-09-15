const express = require('express');
const mysql = require('mysql');
const crypto = require('crypto');
const passport = require('passport');

let router = express.Router();

let db = require(__DBdir);
let conn;

router.post('/delete', (req, res, next) => {
  db.getConnection()
  .then((connection) => {
    conn = connection;

    let sql = `
      DELETE
      FROM T_TAKE
      WHERE n_CCTV_ID = ${req.body.cctv_id} and n_TAKE_SPACE_ID = ${req.body.tp_id}
    `;

    return conn.query(sql);
  })
  .then((sql_result) => {
    res.send(`${sql_result['affectedRows']}`);
  });
});


router.post('/deleteTP', (req, res, next) => {
  db.getConnection()
  .then((connection) => {
    conn = connection;

    let sql = `
      DELETE
      FROM T_TAKE_SPACE
      WHERE n_TAKE_SPACE_ID = ${req.body.tp_id}
    `;

    return conn.query(sql);
  })
  .then((sql_result) => {
    res.send(`${sql_result['affectedRows']}`);
  });
});

router.post('/append', (req, res, next) => {
  db.getConnection()
  .then((connection) => {
    conn = connection;

    let sql = `
      INSERT INTO T_TAKE (n_CCTV_ID, n_TAKE_SPACE_ID)
      VALUES (${req.body.cctv_id}, ${req.body.tp_id})
    `;

    return conn.query(sql);
  })
  .then((sql_result) => {
    res.send(`${sql_result['affectedRows']}`);
  });
});


router.post('/appendTP', (req, res, next) => {
  db.getConnection()
  .then((connection) => {
    conn = connection;

    let sql = `
      INSERT INTO T_TAKE_SPACE (v_ADDRESS, v_BUILDING, v_FLOOR, v_SITE, f_LAT, f_LNG)
      VALUES (${mysql.escape(req.body.tp_address)}, ${mysql.escape(req.body.tp_building)}, ${mysql.escape(req.body.tp_floor)}, ${mysql.escape(req.body.tp_site)}, ${mysql.escape(req.body.tp_lat)}, ${mysql.escape(req.body.tp_lng)})
    `;

    return conn.query(sql);
  })
  .then((sql_result) => {
    res.send(`${sql_result['affectedRows']}`);
  });
});


router.post('/searchByCCTV', (req, res, next) => {
  db.getConnection()
  .then((connection) => {
    conn = connection;

    let sql = `
      SELECT
        TP.*
      FROM T_TAKE_SPACE as TP
      LEFT JOIN T_TAKE as TAKE on TP.n_TAKE_SPACE_ID = TAKE.n_TAKE_SPACE_ID
      LEFT JOIN T_CCTV as CCTV on TAKE.n_CCTV_ID = CCTV.n_CCTV_ID
      WHERE CCTV.n_CCTV_ID = ${req.body.cctv_id}
    `;

    return conn.query(sql);
  })
  .then((sql_result) => {
    res.send(sql_result);
  });
});

router.post('/searchTPList', (req, res, next) => {
  let where_sql = [];
  let where_res_sql = ``;
  let post_data = req.body;


  if (post_data.address != '') {
    where_sql.push(`BINARY TP.v_ADDRESS LIKE '%${post_data.address}%'`);
  }

  if (post_data.building != '') {
    where_sql.push(`BINARY TP.v_BUILDING LIKE '%${post_data.building}%'`);
  }

  if (post_data.floor != '') {
    where_sql.push(`BINARY TP.v_FLOOR LIKE '%${post_data.floor}%'`);
  }

  if (post_data.site != '') {
    where_sql.push(`BINARY TP.v_SITE LIKE '%${post_data.site}%'`);
  }

  if (where_sql.length != 0) {
    where_res_sql += 'WHERE '
    where_res_sql += where_sql.join(' AND ');
  }


  db.getConnection()
  .then((connection) => {
    conn = connection;

    let sql = `
      SELECT
        TP.*
      FROM T_TAKE_SPACE as TP
      ${where_res_sql}
    `;

    return conn.query(sql);
  })
  .then((sql_result) => {
    res.send(sql_result);
  });
});

module.exports = router;
