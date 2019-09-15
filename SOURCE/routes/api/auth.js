const express = require('express');
const mysql = require('mysql');
const crypto = require('crypto');
const passport = require('passport');

let router = express.Router();

let db = require(__DBdir);
let conn;

/* GET home page. */
router.post('/signin', function(req, res, next) {
  //  패스포트 모듈로 인증 시도
  passport.authenticate('local', function (err, user, info) {

    var error = err || info;
    if (error) return res.redirect('/?valid=1');
    if (!user) return res.redirect('/?valid=2');

    req.logIn(user, function(err) {
      if (err) { return next(err); }

      return res.redirect('/');
    });

  })(req, res, next);
});


router.post('/signup', (req, res, next) => {
  let post_data = req.body;
  let res_obj = {};

  let salt = Math.round((new Date().valueOf() * Math.random())).toString() + "";
  let hashpass = crypto.createHash("sha512").update(post_data['login_pwd'] + salt).digest("hex").toString();

  let users = {
    'login_id' : mysql.escape(post_data['login_id'].trim()),
    'login_name' : mysql.escape(post_data['login_name'].trim()),
    'login_pwd' : mysql.escape(hashpass),
    'login_salt' : mysql.escape(salt),
    'login_phone' : mysql.escape(post_data['login_phone'])
  };

  let conn;

  db.getConnection()
  .then((connection) => {
    conn = connection;

    let sql = `
      INSERT INTO T_ADMINISTRATOR
        (v_LOGIN_ID, v_PASSWORD, v_SALT, v_NAME, tn_POSITION, v_PHONE_NUMBER, dt_CREATE_DATE, dt_RECENT_LOGIN)
        VALUES (${users['login_id']}, ${users['login_pwd']}, ${users['login_salt']}, ${users['login_name']}, '1', ${users['login_phone']}, now(), now())
    `;

    return conn.query(sql, (error, results, fields) => {
      if (error) res.send(`${error.errno}`);

      db.releaseConnection(conn);
      res.send('0');
    });
  });
});

router.get('/signout', function(req, res, next) {
  req.logOut();
  req.session.destroy(function (err) {
    res.redirect('/');
  });
});

router.post('/changePw', (req, res, next) => {
  let post_data = req.body;
  let res_obj = {};

  let salt = Math.round((new Date().valueOf() * Math.random())).toString() + "";
  let hashpass = crypto.createHash("sha512").update(post_data['login_pwd'] + salt).digest("hex").toString();

  let conn;

  db.getConnection()
  .then((connection) => {
    conn = connection;

    let sql = `
      UPDATE T_ADMINISTRATOR
      SET v_PASSWORD = ${mysql.escape(hashpass)}, v_SALT = ${mysql.escape(salt)}
      WHERE n_ADMIN_ID = ${mysql.escape(post_data['admin_id'])}
    `;

    return conn.query(sql, (error, results, fields) => {
      if (error) res.send(`${error.errno}`);

      db.releaseConnection(conn);
      res.send('0');
    });
  });
});


router.post('/search', (req, res, next) => {
  let post_data = req.body;

  let where_sql = '';

  // id condition
  if (post_data.id_cond != '') {
    where_sql = `(SUB.v_LOGIN_ID Like "%${post_data.id_cond}%")`;
  }

  // name condition
  if (post_data.name_cond != '') {
    if (where_sql != '') where_sql += ' AND ';
    where_sql = `(SUB.v_NAME Like "%${post_data.name_cond}%")`;
  }

  // cctv condition
  if (post_data.cctv_cond != '') {
    if (where_sql != '') where_sql += ' AND ';

    let cctv_list = post_data.cctv_cond.split(',!,');

    where_sql += "(";

    let cctv_sql = "";
    cctv_list.map((cctv_id) => {
      if (cctv_sql != "") cctv_sql += ` OR `;
      cctv_sql += `SUB.cctvs Like '%${cctv_id}%'`;
    });

    where_sql += cctv_sql + ")";
  }

  // join condition
  let join_sql = "";
  if (post_data.join_cond1 != '') {
    join_sql = `SUB.dt_CREATE_DATE >= '${post_data.join_cond1}'`;
  }

  if (post_data.join_cond2 != '') {
    if (join_sql == '') join_sql = `SUB.dt_CREATE_DATE <= '${post_data.join_cond2}' + interval 2 day`;
    else join_sql += ` and SUB.dt_CREATE_DATE <= '${post_data.join_cond2}' + interval 2 day`;
  }

  // recent condition
  let recent_sql = "";
  if (post_data.recent_cond1 != '') {
    recent_sql = `SUB.dt_RECENT_LOGIN >= '${post_data.recent_cond1}'`;
  }

  if (post_data.recent_cond2 != '') {
    if (recent_sql == '') recent_sql = `SUB.dt_RECENT_LOGIN <= '${post_data.recent_cond2}' + interval 2 day`;
    else recent_sql += ` and SUB.dt_RECENT_LOGIN <= '${post_data.recent_cond2}' + interval 2 day`;
  }

  if (join_sql != '') {
    if (where_sql != '')
      where_sql += ` AND (${join_sql})`;
    else
      where_sql = `(${join_sql})`;
  }

  if (recent_sql != '') {
    if (where_sql != '')
      where_sql += ` AND (${recent_sql})`;
    else
      where_sql = `(${recent_sql})`;
  }

  if (where_sql != "") {
    where_sql = "WHERE (" + where_sql + ")";
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
          ADM.*,
          GROUP_CONCAT(CCTV.n_CCTV_ID SEPARATOR ',!,') as cctvs
        FROM T_ADMINISTRATOR as ADM
        LEFT JOIN T_SUPERVISE as SUP on ADM.n_ADMIN_ID = SUP.n_ADMIN_ID
        LEFT JOIN T_CCTV as CCTV on SUP.n_CCTV_ID = CCTV.n_CCTV_ID
        WHERE ADM.tn_POSITION != 0
        GROUP BY ADM.n_ADMIN_ID) as SUB
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
      FROM T_ADMINISTRATOR
      WHERE tn_POSITION != 0 and n_ADMIN_ID = '${post_data.admin_id}' and v_SALT = '${post_data.salt}'
    `;

    return conn.query(sql);
  })
  .then((sql_result) => {
    res.send(`${sql_result['affectedRows']}`);
  });
});

router.post('/changeCCTV', (req, res, next) => {
  let post_data = req.body;


  let delete_sql = "";
  if (post_data.delete_list_cnt > 1) {
    post_data['delete_list[]'].map((deleteEl) => {
      if (delete_sql != "") delete_sql += " OR ";
      delete_sql += `n_CCTV_ID = ${deleteEl}`;
    });
  } else if (post_data.delete_list_cnt == 1) {
    delete_sql += `n_CCTV_ID = ${post_data['delete_list[]']}`;
  }

  if (delete_sql != "") delete_sql = " AND (" + delete_sql + ")"

  let add_sql = "";
  if (post_data.add_list_cnt > 1) {
    post_data['add_list[]'].map((addEl) => {
      if (add_sql != "") add_sql += ",";
      add_sql += `('${post_data.adm_id}', '${addEl}')`;
    });
  } else if (post_data.add_list_cnt == 1) {
    add_sql += `('${post_data.adm_id}', '${post_data['add_list[]']}')`;
  }

  // query
  let conn;

  db.getConnection()
  .then((connection) => {
    conn = connection;

    if (post_data.delete_list_cnt > 0) {
      let sql = `
        DELETE
        FROM T_SUPERVISE
        WHERE n_ADMIN_ID = ${post_data.adm_id} ${delete_sql}
      `;

      return conn.query(sql);
    } else {
      return true;
    }
  })
  .then((sql_result) => {

    if (post_data.add_list_cnt > 0) {
      let sql = `
        INSERT
        INTO T_SUPERVISE (n_ADMIN_ID, n_CCTV_ID)
        VALUES ${add_sql}
      `;

      return conn.query(sql);
    } else {
      return true;
    }
  })
  .then((sql_result) => {
    res.send('0');
  });
});

module.exports = router;
