const express = require('express');
const mysql = require('mysql');
const crypto = require('crypto');
const passport = require('passport');
const fs = require('fs');

const parse = require('csv-parse');

let multer = require('multer');

let router = express.Router();

let db = require(__DBdir);
let conn;


let file_name = "";
let dir = "";

const storage = multer.diskStorage({
  destination: function(req, file, callback) {
    dir = './upload/' + req.user.USER_INDEX.toString();

    if (!fs.existsSync(dir)){
      fs.mkdirSync(dir);
    }
    callback(null, dir);
  },
  filename: function (req, file, callback) {
    file_name = `${req.user.USER_INDEX}_upload_cctv.csv`;

    callback(null, file_name);
  }
});

let upload = multer({ storage : storage}).single('uploadedFile');


router.post('/add', (req, res, next) => {
  let post_data = req.body;
  post_data['cctv_adm'] = JSON.parse(req.body['cctv_adm']);
  post_data['cctv_tp'] = JSON.parse(req.body['cctv_tp']);

  let last_inserted;


  db.getConnection()
  .then((connection) => {
    conn = connection;

    let sql = `
      INSERT
      INTO T_CCTV (v_MODEL, dt_INSTALL_DATE, f_LNG, f_LAT)
      VALUES (${mysql.escape(post_data.cctv_model)}, ${mysql.escape(post_data.cctv_date)}, ${mysql.escape(post_data.cctv_lng)}, ${mysql.escape(post_data.cctv_lat)})
    `;

    return conn.query(sql);
  }).then((sql_result) => {
    // make relationships between adm and cctv
    let a_c_relationship = "";
    last_inserted = sql_result.insertId;


    post_data['cctv_adm'].map((adm) => {
      if (a_c_relationship != "") a_c_relationship += ",";
      a_c_relationship += `('${adm}', '${last_inserted}')`;
    });

    let sql = `
      INSERT
      INTO T_SUPERVISE (n_ADMIN_ID, n_CCTV_ID)
      VALUES ${a_c_relationship}
    `;

    return conn.query(sql);
  }).then((sql_result) => {

    // make relationships between adm and cctv
    let c_t_relationship = "";

    post_data['cctv_tp'].map((tp) => {
      if (c_t_relationship != "") c_t_relationship += ",";
      c_t_relationship += `('${last_inserted}', '${tp}')`;
    });

    let sql = `
      INSERT
      INTO T_TAKE (n_CCTV_ID, n_TAKE_SPACE_ID)
      VALUES ${c_t_relationship}
    `;

    return conn.query(sql);
  }).then((sql_result) => {

    res.send('0');
  });
});


router.post('/search', (req, res, next) => {
  let post_data = req.body;


  let where_sql = '';

  // model condition
  if (post_data.cctv_model != '') {
    where_sql = `(BINARY SUB.v_MODEL Like "%${post_data.cctv_model}%")`;
  }

  // admin condition
  if (post_data.cctv_adm != '') {
    if (where_sql != '') where_sql += ' AND ';

    let adm_list = post_data.cctv_adm.split(',!,');

    where_sql += "(";

    let adm_sql = "";
    adm_list.map((adm_id) => {
      if (adm_sql != "") adm_sql += ` OR `;
      adm_sql += `BINARY SUB.admin_id LIKE '%${adm_id}%'`;
    });

    where_sql += adm_sql + ")";
  }

  // install condition
  let install_sql = "";
  if (post_data.cctv_date1 != '') {
    install_sql = `SUB.dt_INSTALL_DATE >= '${post_data.cctv_date1}'`;
  }

  if (post_data.cctv_date2 != '') {
    if (install_sql == '') install_sql = `SUB.dt_INSTALL_DATE <= '${post_data.cctv_date2}' + interval 2 day`;
    else install_sql += ` and SUB.dt_INSTALL_DATE <= '${post_data.cctv_date2}' + interval 2 day`;
  }


  if (install_sql != '') {
    if (where_sql != '')
      where_sql += ` AND (${install_sql})`;
    else
      where_sql = `(${install_sql})`;
  }

  if (where_sql != "") {
    where_sql = "WHERE " + where_sql;
  }

  // query
  let conn;

  db.getConnection()
  .then((connection) => {
    conn = connection;

    let sql = `
      SELECT
        SUB.*
      FROM
        (SELECT
          CCTV.*,
          GROUP_CONCAT(ADM.v_NAME SEPARATOR ', ') as admins,
          GROUP_CONCAT(ADM.n_ADMIN_ID SEPARATOR ', ') as admin_id
        FROM T_CCTV as CCTV
        LEFT JOIN T_SUPERVISE as SUP on CCTV.n_CCTV_ID = SUP.n_CCTV_ID
        LEFT JOIN T_ADMINISTRATOR as ADM on SUP.n_ADMIN_ID = ADM.n_ADMIN_ID
        GROUP BY CCTV.n_CCTV_ID) as SUB
      ${where_sql}
    `;

    return conn.query(sql);
  })
  .then((sql_result) => {
    res.send(sql_result);
  });
});


router.post('/delete', (req, res, next) => {
  let post_data = req.body;

  // query
  let conn;

  db.getConnection()
  .then((connection) => {
    conn = connection;

    let sql = `
      DELETE
      FROM T_CCTV
      WHERE n_CCTV_ID = ${post_data.cctv_id}
    `;

    return conn.query(sql);
  })
  .then((sql_result) => {
    res.send(`${sql_result['affectedRows']}`);
  });
});

router.post('/', (req, res, next) => {
  // query
  let conn;

  db.getConnection()
  .then((connection) => {
    conn = connection;

    let sql = `
      SELECT
        *
      FROM T_CCTV
    `;

    return conn.query(sql);
  })
  .then((sql_result) => {
    res.send(sql_result);
  });
});


router.post('/addCSV', (req, res, next) => {
  upload(req, res, function(err) {
    if(err) {
      return res.send("-1");
    };

    fs.readFile(`${dir}/${file_name}`, function (err, fileData) {
      parse(fileData, {columns: true, trim: true}, function(err, rows) {
        // Your CSV data is in an array of arrys passed to this callback as rows.

        if (rows.length > 0) {
          let input_values = ``;
          for (let i = 0; i < rows.length; i++) {
            let current = rows[i];

            if (input_values != '') input_values += ',';
            input_values += `('${current.model}', '${current.install_date}', ${current.lat}, ${current.lng})`;
          }

          db.getConnection()
          .then((connection) => {
            conn = connection;

            let sql = `
              INSERT
              INTO T_CCTV (v_MODEL, dt_INSTALL_DATE, f_LNG, f_LAT)
              VALUES ${input_values}
            `;

            return conn.query(sql);
          })
          .then((sql_result) => {
            let affectedRows = sql_result['affectedRows'];
            let lastId = sql_result['insertId'];

            let sup_inputs = ``;
            for (let i = lastId; i < lastId + affectedRows; i++) {
              if (sup_inputs != '') sup_inputs += ',';
              sup_inputs += `(${req.user.USER_INDEX}, ${i})`;
            }

            let sql = `
              INSERT
              INTO T_SUPERVISE (n_ADMIN_ID, n_CCTV_ID)
              VALUES ${sup_inputs}
            `;

            return conn.query(sql);
          })
          .then((sql_result) => {
            res.send(`0`);
          });
        } else {
          res.send("-1");
        }
      });
    });
  });
});

module.exports = router;
