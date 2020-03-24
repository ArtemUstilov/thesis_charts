const express = require('express');
const router = express.Router();
const pgp = require("pg-promise")();

const HOST = '146.148.7.100';
const DB = 'thesis';

router.get('/', function (req, res, next) {
  const {user, password, l, n, sel_type, table, run_id = 0, offset = 0, type, init='all_0',limit = 100} = req.query || {};
  res.set('Access-Control-Allow-Origin', '*');
  try {
    const db = pgp({
      host: HOST,
      database: DB,
      user,
      password
    });
    db.any(`SELECT * FROM $1:name WHERE ${n ? 'n = $2' : 'size_pop_type = $2'} AND l = $3  AND init = $8 AND sel_type = $4 AND run_id = $5 ORDER BY iteration ASC LIMIT $6 OFFSET $7`,
      [table, n || type, l, sel_type, run_id, limit, offset, init])
      .then(function (data) {
        res.send(data);
      })
      .catch(function (error) {
        res.send(error);
        console.error("ERROR:", error);
      });
  } catch (e) {
    res.send(e);
  }
});

router.get('/available', function (req, res, next) {
  const {user, password, table, variant} = req.query || {};
  res.set('Access-Control-Allow-Origin', '*');
  try {
    const db = pgp({
      host: HOST,
      database: DB,
      user,
      password
    });
    db.any(`SELECT DISTINCT l,${variant == 1 ? 'n' : 'size_pop_type'},run_id, sel_type, init FROM $1:name ORDER BY l`,
      [table])
      .then(function (data) {
        res.send(data);
      })
      .catch(function (error) {
        res.send(error);
        console.error("ERROR:", error);
      });
  } catch (e) {
    res.send(e);
  }
});

router.get('/details', function (req, res, next) {
  const {user, password, l, n, sel_type, table, run_id = 0, type, init='all_0' } = req.query || {};
  res.set('Access-Control-Allow-Origin', '*');
  try {
    const db = pgp({
      host: HOST,
      database: DB,
      user,
      password
    });
    db.any(`SELECT mode_pair, mode_ideal, mode_wild FROM $1:name WHERE ${n ? 'n = $2' : 'size_pop_type = $2'} AND l = $3  AND init = $6 AND sel_type = $4 AND run_id = $5 ORDER BY iteration ASC`,
      [table, n || type, l, sel_type, run_id, init])
      .then(function (data) {
        res.send(data);
      })
      .catch(function (error) {
        res.send(error);
        console.error("ERROR:", error);
      });
  } catch (e) {
    res.send(e);
  }
});

module.exports = router;
