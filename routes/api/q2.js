var express = require('express');
var router = express.Router();
var con = require('../../mysqlcon');
var { isLoggedIn, isNotLoggedIn, isPM, isEL } = require('../../public/lib/out')

router.get('/api/q2', isLoggedIn, isPM, async function(req,res, next) {  //kk _ Toda la informacion de un heroe en especifico.
  var row = await con.query('SELECT tipo FROM users WHERE rut_users = ?', req.session.passport.user)
  con.query("SELECT COUNT(ventas.id_ventas) AS n_ventas, clientes.empresa FROM ventas, clientes WHERE ventas.rut_cliente = clientes.rut_clientes GROUP BY clientes.empresa ORDER BY n_ventas DESC", (err, v_clientes) => {
      
      if (err) {
        res.json(err);
      }
      res.json(v_clientes);
      // res.render('test', {
      //   data: motores
      // });
  });
});

  router.post('/api/filtrarComprasCliente', isLoggedIn, isPM, async (req, res) => {
  const data = req.body;
  // console.log(data);
  var row = await con.query('SELECT tipo FROM users WHERE rut_users = ?', req.session.passport.user)
  await con.query('SELECT COUNT(ventas.id_ventas) AS n_ventas, clientes.empresa FROM ventas, clientes WHERE ventas.rut_cliente = clientes.rut_clientes AND ventas.fecha > ? AND ventas.fecha < ? GROUP BY clientes.empresa ORDER BY n_ventas DESC', [data.fecha_inicial, data.fecha_final], (err, f_v_clientes) => {
    if (err) {
      res.json(err);
    }
    res.json(f_v_clientes);
    // res.redirect('filtrarComprasCliente');
  });
});

// router.get('/api/filtrarComprasCliente', isLoggedIn, isPM, async function(req,res, next) {  //kk _ Toda la informacion de un heroe en especifico.
//   var row = await con.query('SELECT tipo FROM users WHERE rut_users = ?', req.session.passport.user)

//   console.log("test15");
//   // con.query("SELECT COUNT(ventas.id_ventas) AS n_ventas, clientes.empresa FROM ventas, clientes WHERE ventas.rut_cliente = clientes.rut_clientes GROUP BY clientes.empresa ORDER BY n_ventas DESC", (err, v_clientes) => {    
//   //   if (err) {
//   //     res.json(err);
//   //   }
//   //   res.json(v_clientes);
//   // });
// });

module.exports = router;