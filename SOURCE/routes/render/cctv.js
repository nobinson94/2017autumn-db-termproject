let express = require('express');
let geolib = require('geolib');
let router = express.Router();

const mysql = require('mysql');
const db = require(__DBdir);

let conn;

/* GET home page. */
router.get('/', function(req, res, next) {
  if (req.isAuthenticated()) {
    // logined
    res.redirect('/cctv/monitor/')
  } else {
    // not logined
    res.redirect('/');
  }
});

router.get('/monitor', (req, res, next) => {
  if (req.isAuthenticated()) {
    let target_cctv = [];
    let cctv_list = [];
    let tp_list = [];

    db.getConnection()
    .then((connection) => {
      conn = connection;

      let sql = `
        SELECT
          CCTV.*,
          GROUP_CONCAT(ADM.v_NAME SEPARATOR ', ') as admins
        FROM T_CCTV as CCTV
        LEFT JOIN T_SUPERVISE as SUP on CCTV.n_CCTV_ID = SUP.n_CCTV_ID
        LEFT JOIN T_ADMINISTRATOR as ADM on SUP.n_ADMIN_ID = ADM.n_ADMIN_ID
        WHERE ADM.n_ADMIN_ID = ${req.user.USER_INDEX}
        GROUP BY CCTV.n_CCTV_ID
      `;

      return conn.query(sql);
    })
    .then((sql_result) => {
      cctv_list = sql_result;

      if (cctv_list.length == 0) {
        res.render('cctv', {
          'session': req.user,
          'pageType': 0,
          'data': {
            'cctvList': cctv_list,
            'targetCctv': target_cctv,
            'tpList': tp_list
          }
        });
      }

      let sql = `
        SELECT
          CCTV.*,
          GROUP_CONCAT(ADM.v_NAME SEPARATOR ', ') as admins
        FROM T_CCTV as CCTV
        LEFT JOIN T_SUPERVISE as SUP on CCTV.n_CCTV_ID = SUP.n_CCTV_ID
        LEFT JOIN T_ADMINISTRATOR as ADM on SUP.n_ADMIN_ID = ADM.n_ADMIN_ID
        WHERE ADM.n_ADMIN_ID = ${req.user.USER_INDEX}
        GROUP BY CCTV.n_CCTV_ID
        LIMIT 1
      `;

      return conn.query(sql);
    })
    .then((sql_result) => {
      target_cctv = sql_result;

      let sql = `
        SELECT
          *
        FROM T_CCTV as CCTV
        LEFT JOIN T_SUPERVISE as SUP on CCTV.n_CCTV_ID = SUP.n_CCTV_ID
        LEFT JOIN T_ADMINISTRATOR as ADM on SUP.n_ADMIN_ID = ADM.n_ADMIN_ID
        LEFT JOIN T_TAKE as TAKE on CCTV.n_CCTV_ID = TAKE.n_CCTV_ID
        LEFT JOIN T_TAKE_SPACE as TP on TAKE.n_TAKE_SPACE_ID = TP.n_TAKE_SPACE_ID
        WHERE ADM.n_ADMIN_ID = ${req.user.USER_INDEX} and CCTV.n_CCTV_ID = ${target_cctv[0].n_CCTV_ID}
      `;

      return conn.query(sql);
    }).then((sql_result) => {
      tp_list = sql_result;

      res.render('cctv', {
        'session': req.user,
        'pageType': 0,
        'data': {
          'cctvList': cctv_list,
          'targetCctv': target_cctv,
          'tpList': tp_list
        }
      });
    });
  } else {
    res.redirect('/');
  }
});

router.get('/monitor/:id', (req, res, next) => {
  if (req.isAuthenticated()) {
    let target_cctv_id = req.params.id;
    let target_cctv = [];
    let cctv_list = [];
    let tp_list = [];


    db.getConnection()
    .then((connection) => {
      conn = connection;

      let sql = `
        SELECT
          CCTV.*,
          GROUP_CONCAT(ADM.v_NAME SEPARATOR ', ') as admins
        FROM T_CCTV as CCTV
        LEFT JOIN T_SUPERVISE as SUP on CCTV.n_CCTV_ID = SUP.n_CCTV_ID
        LEFT JOIN T_ADMINISTRATOR as ADM on SUP.n_ADMIN_ID = ADM.n_ADMIN_ID
        WHERE ADM.n_ADMIN_ID = ${req.user.USER_INDEX}
        GROUP BY CCTV.n_CCTV_ID
      `;

      return conn.query(sql);
    })
    .then((sql_result) => {
      cctv_list = sql_result;

      if (cctv_list.length == 0) {
        res.render('cctv', {
          'session': req.user,
          'pageType': 0,
          'data': {
            'cctvList': cctv_list,
            'targetCctv': target_cctv,
            'tpList': tp_list
          }
        });
      }

      let sql = `
        SELECT
          CCTV.*,
          GROUP_CONCAT(ADM.v_NAME SEPARATOR ', ') as admins
        FROM T_CCTV as CCTV
        LEFT JOIN T_SUPERVISE as SUP on CCTV.n_CCTV_ID = SUP.n_CCTV_ID
        LEFT JOIN T_ADMINISTRATOR as ADM on SUP.n_ADMIN_ID = ADM.n_ADMIN_ID
        WHERE ADM.n_ADMIN_ID = ${req.user.USER_INDEX} and CCTV.n_CCTV_ID = ${target_cctv_id}
        GROUP BY CCTV.n_CCTV_ID
        LIMIT 1
      `;

      return conn.query(sql);
    })
    .then((sql_result) => {
      target_cctv = sql_result;

      let sql = `
        SELECT
          *
        FROM T_CCTV as CCTV
        LEFT JOIN T_SUPERVISE as SUP on CCTV.n_CCTV_ID = SUP.n_CCTV_ID
        LEFT JOIN T_ADMINISTRATOR as ADM on SUP.n_ADMIN_ID = ADM.n_ADMIN_ID
        LEFT JOIN T_TAKE as TAKE on CCTV.n_CCTV_ID = TAKE.n_CCTV_ID
        LEFT JOIN T_TAKE_SPACE as TP on TAKE.n_TAKE_SPACE_ID = TP.n_TAKE_SPACE_ID
        WHERE ADM.n_ADMIN_ID = ${req.user.USER_INDEX} and CCTV.n_CCTV_ID = ${target_cctv[0].n_CCTV_ID}
      `;

      return conn.query(sql);
    }).then((sql_result) => {
      tp_list = sql_result;

      res.render('cctv', {
        'session': req.user,
        'pageType': 0,
        'data': {
          'cctvList': cctv_list,
          'targetCctv': target_cctv,
          'tpList': tp_list
        }
      });
    });
  } else {
    res.redirect('/');
  }
});


router.get('/edit', (req, res, next) => {
  if (req.isAuthenticated()) {
    let target_cctv = [];
    let cctv_list = [];
    let tp_list = [];
    let all_tp_list = [];
    let addable_tp_list = [];

    db.getConnection()
    .then((connection) => {
      conn = connection;

      let sql = `
        SELECT
          CCTV.*,
          GROUP_CONCAT(ADM.v_NAME SEPARATOR ', ') as admins
        FROM T_CCTV as CCTV
        LEFT JOIN T_SUPERVISE as SUP on CCTV.n_CCTV_ID = SUP.n_CCTV_ID
        LEFT JOIN T_ADMINISTRATOR as ADM on SUP.n_ADMIN_ID = ADM.n_ADMIN_ID
        WHERE ADM.n_ADMIN_ID = ${req.user.USER_INDEX}
        GROUP BY CCTV.n_CCTV_ID
      `;

      return conn.query(sql);
    })
    .then((sql_result) => {
      cctv_list = sql_result;

      if (cctv_list.length == 0) {
        res.render('cctv_edit', {
          'session': req.user,
          'pageType': 1,
          'data': {
            'cctvList': cctv_list,
            'targetCctv': target_cctv,
            'tpList': tp_list
          }
        });
      }

      let sql = `
        SELECT
          CCTV.*,
          GROUP_CONCAT(ADM.v_NAME SEPARATOR ', ') as admins
        FROM T_CCTV as CCTV
        LEFT JOIN T_SUPERVISE as SUP on CCTV.n_CCTV_ID = SUP.n_CCTV_ID
        LEFT JOIN T_ADMINISTRATOR as ADM on SUP.n_ADMIN_ID = ADM.n_ADMIN_ID
        WHERE ADM.n_ADMIN_ID = ${req.user.USER_INDEX}
        GROUP BY CCTV.n_CCTV_ID
        LIMIT 1
      `;

      return conn.query(sql);
    })
    .then((sql_result) => {
      target_cctv = sql_result;

      let sql = `
        SELECT
          *
        FROM T_CCTV as CCTV
        LEFT JOIN T_SUPERVISE as SUP on CCTV.n_CCTV_ID = SUP.n_CCTV_ID
        LEFT JOIN T_ADMINISTRATOR as ADM on SUP.n_ADMIN_ID = ADM.n_ADMIN_ID
        LEFT JOIN T_TAKE as TAKE on CCTV.n_CCTV_ID = TAKE.n_CCTV_ID
        LEFT JOIN T_TAKE_SPACE as TP on TAKE.n_TAKE_SPACE_ID = TP.n_TAKE_SPACE_ID
        WHERE ADM.n_ADMIN_ID = ${req.user.USER_INDEX} and CCTV.n_CCTV_ID = ${target_cctv[0].n_CCTV_ID}
      `;

      return conn.query(sql);
    }).then((sql_result) => {
      tp_list = sql_result;

      let sql = `
        SELECT
          *
        FROM (SELECT
            TP.*,
            GROUP_CONCAT(IFNULL(TAKE.n_CCTV_ID, 0) SEPARATOR ', ') as cctvs
          FROM T_TAKE_SPACE as TP
          LEFT JOIN T_TAKE as TAKE on TP.n_TAKE_SPACE_ID = TAKE.n_TAKE_SPACE_ID
          GROUP BY TP.n_TAKE_SPACE_ID) AS SUB
        WHERE SUB.cctvs NOT LIKE '%${target_cctv[0].n_CCTV_ID}%'
      `;

      return conn.query(sql);
    }).then((sql_result) => {
      all_tp_list = sql_result;

      var k = 0;
      for(var i = 0; i < all_tp_list.length; i++) {
        var distance = geolib.getDistance(
          {latitude: all_tp_list[i].f_LAT, longitude: all_tp_list[i].f_LNG},
          {latitude: target_cctv[0].f_LAT, longitude: target_cctv[0].f_LNG}
        );
        if(distance<100) {
          addable_tp_list[k] = all_tp_list[i];
          k++;
        }
      }
      res.render('cctv_edit', {
        'session': req.user,
        'pageType': 1,
        'data': {
          'cctvList': cctv_list,
          'targetCctv': target_cctv,
          'tpList': tp_list,
          'allTpList': all_tp_list,
          'addableTpList': addable_tp_list
        }
      });
    });
  } else {
    res.redirect('/');
  }
});


router.get('/edit/:id', (req, res, next) => {
  if (req.isAuthenticated()) {
    let target_cctv = [];
    let cctv_list = [];
    let tp_list = [];
    let all_tp_list = [];
    let addable_tp_list = [];

    db.getConnection()
    .then((connection) => {
      conn = connection;

      let sql = `
        SELECT
          CCTV.*,
          GROUP_CONCAT(ADM.v_NAME SEPARATOR ', ') as admins
        FROM T_CCTV as CCTV
        LEFT JOIN T_SUPERVISE as SUP on CCTV.n_CCTV_ID = SUP.n_CCTV_ID
        LEFT JOIN T_ADMINISTRATOR as ADM on SUP.n_ADMIN_ID = ADM.n_ADMIN_ID
        WHERE ADM.n_ADMIN_ID = ${req.user.USER_INDEX}
        GROUP BY CCTV.n_CCTV_ID
      `;

      return conn.query(sql);
    })
    .then((sql_result) => {
      cctv_list = sql_result;

      if (cctv_list.length == 0) {
        res.render('cctv_edit', {
          'session': req.user,
          'pageType': 1,
          'data': {
            'cctvList': cctv_list,
            'targetCctv': target_cctv,
            'tpList': tp_list
          }
        });
      }

      let sql = `
        SELECT
          CCTV.*,
          GROUP_CONCAT(ADM.v_NAME SEPARATOR ', ') as admins
        FROM T_CCTV as CCTV
        LEFT JOIN T_SUPERVISE as SUP on CCTV.n_CCTV_ID = SUP.n_CCTV_ID
        LEFT JOIN T_ADMINISTRATOR as ADM on SUP.n_ADMIN_ID = ADM.n_ADMIN_ID
        WHERE ADM.n_ADMIN_ID = ${req.user.USER_INDEX} and CCTV.n_CCTV_ID = ${req.params.id}
        GROUP BY CCTV.n_CCTV_ID
      `;

      return conn.query(sql);
    })
    .then((sql_result) => {
      target_cctv = sql_result;

      let sql = `
        SELECT
          *
        FROM T_CCTV as CCTV
        LEFT JOIN T_SUPERVISE as SUP on CCTV.n_CCTV_ID = SUP.n_CCTV_ID
        LEFT JOIN T_ADMINISTRATOR as ADM on SUP.n_ADMIN_ID = ADM.n_ADMIN_ID
        LEFT JOIN T_TAKE as TAKE on CCTV.n_CCTV_ID = TAKE.n_CCTV_ID
        LEFT JOIN T_TAKE_SPACE as TP on TAKE.n_TAKE_SPACE_ID = TP.n_TAKE_SPACE_ID
        WHERE ADM.n_ADMIN_ID = ${req.user.USER_INDEX} and CCTV.n_CCTV_ID = ${target_cctv[0].n_CCTV_ID}
      `;

      return conn.query(sql);
    }).then((sql_result) => {
      tp_list = sql_result;

      let sql = `
        SELECT
          *
        FROM (SELECT
            TP.*,
            GROUP_CONCAT(IFNULL(TAKE.n_CCTV_ID, 0) SEPARATOR ', ') as cctvs
          FROM T_TAKE_SPACE as TP
          LEFT JOIN T_TAKE as TAKE on TP.n_TAKE_SPACE_ID = TAKE.n_TAKE_SPACE_ID
          GROUP BY TP.n_TAKE_SPACE_ID) AS SUB
        WHERE SUB.cctvs NOT LIKE '%${target_cctv[0].n_CCTV_ID}%'
      `;

      return conn.query(sql);
    }).then((sql_result) => {
      all_tp_list = sql_result;
      
      var k = 0;
      for(var i = 0; i < all_tp_list.length; i++) {
        var distance = geolib.getDistance(
          {latitude: all_tp_list[i].f_LAT, longitude: all_tp_list[i].f_LNG},
          {latitude: target_cctv[0].f_LAT, longitude: target_cctv[0].f_LNG}
        );
        if(distance<100) {
          addable_tp_list[k] = all_tp_list[i];
          k++;
        }
      }
      res.render('cctv_edit', {
        'session': req.user,
        'pageType': 1,
        'data': {
          'cctvList': cctv_list,
          'targetCctv': target_cctv,
          'tpList': tp_list,
          'allTpList': all_tp_list,
          'addableTpList': addable_tp_list
        }
      });
    });
  } else {
    res.redirect('/');
  }
});

router.get('/add', (req, res, next) => {
  if (req.isAuthenticated()) {
    if (req.user.USER_POSITION != 0) {
      res.redirect('/');
    }

    let user_list, cctv_list, tp_list;

    db.getConnection()
    .then((connection) => {
      conn = connection;

      let sql = `
        SELECT
          CCTV.*,
          GROUP_CONCAT(ADM.v_NAME SEPARATOR ', ') as admins
        FROM T_CCTV as CCTV
        LEFT JOIN T_SUPERVISE as SUP on CCTV.n_CCTV_ID = SUP.n_CCTV_ID
        LEFT JOIN T_ADMINISTRATOR as ADM on SUP.n_ADMIN_ID = ADM.n_ADMIN_ID
        GROUP BY CCTV.n_CCTV_ID
      `;

      return conn.query(sql);
    })
    .then((sql_result) => {
      cctv_list = sql_result;

      let sql = `
        SELECT
          *
        FROM T_ADMINISTRATOR
        WHERE tn_POSITION != 0
      `;

      return conn.query(sql);
    })
    .then((sql_result) => {
      user_list = sql_result;

      let sql = `
        SELECT
          *
        FROM T_TAKE_SPACE
      `;

      return conn.query(sql);
    })
    .then((sql_result) => {
      tp_list = sql_result;

      res.render('cctv_add', {
        'session': req.user,
        'pageType': 2,
        'data': {
          'userList': user_list,
          'cctvList': cctv_list,
          'tpList': tp_list
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
