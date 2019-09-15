const LocalStrategy = require('passport-local').Strategy;
const mysql = require('mysql');
const crypto = require('crypto');

const db = require(__DBdir);

exports.setup = function (passport) {
  passport.serializeUser(function(session, done) {
    //console.log('serialize');
    done(null, session);
  });

  passport.deserializeUser(function(session, done) {
    //console.log('deserialize');
    done(null, session);
  });

  passport.use(new LocalStrategy({
        usernameField: 'userId',
        passwordField: 'userPw'
      },
      function(id, password, done) {
      // 인증 정보 체크 로직
        let conn;

        let user_id = mysql.escape(id);
        let user_pwd = mysql.escape(password);

        db.getConnection()
        .then((connection) => {
          conn = connection;

          let sql = `
            SELECT
              *
            FROM T_ADMINISTRATOR
            WHERE v_LOGIN_ID = ${user_id}
            LIMIT 1
          `;

          return conn.query(sql);
        })
        .then((sql_result) => {
          if (sql_result.length > 0) {
            let pass = sql_result[0]['v_PASSWORD'];
            let salt = sql_result[0]['v_SALT'];

            var userHashPass = crypto.createHash("sha512").update(password + salt).digest("hex");

            if (userHashPass == pass) {
              let session = {
                'USER_ID' : sql_result[0]['v_LOGIN_ID'],
                'USER_INDEX' : sql_result[0]['n_ADMIN_ID'],
                'USER_NAME' : sql_result[0]['v_NAME'],
                'USER_POSITION' : sql_result[0]['tn_POSITION']
              };

              conn.query(`UPDATE T_ADMINISTRATOR SET dt_RECENT_LOGIN = now() WHERE n_ADMIN_ID = '${sql_result[0]['v_USER_ID']}'`);
              db.releaseConnection(conn);
              return done(null, session);
            } else {
              db.releaseConnection(conn);
              return done(null, false, { message: 'Fail to login.' });
            }
          } else {
            db.releaseConnection(conn);
            return done(null, false, { message: 'Fail to login.' });
          }
        });
      }
  ));

};
