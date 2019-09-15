let express = require('express');
let router = express.Router();

const mysql = require('mysql');
const db = require(__DBdir);

let conn;

/* GET home page. */
router.get('/', function(req, res, next) {
  if (req.isAuthenticated()) {
    // logined
    res.redirect('/file/movie/');
  } else {
    // not logined
    res.redirect('/');
  }
});

router.get('/movie/', (req, res, next) => {
  if (req.isAuthenticated()) {
    let movie_list = [],
        cctv_list = [],
        tp_list = [],
        seq_list = [];

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
      `;

      return conn.query(sql);
    })
    .then((sql_result) => {
      movie_list = sql_result;

      let sql = `
        SELECT
          CCTV.*,
          GROUP_CONCAT(CONCAT(TP.n_TAKE_SPACE_ID, '!', TP.v_ADDRESS, ' ', TP.v_BUILDING, ' ', TP.v_FLOOR, ' ', TP.v_SITE) SEPARATOR ',') as tps
        FROM T_CCTV as CCTV
        LEFT JOIN T_SUPERVISE as SUP on CCTV.n_CCTV_ID = SUP.n_CCTV_ID
        LEFT JOIN T_TAKE as TAKE on CCTV.n_CCTV_ID = TAKE.n_CCTV_ID
        LEFT JOIN T_TAKE_SPACE as TP on TAKE.n_TAKE_SPACE_ID = TP.n_TAKE_SPACE_ID
        WHERE SUP.n_ADMIN_ID = ${req.user.USER_INDEX}
        GROUP BY CCTV.n_CCTV_ID
      `;

      return conn.query(sql);
    })
    .then((sql_result) => {
      cctv_list = sql_result;
      let sql = `
        SELECT
          *
        FROM T_TAKE_SPACE
      `;

      return conn.query(sql);
    })
    .then((sql_result) => {
      tp_list = sql_result;
      let sql = `
        SELECT
          *
        FROM T_SEQUENCE
      `;

      return conn.query(sql);
    })
    .then((sql_result) => {
      seq_list = sql_result;

      res.render('file_movie', {
        'session': req.user,
        'pageType': 3,
        'data': {
          'cctvList': cctv_list,
          'movieList': movie_list,
          'tpList': tp_list,
          'seqList': seq_list
        }
      });
    });
  } else {
    res.redirect('/');
  }
});


router.get('/log/', (req, res, next) => {
  if (req.isAuthenticated()) {
    let log_list = [],
        cctv_list = [],
        tp_list = [],
        seq_list = [],
        movie_list = [];

    db.getConnection()
    .then((connection) => {
      conn = connection;

      let sql = `
        SELECT
          MF.*,
          TP.*,
          CCTV.*,
          GROUP_CONCAT(DISTINCT(SQ.v_SEQ_NAME) SEPARATOR ', ') as SEQS
        FROM T_MOVIE_FILE as MF
        LEFT JOIN T_TAKE_SPACE as TP on MF.n_TAKE_SPACE_ID = TP.n_TAKE_SPACE_ID
        LEFT JOIN T_CCTV as CCTV on MF.n_CCTV_ID = CCTV.n_CCTV_ID
        LEFT JOIN T_SUPERVISE as SUP on CCTV.n_CCTV_ID = SUP.n_CCTV_ID
        LEFT JOIN T_METALOG_FILE as LF on MF.v_MOVIE_FILE_NAME = LF.v_MOVIE_FILE_NAME
        LEFT JOIN T_STATISTICS as ST on LF.v_LOG_FILE_NAME = ST.v_LOG_FILE_NAME
        LEFT JOIN T_NEIGHBOR_SPACE as NP on TP.n_TAKE_SPACE_ID = NP.n_SPACE_1 OR TP.n_TAKE_SPACE_ID = NP.n_SPACE_2
        LEFT JOIN T_COMPOSED as CP on NP.n_NEIGHBOR_ID = CP.n_NEIGHBOR_ID
        LEFT JOIN T_SEQUENCE as SQ on CP.n_SEQ_ID = SQ.n_SEQ_ID
        WHERE MF.n_ADMIN_ID = ${req.user.USER_INDEX} AND LF.v_LOG_FILE_NAME is NULL
        GROUP BY MF.v_MOVIE_FILE_NAME
      `;

      return conn.query(sql);
    })
    .then((sql_result) => {
      movie_list = sql_result;

      let sql = `
        SELECT
          LF.*,
          MF.v_MOVIE_FILE_NAME, MF.dt_START_TIME, MF.dt_END_TIME,
          TP.*,
          CCTV.*,
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
      log_list = sql_result;

      let sql = `
        SELECT
          CCTV.*,
          GROUP_CONCAT(CONCAT(TP.n_TAKE_SPACE_ID, '!', TP.v_ADDRESS, ' ', TP.v_BUILDING, ' ', TP.v_FLOOR, ' ', TP.v_SITE) SEPARATOR ',') as tps
        FROM T_CCTV as CCTV
        LEFT JOIN T_SUPERVISE as SUP on CCTV.n_CCTV_ID = SUP.n_CCTV_ID
        LEFT JOIN T_TAKE as TAKE on CCTV.n_CCTV_ID = TAKE.n_CCTV_ID
        LEFT JOIN T_TAKE_SPACE as TP on TAKE.n_TAKE_SPACE_ID = TP.n_TAKE_SPACE_ID
        WHERE SUP.n_ADMIN_ID = ${req.user.USER_INDEX}
        GROUP BY CCTV.n_CCTV_ID
      `;

      return conn.query(sql);
    })
    .then((sql_result) => {
      cctv_list = sql_result;
      let sql = `
        SELECT
          *
        FROM T_TAKE_SPACE
      `;

      return conn.query(sql);
    })
    .then((sql_result) => {
      tp_list = sql_result;
      let sql = `
        SELECT
          *
        FROM T_SEQUENCE
      `;

      return conn.query(sql);
    })
    .then((sql_result) => {
      seq_list = sql_result;

      res.render('file_log', {
        'session': req.user,
        'pageType': 4,
        'data': {
          'cctvList': cctv_list,
          'logList': log_list,
          'tpList': tp_list,
          'seqList': seq_list,
          'movieList': movie_list
        }
      });
    });
  } else {
    res.redirect('/');
  }
});

module.exports = router;
