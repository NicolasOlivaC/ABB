var express = require('express');
var router = express.Router();
var con = require('../../mysqlcon');
var { isLoggedIn, isNotLoggedIn, isPM, isEL } = require('../../public/lib/out')

router.get('/api/q3', isLoggedIn, isPM, async function(req,res, next) {  //kk _ Toda la informacion de un heroe en especifico.
  var row = await con.query('SELECT tipo FROM users WHERE rut_users = ?', req.session.passport.user)
  con.query("SELECT SUM(detalle_ventas.cantidad) AS suma_cantidad, detalle_ventas.motores_catalog_number AS catalog_number FROM detalle_ventas GROUP BY detalle_ventas.motores_catalog_number", (err, v_motores) => {
      
      if (err) {
        res.json(err);
      }
      res.json(v_motores);
      // res.render('test', {
      //   data: motores
      // });
    });
  });

module.exports = router;