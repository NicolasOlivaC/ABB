var express = require('express');
var router = express.Router();
var con = require('../../mysqlcon');
var { isLoggedIn, isNotLoggedIn, isPM, isEL } = require('../../public/lib/out')

router.get('/api/q1', isLoggedIn, isPM, async function(req,res, next) {  //kk _ Toda la informacion de un heroe en especifico.
  var row = await con.query('SELECT tipo FROM users WHERE rut_users = ?', req.session.passport.user)
  con.query("SELECT * FROM inventario ORDER BY inventario.stock DESC", (err, inventario) => {
      
      if (err) {
        res.json(err);
      }
      res.json(inventario);
      // res.render('test', {
      //   data: motores
      // });
    });
  });

module.exports = router;