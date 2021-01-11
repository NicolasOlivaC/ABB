var express = require('express');
var router = express.Router();
var con = require('../mysqlcon');
var { isLoggedIn, isNotLoggedIn, isPM, isEL } = require('../public/lib/out')

/* GET home page. */
router.get('/gestionEstadisticas', isLoggedIn, isPM, async function(req, res, next) {
  var row = await con.query('SELECT tipo FROM users WHERE rut_users = ?', req.session.passport.user)
  con.query("SELECT * from inventario, motores where motores.catalog_number = inventario.motores_catalog_number", (err, inventario) => {

    if (err) {
      res.json(err);
    }
    res.render('PM/gestionEstadisticas', {
      title: 'Gestión de estadísticas',
      tipo:row[0].tipo,
      data: inventario
    });
  });
});

router.post('/estadisticasPersonalizadas', isLoggedIn, isPM, async function(req, res, next) {
  var row = await con.query('SELECT tipo FROM users WHERE rut_users = ?', req.session.passport.user)
  const data=req.body;
  console.log(data.fecha_inicial)
  con.query("SELECT SUM(detalle_ventas.cantidad) AS suma_cantidad, detalle_ventas.motores_catalog_number AS catalog_number FROM detalle_ventas WHERE fecha BETWEEN ? and ? GROUP BY detalle_ventas.motores_catalog_number ",[data.fecha_inicial, data.fecha_final], (err, inventario) => {
    console.log(inventario)
    if (err) {
      res.json(err);
    }
    res.render('PM/estadisticasPersonalizadas', {
      title: 'Gestión de estadísticas',
      tipo:row[0].tipo,
      fecha_i: data.fecha_inicial,
      fecha_f: data.fecha_final,
      data: inventario
    });
  });
});


module.exports = router;
