const express = require('express');
const mysql = require('mysql');

let router = express.Router();

let db = require(__DBdir);
let conn;

router.post('/addPath', (req, res, next) => {
  db.getConnection()
  .then((connection) => {
    conn = connection;

    let sql = `
      INSERT INTO T_PATH (v_PATH_NAME, v_LOCATION, f_LNG_START, f_LAT_START, f_LNG_END, f_LAT_END)
      VALUES (${mysql.escape(req.body.path_name)}, ${mysql.escape(req.body.path_location)}, ${mysql.escape(req.body.path_start_lng)}, ${mysql.escape(req.body.path_start_lat)}, ${mysql.escape(req.body.path_end_lng)}, ${mysql.escape(req.body.path_end_lat)})
    `;

    return conn.query(sql);
  })
  .then((sql_result) => {
    res.send(`${sql_result['affectedRows']}`);
  });
});


router.post('/deletePath', (req, res, next) => {
  db.getConnection()
  .then((connection) => {
    conn = connection;

    let sql = `
      DELETE from T_PATH
      WHERE n_PATH_ID = ${mysql.escape(req.body.path_id)}
    `;

    return conn.query(sql);
  })
  .then((sql_result) => {
    res.send(`${sql_result['affectedRows']}`);
  });
});

router.post('/search', (req, res, next) => {
  let post_data = req.body;
  let where_array = [];
  let where_sql = ``;

  if (post_data.nameCond != '') where_array.push(`BINARY v_PATH_NAME LIKE '%${post_data.nameCond}%'`);
  if (post_data.locationCond != '') where_array.push(`BINARY v_LOCATION LIKE '%${post_data.locationCond}%'`);

  if (where_array.length != 0) where_sql = 'WHERE ' + where_array.join(' AND ');


  db.getConnection()
  .then((connection) => {
    conn = connection;

    let sql = `
      SELECT * from T_PATH
      ${where_sql}
    `;

    return conn.query(sql);
  })
  .then((sql_result) => {
    res.send(sql_result);
  });
});

module.exports = router;
