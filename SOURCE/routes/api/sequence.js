const express = require('express');
const mysql = require('mysql');
const crypto = require('crypto');
const passport = require('passport');

let router = express.Router();

let db = require(__DBdir);
let conn;

router.post('/append', (req, res, next) => {
	let np_list_add = JSON.parse(req.body.np_list_add);
	let seq_name = req.body.seq_name;

	let dup_check_condition = ``;
	for (let i = 0; i < np_list_add.length; i++) {
		dup_check_condition += ` AND SUM(CPS.n_NEIGHBOR_ID = ${np_list_add[i]}) = 1`;
	}

	let is_cur_prc_right = true;
	let is_res_send = false;

	db.getConnection()
	.then((connection)=> {
		conn = connection;

		let sql = `
			SELECT *
			FROM T_SEQUENCE
			WHERE v_SEQ_NAME = '${seq_name}'
		`;

		return conn.query(sql);
	})
	.then((sql_result) => {
		if(sql_result.length != 0) {
			res.send('-2');
			is_cur_prc_right = false;
			is_res_send = true;
			return false;
		}

		let sql = `
			SELECT SEQ.n_SEQ_ID
			FROM T_SEQUENCE as SEQ
			LEFT JOIN T_COMPOSED as CPS on SEQ.n_SEQ_ID = CPS.n_SEQ_ID
			GROUP BY SEQ.n_SEQ_ID
			HAVING COUNT(*) = ${np_list_add.length} ${dup_check_condition}
		`;

		return conn.query(sql);
	})
	.then((sql_result) => {
		if (!is_cur_prc_right) return false;

		if(sql_result.length != 0) {
			is_cur_prc_right = false;
			res.send('-1');
			return false;
		}

		let sql = `
			INSERT INTO T_SEQUENCE (v_SEQ_NAME)
			VALUES (${mysql.escape(seq_name)})
		`;

		return conn.query(sql);
	}).then((sql_result)=> {
		if (!is_cur_prc_right) return false;

		let insert_id = sql_result.insertId;
		let np_seq_map = "";

		np_list_add.map((element, i) => {
			if(np_seq_map != "") np_seq_map+=",";
			np_seq_map +=`(${insert_id}, ${element}, ${i})`;
		});

		let sql = `
			INSERT INTO T_COMPOSED
			(n_SEQ_ID, n_NEIGHBOR_ID, n_NP_INDEX)
			VALUES ${np_seq_map}
		`

		return conn.query(sql);
	}).then((sql_result) => {
		if (!is_cur_prc_right) {
			if (is_res_send) {
				return false;
			}

			res.send('9999');
		}


		res.send('0');
	});
});

router.post('/delete', (req, res, next) => {

	db.getConnection()
	.then((connection) => {
		conn = connection;

		let sql = `
		DELETE FROM T_SEQUENCE
		WHERE n_SEQ_ID = ${req.body.seq_id}
		`;

		return conn.query(sql);
	})
	.then((sql_result) => {
		res.send('0');
	});
});


router.post('/update', (req, res, next) => {
	let np_list_add = JSON.parse(req.body.np_list_add);
	let seq_id = req.body.seq_id;
	let seq_name = req.body.seq_name;

	let dup_check_condition = ``;
	for (let i = 0; i < np_list_add.length; i++) {
		dup_check_condition += ` AND SUM(CPS.n_NEIGHBOR_ID = ${np_list_add[i]}) = 1`;
	}

	let is_cur_prc_right = true;
	let is_res_send = false;

	db.getConnection()
	.then((connection)=> {
		conn = connection;

		let sql = `
			SELECT *
			FROM T_SEQUENCE
			WHERE v_SEQ_NAME = '${seq_name}' and n_SEQ_ID != ${seq_id}
		`;

		return conn.query(sql);
	})
	.then((sql_result) => {
		if(sql_result.length != 0) {
			res.send('-2');
			is_cur_prc_right = false;
			is_res_send = true;
			return false;
		}

		let sql = `
			SELECT SEQ.n_SEQ_ID
			FROM T_SEQUENCE as SEQ
			LEFT JOIN T_COMPOSED as CPS on SEQ.n_SEQ_ID = CPS.n_SEQ_ID
			GROUP BY SEQ.n_SEQ_ID
			HAVING COUNT(*) = ${np_list_add.length} ${dup_check_condition}
		`;

		return conn.query(sql);
	})
	.then((sql_result) => {
		if (!is_cur_prc_right) return false;

		if(sql_result.length != 0) {
			is_cur_prc_right = false;
			res.send('-1');
			return false;
		}

		let sql = `
			DELETE
			FROM T_COMPOSED
			WHERE n_SEQ_ID = ${seq_id}
		`;

		return conn.query(sql);
	})
	.then((sql_result)=> {
		if (!is_cur_prc_right) return false;

		let insert_id = sql_result.insertId;
		let np_seq_map = "";

		np_list_add.map((element, i) => {
			if(np_seq_map != "") np_seq_map+=",";
			np_seq_map +=`(${seq_id}, ${element}, ${i})`;
		});

		let sql = `
			INSERT INTO T_COMPOSED
			(n_SEQ_ID, n_NEIGHBOR_ID, n_NP_INDEX)
			VALUES ${np_seq_map}
		`

		return conn.query(sql);
	}).then((sql_result) => {
		if (!is_cur_prc_right) {
			if (is_res_send) {
				return false;
			}

			res.send('9999');
		}


		res.send('0');
	});
});


router.post('/search/', (req, res, next) => {
	let seq_name = req.body.seq_name;
	let seq_nps = req.body.seq_nps;

	let seq_np_list = seq_nps.split(',!,');
	let where_sql_arr = [];
	let having_sql_arr = [];

	if (seq_name != '') {
		where_sql_arr.push(`BINARY SEQ.v_SEQ_NAME LIKE ${mysql.escape('%'+seq_name+'%')}`);
	}

	if (seq_nps != '') {
		for (let i = 0; i < seq_np_list.length; i++) {
			having_sql_arr.push(`SUM(NP.n_NEIGHBOR_ID = ${seq_np_list[i]}) = 1`);
		}
	}

	let where_sql = "";
	let having_sql = "";

	if (where_sql_arr.length != 0) {
		where_sql = `WHERE ${where_sql_arr[0]}`;
	}

	if (having_sql_arr.length != 0) {
		for (let i = 0; i < having_sql_arr.length; i++) {
			if (having_sql == "") having_sql += `HAVING ${having_sql_arr[i]}`;
			else having_sql += ` AND ${having_sql_arr[i]}`;
		}
	}

	db.getConnection()
	.then((connection) => {
		conn = connection;

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
		 ${where_sql}
		 GROUP BY SEQ.n_SEQ_ID
		 ${having_sql}
		`;

		return conn.query(sql);
	}).then((sql_result) => {

		res.send(sql_result);

	});
});


module.exports = router;
