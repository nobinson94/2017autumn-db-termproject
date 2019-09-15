let express = require('express');
let multer = require('multer');

let router = express.Router();

const mysql = require('mysql');
const db = require(__DBdir);

const fs = require('fs');
const parse = require('csv-parse');

let file_name = "";
let dir = "";


const storage = multer.diskStorage({
  destination: function(req, file, callback) {
    dir = './upload/' + req.body.tpSelectName.split(' ').join('');

    if (!fs.existsSync(dir)){
      fs.mkdirSync(dir);
    }
    callback(null, dir);
  },
  filename: function (req, file, callback) {
    file_name = req.body.cctvSelect + '_' + req.body.tpSelectName.split(' ').join('') + '_' + req.body.startDate + '_' + req.body.endDate + "." + file.mimetype.split('/')[1];

    callback(null, file_name);
  }
});

let upload = multer({ storage : storage}).single('uploadedFile');


const storage2 = multer.diskStorage({
  destination: function(req, file, callback) {
    dir = './upload/' + req.body.movieSelect.split('_')[1];

    if (!fs.existsSync(dir)){
      fs.mkdirSync(dir);
    }
    callback(null, dir);
  },
  filename: function (req, file, callback) {
    file_name = req.body.movieSelect.split('.')[0] + '_로그.' + file.mimetype.split('/')[1];

    callback(null, file_name);
  }
});

let upload2 = multer({ storage : storage2}).single('uploadedFile');


let conn;


router.post('/movie/upload', (req, res, next) => {
  upload(req, res,function(err) {
    if(err) {
      return res.send("-1");
    };

    db.getConnection()
    .then((connection) => {
      conn = connection;

      let sql = `
        INSERT INTO T_MOVIE_FILE (v_MOVIE_FILE_NAME, v_EXTENSION, n_TAKE_SPACE_ID, n_CCTV_ID, n_ADMIN_ID, dt_START_TIME, dt_END_TIME)
        VALUES ('${file_name}', '${file_name.split('.')[1]}', ${req.body.tpSelect}, ${req.body.cctvSelect}, ${req.user.USER_INDEX}, '${req.body.startDate}', '${req.body.endDate}')
      `;

      return conn.query(sql);
    })
    .then((sql_result) => {
      res.send(`${sql_result['affectedRows']}`);
    });
  });
});


router.post('/movie/delete', (req, res, next) => {
  let post_data = req.body;

  db.getConnection()
  .then((connection) => {
    conn = connection;

    let sql = `
      SELECT
        *
      FROM T_METALOG_FILE as LF
      WHERE LF.v_MOVIE_FILE_NAME = ${mysql.escape(post_data.mf_name)}
    `;

    return conn.query(sql);
  })
  .then((sql_result) => {
    for (let i = 0; i < sql_result.length; i++) {
      let dir = './upload/' + sql_result[i].v_LOG_FILE_NAME.split('_')[1];
      fs.access(`${dir}/${sql_result[i].v_LOG_FILE_NAME}`, fs.constants.R_OK | fs.constants.W_OK, (err) => {
        if (!err) fs.unlinkSync(`${dir}/${sql_result[i].v_LOG_FILE_NAME}`);
      });
    }

    let sql = `
      DELETE
      FROM T_MOVIE_FILE
      WHERE v_MOVIE_FILE_NAME = ${mysql.escape(post_data.mf_name)}
    `;

    return conn.query(sql);
  })
  .then((sql_result) => {
    let dir = './upload/' + post_data.mf_name.split('_')[1];
    fs.access(`${dir}/${post_data.mf_name}`, fs.constants.R_OK | fs.constants.W_OK, (err) => {
      if (!err)
        fs.unlinkSync(`${dir}/${post_data.mf_name}`);
    });
    res.send(`${sql_result['affectedRows']}`);
  });
});

router.post('/movie/search', (req, res, next) => {
  let post_data = req.body;

  let where_sql = [];

  // name conditions
  if (post_data.nameCond != '') {
    where_sql.push(`SUB.v_MOVIE_FILE_NAME LIKE '%${post_data.nameCond}%'`);
  }

  // cctv conditions
  if (post_data.cctvCond != '') {
    let cctv_list = post_data.cctvCond.split(',!,');
    let cctv_sql = "";

    cctv_list.map((cctv) => {
      if (cctv_sql != "") cctv_sql += ` OR `;
      cctv_sql += `SUB.cctvs LIKE '%${cctv}%'`;
    });

    where_sql.push(cctv_sql);
  }

  // tp conditions
  let tp_sql = "";
  if (post_data.tpAddressCond != '') {
    if (tp_sql != "") tp_sql += ` AND `;
    tp_sql += `BINARY SUB.v_ADDRESS LIKE '%${post_data.tpAddressCond}%'`;
  }
  // tp conditions
  if (post_data.tpBuidlingCond != '') {
    if (tp_sql != "") tp_sql += ` AND `;
    tp_sql += `BINARY SUB.v_BUILDING LIKE '%${post_data.tpBuildingCond}%'`;
  }
  // tp conditions
  if (post_data.tpFloorCond != '') {
    if (tp_sql != "") tp_sql += ` AND `;
    tp_sql += `BINARY SUB.v_FLOOR LIKE '%${post_data.tpFloorCond}%'`;
  }
  // tp conditions
  if (post_data.tpSiteCond != '') {
    if (tp_sql != "") tp_sql += ` AND `;
    tp_sql += `BINARY SUB.v_SITE LIKE '%${post_data.tpSiteCond}%'`;
  }

  if (tp_sql != "") where_sql.push(tp_sql);



  // seq conditions
  if (post_data.seqCond != '') {
    let seq_list = post_data.seqCond.split(',!,');
    let seq_sql = "";

    seq_list.map((seq) => {
      if (seq_sql != "") seq_sql += ` OR `;
      seq_sql += `BINARY SUB.seqlists LIKE '%${seq}%'`;
    });

    where_sql.push(seq_sql);
  }

  // time conditions
  let time_sql = "";
  if (post_data.startTimeCond != '') {
    time_sql = `SUB.dt_START_TIME >= '${post_data.startTimeCond}'`;
  }

  if (post_data.endTimeCond != '') {
    if (time_sql == '') time_sql = `SUB.dt_END_TIME <= '${post_data.endTimeCond}' + interval 2 day`;
    else time_sql += ` and SUB.dt_END_TIME <= '${post_data.endTimeCond}' + interval 2 day`;
  }

  if (time_sql != '') where_sql.push(time_sql);


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
        SUB.*
      FROM (SELECT
        MF.v_MOVIE_FILE_NAME,
        MF.v_EXTENSION,
        MF.dt_START_TIME,
        MF.dt_END_TIME,
        TP.*,
        CCTV.v_MODEL,
        IFNULL(GROUP_CONCAT(DISTINCT(SQ.v_SEQ_NAME) SEPARATOR ', '), '') as SEQS,
        IFNULL(GROUP_CONCAT(DISTINCT(SQ.n_SEQ_ID) SEPARATOR ', '), '') as seqlists,
        GROUP_CONCAT(DISTINCT(CCTV.n_CCTV_ID) SEPARATOR ', ') as cctvs,
        GROUP_CONCAT(DISTINCT(TP.n_TAKE_SPACE_ID) SEPARATOR ', ') as tps
      FROM T_MOVIE_FILE as MF
      LEFT JOIN T_TAKE_SPACE as TP on MF.n_TAKE_SPACE_ID = TP.n_TAKE_SPACE_ID
      LEFT JOIN T_CCTV as CCTV on MF.n_CCTV_ID = CCTV.n_CCTV_ID
      LEFT JOIN T_SUPERVISE as SUP on CCTV.n_CCTV_ID = SUP.n_CCTV_ID
      LEFT JOIN T_METALOG_FILE as LF on MF.v_MOVIE_FILE_NAME = LF.v_MOVIE_FILE_NAME
      LEFT JOIN T_STATISTICS as ST on LF.v_LOG_FILE_NAME = ST.v_LOG_FILE_NAME
      LEFT JOIN T_NEIGHBOR_SPACE as NP on TP.n_TAKE_SPACE_ID = NP.n_SPACE_1 OR TP.n_TAKE_SPACE_ID = NP.n_SPACE_2
      LEFT JOIN T_COMPOSED as CP on NP.n_NEIGHBOR_ID = CP.n_NEIGHBOR_ID
      LEFT JOIN T_SEQUENCE as SQ on CP.n_SEQ_ID = SQ.n_SEQ_ID
      WHERE MF.n_ADMIN_ID = ${req.user.USER_INDEX}
      GROUP BY MF.v_MOVIE_FILE_NAME) as SUB
      ${result_sql}
    `;

    return conn.query(sql);
  })
  .then((sql_result) => {
    res.send(sql_result);
  });
});


router.post('/log/upload', (req, res, next) => {
  upload2(req, res,function(err) {
    if(err) {
      return res.send("-1");
    };

    db.getConnection()
    .then((connection) => {
      conn = connection;

      let sql = `
        INSERT INTO T_METALOG_FILE (v_LOG_FILE_NAME, v_EXTENSION, v_MOVIE_FILE_NAME)
        VALUES ('${file_name}', '${file_name.split('.')[1]}', '${req.body.movieSelect}')
      `;

      return conn.query(sql);
    })
    .then((sql_result) => {
      let dir = './upload/' + file_name.split('_')[1];

      // load csv File
      fs.readFile(`${dir}/${file_name}`, function (err, fileData) {
        parse(fileData, {columns: true, trim: true}, function(err, rows) {
          // Your CSV data is in an array of arrys passed to this callback as rows.

          let recordMeanStatistics = {
            objectLocationX : 0,
            objectLocationY : 0,
            objectScaleX : 0,
            objectScaleY : 0,
            objectSpeedX : 0,
            objectSpeedY : 0,
            objectColorR : 0,
            objectColorG : 0,
            objectColorB : 0
          };

          let record_num = rows.length;
          let record_length = [100000000000, 0];
          let record_object = [];

          for (let i = 0; i < rows.length; i++) {
            let value = rows[i];

            Object.keys(recordMeanStatistics).forEach((obj_key) => {
              recordMeanStatistics[obj_key] += value[obj_key]/100000;
            });

            if (parseInt(value.timeStamp) < record_length[0]) record_length[0] = parseInt(value.timeStamp);
            if (parseInt(value.timeStamp) > record_length[1]) record_length[1] = parseInt(value.timeStamp);
            if (!record_object.includes(value.objectId)) record_object.push(value.objectId);
          }

          Object.keys(recordMeanStatistics).forEach((obj_key) => {
            recordMeanStatistics[obj_key] = recordMeanStatistics[obj_key]/record_num*100000;
          });

          let record_object_num = record_object.length;

          let sql = `
            INSERT INTO T_STATISTICS (v_LOG_FILE_NAME, n_RECORD_NUM, n_LENGTH, n_OBJECT_NUM, f_AVG_COLOR_R, f_AVG_COLOR_G, f_AVG_COLOR_B, f_AVG_SIZE_X, f_AVG_SIZE_Y, f_AVG_SPEED_X, f_AVG_SPEED_Y, f_AVG_POSITION_X, f_AVG_POSITION_Y)
            VALUES ('${file_name}', ${record_num}, ${record_length[1] - record_length[0]}, ${record_object_num}, ${recordMeanStatistics['objectColorR']}, ${recordMeanStatistics['objectColorG']}, ${recordMeanStatistics['objectColorB']}, ${recordMeanStatistics['objectScaleX']}, ${recordMeanStatistics['objectScaleY']}, ${recordMeanStatistics['objectSpeedX']}, ${recordMeanStatistics['objectSpeedY']}, ${recordMeanStatistics['objectLocationX']}, ${recordMeanStatistics['objectLocationY']})
          `;

          conn.query(sql);

          res.send(`${sql_result['affectedRows']}`);
        });
      });

    });
  });
});

router.post('/log/delete', (req, res, next) => {
  let post_data = req.body;
  let affectedRows = 0;

  db.getConnection()
  .then((connection) => {
    conn = connection;

    let sql = `
      DELETE
      FROM T_METALOG_FILE
      WHERE v_LOG_FILE_NAME = ${mysql.escape(post_data.lf_name)}
    `;

    return conn.query(sql);
  })
  .then((sql_result) => {
    affectedRows = sql_result['affectedRows'];

    let sql = `
      DELETE
      FROM T_STATISTICS
      WHERE v_LOG_FILE_NAME = ${mysql.escape(post_data.lf_name)}
    `;

    return conn.query(sql);
  })
  .then((sql_result) => {
    let dir = './upload/' + post_data.lf_name.split('_')[1];
    fs.access(`${dir}/${post_data.lf_name}`, fs.constants.R_OK | fs.constants.W_OK, (err) => {
      if (!err)
        fs.unlinkSync(`${dir}/${post_data.lf_name}`);
    });
    res.send(`${affectedRows}`);
  });
});

router.post('/log/search', (req, res, next) => {
  let post_data = req.body;

  let where_sql = [];

  // name conditions
  if (post_data.nameCond != '') {
    where_sql.push(`BINARY SUB.v_LOG_FILE_NAME LIKE '%${post_data.nameCond}%'`);
  }

  // movie conditions
  if (post_data.movieCond != '') {
    where_sql.push(`BINARY SUB.v_MOVIE_FILE_NAME LIKE '%${post_data.movieCond}%'`);
  }

  // cctv conditions
  if (post_data.cctvCond != '') {
    let cctv_list = post_data.cctvCond.split(',!,');
    let cctv_sql = "";

    cctv_list.map((cctv) => {
      if (cctv_sql != "") cctv_sql += ` OR `;
      cctv_sql += `BINARY SUB.cctvs LIKE '%${cctv}%'`;
    });

    where_sql.push(cctv_sql);
  }


  // tp conditions
  let tp_sql = "";
  if (post_data.tpAddressCond != '') {
    if (tp_sql != "") tp_sql += ` AND `;
    tp_sql += `BINARY SUB.v_ADDRESS LIKE '%${post_data.tpAddressCond}%'`;
  }
  // tp conditions
  if (post_data.tpBuidlingCond != '') {
    if (tp_sql != "") tp_sql += ` AND `;
    tp_sql += `BINARY SUB.v_BUILDING LIKE '%${post_data.tpBuildingCond}%'`;
  }
  // tp conditions
  if (post_data.tpFloorCond != '') {
    if (tp_sql != "") tp_sql += ` AND `;
    tp_sql += `BINARY SUB.v_FLOOR LIKE '%${post_data.tpFloorCond}%'`;
  }
  // tp conditions
  if (post_data.tpSiteCond != '') {
    if (tp_sql != "") tp_sql += ` AND `;
    tp_sql += `BINARY SUB.v_SITE LIKE '%${post_data.tpSiteCond}%'`;
  }

  if (tp_sql != "") where_sql.push(tp_sql);


  // seq conditions
  if (post_data.seqCond != '') {
    let seq_list = post_data.seqCond.split(',!,');
    let seq_sql = "";

    seq_list.map((seq) => {
      if (seq_sql != "") seq_sql += ` OR `;
      seq_sql += `BINARY SUB.seqlists LIKE '%${seq}%'`;
    });

    where_sql.push(seq_sql);
  }

  // time conditions
  let time_sql = "";
  if (post_data.startTimeCond != '') {
    time_sql = `SUB.dt_START_TIME >= '${post_data.startTimeCond}'`;
  }

  if (post_data.endTimeCond != '') {
    if (time_sql == '') time_sql = `SUB.dt_END_TIME <= '${post_data.endTimeCond}' + interval 2 day`;
    else time_sql += ` and SUB.dt_END_TIME <= '${post_data.endTimeCond}' + interval 2 day`;
  }

  if (time_sql != '') where_sql.push(time_sql);


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
        SUB.*
      FROM (
        SELECT
          LF.v_LOG_FILE_NAME,
          LF.v_EXTENSION,
          MF.v_MOVIE_FILE_NAME,
          MF.dt_START_TIME,
          MF.dt_END_TIME,
          TP.v_BUILDING,
          TP.v_ADDRESS,
          TP.v_FLOOR,
          TP.v_SITE,
          CCTV.*,
          IFNULL(GROUP_CONCAT(DISTINCT(SQ.v_SEQ_NAME) SEPARATOR ', '), '') as SEQS,
          IFNULL(GROUP_CONCAT(DISTINCT(SQ.n_SEQ_ID) SEPARATOR ', '), '') as seqlists,
          GROUP_CONCAT(DISTINCT(CCTV.n_CCTV_ID) SEPARATOR ', ') as cctvs,
          GROUP_CONCAT(DISTINCT(TP.n_TAKE_SPACE_ID) SEPARATOR ', ') as tps
        FROM T_METALOG_FILE as LF
        LEFT JOIN T_MOVIE_FILE as MF on LF.v_MOVIE_FILE_NAME = MF.v_MOVIE_FILE_NAME
        LEFT JOIN T_TAKE_SPACE as TP on MF.n_TAKE_SPACE_ID = TP.n_TAKE_SPACE_ID
        LEFT JOIN T_CCTV as CCTV on MF.n_CCTV_ID = CCTV.n_CCTV_ID
        LEFT JOIN T_SUPERVISE as SUP on CCTV.n_CCTV_ID = SUP.n_CCTV_ID
        LEFT JOIN T_STATISTICS as ST on LF.v_LOG_FILE_NAME = ST.v_LOG_FILE_NAME
        LEFT JOIN T_NEIGHBOR_SPACE as NP on TP.n_TAKE_SPACE_ID = NP.n_SPACE_1 OR TP.n_TAKE_SPACE_ID = NP.n_SPACE_2
        LEFT JOIN T_COMPOSED as CP on NP.n_NEIGHBOR_ID = CP.n_NEIGHBOR_ID
        LEFT JOIN T_SEQUENCE as SQ on CP.n_SEQ_ID = SQ.n_SEQ_ID
        WHERE MF.n_ADMIN_ID = ${req.user.USER_INDEX}
        GROUP BY LF.v_LOG_FILE_NAME) as SUB
      ${result_sql}
    `;

    return conn.query(sql);
  })
  .then((sql_result) => {
    res.send(sql_result);
  });
});



router.post('/log/statistics', (req, res, next) => {
  // load csv File
  let file_name = req.body.file_name;
  let dir = './upload/' + file_name.split('_')[1];

  fs.readFile(`${dir}/${file_name}`, function (err, fileData) {
    parse(fileData, {columns: true, trim: true}, function(err, rows) {
      // Your CSV data is in an array of arrys passed to this callback as rows.

      let recordMeanStatistics = {
        objectLocationX : 0,
        objectLocationY : 0,
        objectScaleX : 0,
        objectScaleY : 0,
        objectSpeedX : 0,
        objectSpeedY : 0,
        objectColorR : 0,
        objectColorG : 0,
        objectColorB : 0
      };

      let record_num = rows.length;
      let record_length = [100000000000, 0];
      let record_object = {};

      for (let i = 0; i < rows.length; i++) {
        let value = rows[i];

        Object.keys(recordMeanStatistics).forEach((obj_key) => {
          recordMeanStatistics[obj_key] += parseFloat(value[obj_key])/100000;
        });

        if (parseInt(value.timeStamp) < record_length[0]) record_length[0] = parseInt(value.timeStamp);
        if (parseInt(value.timeStamp) > record_length[1]) record_length[1] = parseInt(value.timeStamp);
        if (!(Object.keys(record_object)).includes(value.objectId)) record_object[value.objectId] = {};
      }

      Object.keys(recordMeanStatistics).forEach((obj_key) => {
        recordMeanStatistics[obj_key] = recordMeanStatistics[obj_key]/record_num*100000;
      });

      let timeSeriesData = {

      };

      for (let i = 0; i < rows.length; i++) {
        let value = rows[i];

        if (timeSeriesData[value.timeStamp] == undefined) {
          timeSeriesData[value.timeStamp] = {
            include_objects : [],
            objects: {}
          };
        }

        if (!timeSeriesData[value.timeStamp].include_objects.includes(value.objectId))
          timeSeriesData[value.timeStamp].include_objects.push(value.objectId);

        if (timeSeriesData[value.timeStamp].objects[value.objectId] == undefined) {
          timeSeriesData[value.timeStamp].objects[value.objectId] = []
        }

        timeSeriesData[value.timeStamp].objects[value.objectId].push(value);
      }

      res.send(JSON.stringify({
        record_num : record_num,
        record_length : record_length[1] - record_length[0],
        record_total_length : record_length[1],
        record_avgs : recordMeanStatistics,
        record_object_num : Object.keys(record_object).length,
        record_object : Object.keys(record_object),
        records: timeSeriesData
      }));
    });
  });
});


router.post('/log/download', (req, res, next) => {
  // load csv File
  db.getConnection()
  .then((connection) => {
    conn = connection;

    let sql = `
      SELECT
        LF.*,
        MF.v_MOVIE_FILE_NAME, MF.dt_START_TIME, MF.dt_END_TIME,
        TP.*,
        CCTV.*,
        ST.*,
        GROUP_CONCAT(DISTINCT(SQ.v_SEQ_NAME) SEPARATOR ', ') as SEQS
      FROM T_METALOG_FILE as LF
      LEFT JOIN T_MOVIE_FILE as MF on LF.v_MOVIE_FILE_NAME = MF.v_MOVIE_FILE_NAME
      LEFT JOIN T_TAKE_SPACE as TP on MF.n_TAKE_SPACE_ID = TP.n_TAKE_SPACE_ID
      LEFT JOIN T_CCTV as CCTV on MF.n_CCTV_ID = CCTV.n_CCTV_ID
      LEFT JOIN T_SUPERVISE as SUP on CCTV.n_CCTV_ID = SUP.n_CCTV_ID
      LEFT JOIN T_STATISTICS as ST on LF.v_LOG_FILE_NAME = ST.v_LOG_FILE_NAME
      LEFT JOIN T_NEIGHBOR_SPACE as NP on TP.n_TAKE_SPACE_ID = NP.n_SPACE_1 OR TP.n_TAKE_SPACE_ID = NP.n_SPACE_2
      LEFT JOIN T_COMPOSED as CP on NP.n_NEIGHBOR_ID = CP.n_NEIGHBOR_ID
      LEFT JOIN T_SEQUENCE as SQ on CP.n_SEQ_ID = SQ.n_SEQ_ID
      WHERE MF.n_ADMIN_ID = ${req.user.USER_INDEX}
      GROUP BY LF.v_LOG_FILE_NAME
    `;

    return conn.query(sql);
  })
  .then((sql_result) => {

    let resultStr = `영상파일이름, 로그파일이름, 시작시간, 끝시간, CCTV_ID, CCTV_MODEL, 총 레코드 수, 촬영길이, 총 객체수, 평균 색상(R), 평균 색상(G), 평균 색상(B), 평균 크기(X), 평균 크기(Y), 평균 속도(X), 평균 속도(Y), 평균 위치(X), 평균 위치(Y),\n`;

    for (let i = 0; i < sql_result.length; i++) {
      let current = sql_result[i];
      resultStr += `${current.v_MOVIE_FILE_NAME}, ${current.v_LOG_FILE_NAME}, ${current.dt_START_TIME}, ${current.dt_END_TIME}, ${current.n_CCTV_ID}, ${current.v_MODEL}, ${current.n_RECORD_NUM}, ${current.n_LENGTH}, ${current.n_OBJECT_NUM}, ${current.f_AVG_COLOR_R}, ${current.f_AVG_COLOR_G}, ${current.f_AVG_COLOR_B}, ${current.f_AVG_SIZE_X}, ${current.f_AVG_SIZE_Y}, ${current.f_AVG_SPEED_X}, ${current.f_AVG_SPEED_Y}, ${current.f_AVG_POSITION_X}, ${current.f_AVG_POSITION_Y},\n`;
    }

    fs.writeFile(`./upload/${req.user.USER_INDEX}_log_statistics.csv`, resultStr, (err) => {
      if (err) throw err;
      res.send(`${req.user.USER_INDEX}_log_statistics.csv`);
    });
  });
});


router.post('/movie/deleteBeforeDate', (req, res, next) => {
  let target_date = req.body.targetDate;


  db.getConnection()
  .then((connection) => {
    conn = connection;

    let sql = `
      SELECT
        LF.*,
        MF.*
      FROM T_MOVIE_FILE as MF
      LEFT JOIN T_METALOG_FILE as LF on MF.v_MOVIE_FILE_NAME = LF.v_MOVIE_FILE_NAME
      WHERE MF.dt_END_TIME < '${target_date}' AND MF.n_ADMIN_ID = ${req.user.USER_INDEX}
    `;

    return conn.query(sql);
  })
  .then((sql_result) => {
    for (let i = 0; i < sql_result.length; i++) {
      if (sql_result[i].v_LOG_FILE_NAME == null) continue;

      let dir = './upload/' + sql_result[i].v_LOG_FILE_NAME.split('_')[1];
      fs.access(`${dir}/${sql_result[i].v_LOG_FILE_NAME}`, fs.constants.R_OK | fs.constants.W_OK, (err) => {
        if (!err) fs.unlinkSync(`${dir}/${sql_result[i].v_LOG_FILE_NAME}`);
      });
    }

    for (let i = 0; i < sql_result.length; i++) {
      let dir = './upload/' + sql_result[i].v_MOVIE_FILE_NAME.split('_')[1];
      fs.access(`${dir}/${sql_result[i].v_MOVIE_FILE_NAME}`, fs.constants.R_OK | fs.constants.W_OK, (err) => {
        if (!err) fs.unlinkSync(`${dir}/${sql_result[i].v_MOVIE_FILE_NAME}`);
      });
    }

    let sql = `
      DELETE
      FROM T_MOVIE_FILE
      WHERE dt_END_TIME < '${target_date}' AND n_ADMIN_ID = ${req.user.USER_INDEX}
    `;

    return conn.query(sql);
  })
  .then((sql_result) => {
    res.send(`${sql_result['affectedRows']}`);
  });
});



router.post('/log/deleteBeforeDate', (req, res, next) => {
  let target_date = req.body.targetDate;


  db.getConnection()
  .then((connection) => {
    conn = connection;

    let sql = `
      SELECT
        LF.*,
        MF.*
      FROM T_MOVIE_FILE as MF
      LEFT JOIN T_METALOG_FILE as LF on MF.v_MOVIE_FILE_NAME = LF.v_MOVIE_FILE_NAME
      WHERE MF.dt_END_TIME < '${target_date}' AND MF.n_ADMIN_ID = ${req.user.USER_INDEX}
    `;

    return conn.query(sql);
  })
  .then((sql_result) => {
    if (sql_result.length == 0) return false;

    let where_sql = '';

    for (let i = 0; i < sql_result.length; i++) {
      if (where_sql != '') where_sql += ' OR ';
      where_sql += `v_LOG_FILE_NAME = '${sql_result[i].v_LOG_FILE_NAME}'`;

      let dir = './upload/' + sql_result[i].v_LOG_FILE_NAME.split('_')[1];
      fs.access(`${dir}/${sql_result[i].v_LOG_FILE_NAME}`, fs.constants.R_OK | fs.constants.W_OK, (err) => {
        if (!err) fs.unlinkSync(`${dir}/${sql_result[i].v_LOG_FILE_NAME}`);
      });
    }

    if (where_sql != '') where_sql = 'WHERE ' + where_sql;

    let sql = `
      DELETE
      FROM T_METALOG_FILE
      ${where_sql}
    `;

    return conn.query(sql);
  })
  .then((sql_result) => {
    if (sql_result == false) res.send('0');
    else res.send(`${sql_result['affectedRows']}`);
  });
});

module.exports = router;
